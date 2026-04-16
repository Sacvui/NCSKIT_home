import { useState, useEffect } from 'react';
import { Sparkles, Bot, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AIInterpretationFeedback } from './feedback/AIInterpretationFeedback';
import { explainResults } from '@/lib/ai-explainer';
import { hasStoredApiKey, retrieveApiKey } from '@/utils/key-encryption';

interface AIInterpretationProps {
    analysisType: string;
    results: any;
    userProfile?: any;
}

export function AIInterpretation({ analysisType, results, userProfile }: AIInterpretationProps) {
    const [apiKey, setApiKey] = useState<string>('');
    const [explanation, setExplanation] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cache, setCache] = useState<Map<string, string>>(new Map());
    const [lastCallTime, setLastCallTime] = useState(0);

    // Load key state from encrypted storage (we only need to know if a key exists,
    // not the raw value — the actual key is read by ai-explainer.ts via getEncryptedKeyForHeader)
    useEffect(() => {
        const loadKeyState = () => {
            // Check if server has a shared key configured (no personal key needed)
            // or if user has stored a personal key
            const hasPersonalKey = hasStoredApiKey();
            // Use a placeholder to indicate key is available — actual value not needed here
            setApiKey(hasPersonalKey ? '***stored***' : '');
        };

        loadKeyState();

        // Re-check when user saves/clears key in AISettings
        window.addEventListener('gemini-key-updated', loadKeyState);
        return () => window.removeEventListener('gemini-key-updated', loadKeyState);
    }, []);

    const generateExplanation = async () => {
        if (!apiKey) {
            setError('Vui lòng nhập Gemini API Key trong phần Cài đặt AI (trên thanh cài đặt biến).');
            return;
        }

        // Rate limiting: 10s cooldown
        const now = Date.now();
        if (now - lastCallTime < 10000) {
            setError('Vui lòng đợi 10 giây trước khi gọi AI lại (tránh spam).');
            return;
        }

        // Check cache first
        const cacheKey = JSON.stringify({ analysisType, results: results?.data || results, userProfile });
        if (cache.has(cacheKey)) {
            setExplanation(cache.get(cacheKey)!);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);
        setLastCallTime(now);

        try {
            // Build Context from User Profile
            let context = '';
            if (userProfile) {
                context = `Người dùng là: ${userProfile.academic_level || 'N/A'}`;
                if (userProfile.research_field) context += `, lĩnh vực: ${userProfile.research_field}`;
                if (userProfile.organization) context += `, đơn vị: ${userProfile.organization}`;
            }

            // Use centralized Explainer Service (key sent via encrypted header automatically)
            const response = await explainResults(analysisType, results, context);
            const text = response.explanation;

            setExplanation(text);

            // Cache the response
            const newCache = new Map(cache);
            newCache.set(cacheKey, text);
            setCache(newCache);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Có lỗi xảy ra khi gọi AI.');
        } finally {
            setLoading(false);
        }
    };

    if (!apiKey) return null; // Hide if no key (or show prompt?)

    return (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-100 rounded-xl p-6 mt-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-600 rounded-lg shadow-md shadow-indigo-200">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-indigo-900">Trợ lý AI Phân tích</h3>
            </div>

            {!explanation && !loading && (
                <div className="text-center py-6">
                    <p className="text-indigo-600 mb-4 text-sm">
                        AI sẽ tự động đọc kết quả và viết báo cáo phân tích gợi ý cho bạn.
                    </p>
                    <button
                        onClick={generateExplanation}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-lg shadow-indigo-200 transition-all hover:scale-105 flex items-center gap-2 mx-auto"
                    >
                        <Bot className="w-5 h-5" />
                        Giải thích kết quả ngay
                    </button>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                    <p className="text-indigo-600 animate-pulse font-medium">Đang suy nghĩ và viết báo cáo...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-2 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {explanation && (
                <div className="prose prose-indigo prose-sm max-w-none bg-white/50 p-6 rounded-xl border border-indigo-100/50">
                    <ReactMarkdown>{explanation}</ReactMarkdown>
                    <div className="mt-4 pt-4 border-t border-indigo-100 flex justify-end">
                        <button
                            onClick={generateExplanation}
                            className="text-xs text-indigo-500 hover:text-indigo-700 font-medium underline"
                        >
                            Tạo lại phân tích khác
                        </button>
                    </div>

                    {/* Feedback Part 2 */}
                    <AIInterpretationFeedback analysisType={analysisType} />
                </div>
            )}
        </div>
    );
}
