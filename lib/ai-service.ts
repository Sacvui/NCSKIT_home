/**
 * AI Service — Unified AI caller
 *
 * Priority:
 *  1. Local Ollama (if OLLAMA_BASE_URL + OLLAMA_MODEL configured in .env.local)
 *  2. Gemini Cloud (fallback — returns null so route handler calls Gemini)
 *
 * Usage in .env.local for local AI:
 *   OLLAMA_BASE_URL=http://localhost:11434
 *   OLLAMA_MODEL=qwen2.5:14b
 */

import { logger } from '@/utils/logger';

export interface AIChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface OllamaResponse {
    message: {
        role: string;
        content: string;
    };
    done: boolean;
}

/**
 * Call AI — tries Ollama local first, returns null to fallback to Gemini.
 *
 * @param messages - Chat messages array
 * @param temperature - Sampling temperature (default 0.7)
 * @param timeoutMs - Request timeout in ms (default 30s — local AI can be slow)
 * @returns Response text string, or null if Ollama unavailable
 */
export async function callAI(
    messages: AIChatMessage[],
    temperature = 0.7,
    timeoutMs = 30_000
): Promise<string | null> {
    let ollamaUrl = process.env.OLLAMA_BASE_URL;
    const ollamaModel = process.env.OLLAMA_MODEL;

    // Only attempt Ollama if both env vars are configured
    if (!ollamaUrl || !ollamaModel) {
        return null;
    }

    // Normalize URL — remove trailing slash
    if (ollamaUrl.endsWith('/')) {
        ollamaUrl = ollamaUrl.slice(0, -1);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        logger.debug(`[AI-Service] Calling local Ollama (${ollamaModel}) at ${ollamaUrl}...`);

        const response = await fetch(`${ollamaUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: ollamaModel,
                messages,
                stream: false,
                options: { temperature },
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            logger.warn(`[AI-Service] Ollama returned ${response.status}, falling back to Gemini.`);
            return null;
        }

        const data: OllamaResponse = await response.json();

        // Validate response format
        if (!data?.message?.content || typeof data.message.content !== 'string') {
            logger.warn('[AI-Service] Ollama response format invalid, falling back to Gemini.');
            return null;
        }

        logger.debug('[AI-Service] Local Ollama success!');
        return data.message.content;

    } catch (error: unknown) {
        clearTimeout(timeoutId);

        if (error instanceof Error && error.name === 'AbortError') {
            logger.warn(`[AI-Service] Ollama request timed out after ${timeoutMs / 1000}s, falling back to Gemini.`);
        } else {
            logger.warn('[AI-Service] Local Ollama unavailable, falling back to Gemini.', error);
        }
        return null;
    }
}
