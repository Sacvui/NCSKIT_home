import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/utils/rate-limit';
import { sanitizeInput } from '@/utils/security';
import CryptoJS from 'crypto-js';
import { validateOrigin } from '@/utils/csrf-protection';
import { callAI, AIChatMessage } from '@/lib/ai-service';

/**
 * Resolve the Gemini API key to use for this request.
 *
 * Priority:
 *  1. GEMINI_API_KEY server env var (shared key â€” preferred)
 *  2. x-encrypted-key header (user's personal key, AES-encrypted client-side)
 *  3. x-gemini-api-key header (legacy plaintext â€” deprecated)
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
        logger.warn('[ai-suggest] Received deprecated x-gemini-api-key header. Please upgrade client to use x-encrypted-key.');
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
                { error: 'QuÃ¡ nhiá»u yÃªu cáº§u. Vui lÃ²ng thá»­ láº¡i sau 1 phÃºt.' },
                { status: 429 }
            );
        }

        // 2. Resolve API key
        const apiKey = resolveGeminiKey(req);
        if (!apiKey) {
            return NextResponse.json(
                {
                    error: process.env.GEMINI_API_KEY
                        ? 'Lá»—i cáº¥u hÃ¬nh server AI.'
                        : 'YÃªu cáº§u nháº­p API Key cÃ¡ nhÃ¢n trong pháº§n CÃ i Ä‘áº·t AI (Sidebar).'
                },
                { status: 401 }
            );
        }

        const { researchDescription, dataDescription } = await req.json();

        // 3. Input Sanitization
        const safeResearch = sanitizeInput(researchDescription);
        const safeData = sanitizeInput(dataDescription);

        const prompt = `
Báº¡n lÃ  chuyÃªn gia phÆ°Æ¡ng phÃ¡p nghiÃªn cá»©u, hÃ£y gá»£i Ã½ phÆ°Æ¡ng phÃ¡p phÃ¢n tÃ­ch thá»‘ng kÃª phÃ¹ há»£p.

MÃ´ táº£ nghiÃªn cá»©u: ${safeResearch}
MÃ´ táº£ dá»¯ liá»‡u: ${safeData}

HÃ£y tráº£ lá»i theo cáº¥u trÃºc JSON sau:
{
  "suggestedMethod": "TÃªn phÆ°Æ¡ng phÃ¡p (VD: EFA, CFA, SEM, Regression, T-test, ANOVA)",
  "reasoning": "Giáº£i thÃ­ch táº¡i sao nÃªn dÃ¹ng phÆ°Æ¡ng phÃ¡p nÃ y (2-3 cÃ¢u)",
  "alternatives": ["PhÆ°Æ¡ng phÃ¡p thay tháº¿ 1", "PhÆ°Æ¡ng phÃ¡p thay tháº¿ 2"],
  "requirements": ["YÃªu cáº§u 1", "YÃªu cáº§u 2"],
  "steps": ["BÆ°á»›c 1", "BÆ°á»›c 2", "BÆ°á»›c 3"]
}

Chá»‰ tráº£ vá» JSON, khÃ´ng thÃªm text khÃ¡c.
`;

        const messages: AIChatMessage[] = [
            { role: 'user', content: prompt }
        ];

        let text = await callAI(messages);

        if (!text) {
            logger.debug('[ai-suggest] Calling Gemini API (Cloud)...');
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
            text = data.candidates[0].content.parts[0].text;
        }

        // Extract JSON from response (remove markdown code blocks if present)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse AI response');
        }

        const suggestion = JSON.parse(jsonMatch[0]);

        return NextResponse.json(suggestion);

    } catch (error) {
        logger.error('AI Suggest error:', error);
        return NextResponse.json(
            { error: 'Failed to generate suggestion' },
            { status: 500 }
        );
    }
}

