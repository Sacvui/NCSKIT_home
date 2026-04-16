import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/utils/rate-limit';
import { sanitizeInput } from '@/utils/security';
import CryptoJS from 'crypto-js';
import { validateOrigin } from '@/utils/csrf-protection';

/**
 * Resolve the Gemini API key to use for this request.
 *
 * Priority:
 *  1. GEMINI_API_KEY server env var (shared key — preferred)
 *  2. x-encrypted-key header (user's personal key, AES-encrypted client-side)
 *  3. x-gemini-api-key header (legacy plaintext — deprecated)
 */
function resolveGeminiKey(req: NextRequest): string | null {
    // 1. Server-side shared key
    const serverKey = process.env.GEMINI_API_KEY;
    if (serverKey) return serverKey;

    // 2. Encrypted personal key
    const encryptedKey = req.headers.get('x-encrypted-key');
    if (encryptedKey) {
        try {
            const baseSalt = process.env.NEXT_PUBLIC_KEY_SALT || 'ncsstat-gemini-v2';
            const bytes = CryptoJS.AES.decrypt(encryptedKey, baseSalt);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if (decrypted && decrypted.length > 10) return decrypted;
        } catch {
            // Fall through to legacy header
        }
    }

    // 3. Legacy plaintext header (deprecated)
    const legacyKey = req.headers.get('x-gemini-api-key');
    if (legacyKey) {
        console.warn('[ai-suggest] Received deprecated x-gemini-api-key header. Please upgrade client to use x-encrypted-key.');
        return legacyKey;
    }

    return null;
}

export async function POST(req: NextRequest) {
    try {
        // 0. Origin validation (CSRF protection)
        if (!validateOrigin(req)) {
            return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
        }

        // 1. Rate Limiting Protection
        const rateLimitResult = await checkRateLimit(req, 20);
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.' },
                { status: 429 }
            );
        }

        // 2. Resolve API key
        const apiKey = resolveGeminiKey(req);
        if (!apiKey) {
            return NextResponse.json(
                {
                    error: process.env.GEMINI_API_KEY
                        ? 'Lỗi cấu hình server AI.'
                        : 'Yêu cầu nhập API Key cá nhân trong phần Cài đặt AI (Sidebar).'
                },
                { status: 401 }
            );
        }

        const { researchDescription, dataDescription } = await req.json();

        // 3. Input Sanitization
        const safeResearch = sanitizeInput(researchDescription);
        const safeData = sanitizeInput(dataDescription);

        const prompt = `
Bạn là chuyên gia phương pháp nghiên cứu, hãy gợi ý phương pháp phân tích thống kê phù hợp.

Mô tả nghiên cứu: ${safeResearch}
Mô tả dữ liệu: ${safeData}

Hãy trả lời theo cấu trúc JSON sau:
{
  "suggestedMethod": "Tên phương pháp (VD: EFA, CFA, SEM, Regression, T-test, ANOVA)",
  "reasoning": "Giải thích tại sao nên dùng phương pháp này (2-3 câu)",
  "alternatives": ["Phương pháp thay thế 1", "Phương pháp thay thế 2"],
  "requirements": ["Yêu cầu 1", "Yêu cầu 2"],
  "steps": ["Bước 1", "Bước 2", "Bước 3"]
}

Chỉ trả về JSON, không thêm text khác.
`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        // Extract JSON from response (remove markdown code blocks if present)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse AI response');
        }

        const suggestion = JSON.parse(jsonMatch[0]);

        return NextResponse.json(suggestion);

    } catch (error) {
        console.error('AI Suggest error:', error);
        return NextResponse.json(
            { error: 'Failed to generate suggestion' },
            { status: 500 }
        );
    }
}
