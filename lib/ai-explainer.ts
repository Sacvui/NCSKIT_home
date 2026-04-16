/**
 * AI Explainer using Gemini API
 *
 * Security: API keys are NEVER sent in plaintext.
 * - If the server has GEMINI_API_KEY configured, no client key is needed.
 * - If a personal key is provided, it is retrieved from encrypted localStorage
 *   and sent via `x-encrypted-key` header (AES-256 encrypted).
 * - The legacy `x-gemini-api-key` plaintext header is no longer used.
 */

import { getEncryptedKeyForHeader } from '@/utils/key-encryption';

export interface ExplanationRequest {
    analysisType: string;
    results: unknown;
    context?: string;
}

export interface ExplanationResponse {
    explanation: string;
    interpretation: string;
    academicWriting: string;
}

/**
 * Build the auth headers for AI API calls.
 * Sends the encrypted personal key if available; otherwise sends nothing
 * (server will use its own GEMINI_API_KEY env var).
 */
function buildAIHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const encryptedKey = getEncryptedKeyForHeader();
    if (encryptedKey) {
        // Send encrypted key — server decrypts with base salt
        headers['x-encrypted-key'] = encryptedKey;
    }
    // Note: x-gemini-api-key (plaintext) is intentionally NOT sent

    return headers;
}

/**
 * Explain statistical results using AI.
 *
 * @param analysisType - The type of statistical analysis performed
 * @param results - The analysis results object
 * @param context - Optional research context string
 * @param _apiKey - Deprecated: raw key parameter (ignored — key is read from
 *                  encrypted localStorage automatically). Kept for backward
 *                  compatibility with existing callers.
 */
export async function explainResults(
    analysisType: string,
    results: unknown,
    context: string = '',
    _apiKey?: string  // Deprecated — kept for backward compat, not used
): Promise<ExplanationResponse> {
    try {
        const response = await fetch('/api/ai-explain', {
            method: 'POST',
            headers: buildAIHeaders(),
            body: JSON.stringify({
                analysisType,
                results,
                context
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to get AI explanation:', error);
        throw error;
    }
}

/**
 * Suggest appropriate analysis method based on research description.
 *
 * @param researchDescription - Description of the research
 * @param dataDescription - Description of the data
 * @param _apiKey - Deprecated: raw key parameter (ignored). Kept for backward compat.
 */
export async function suggestAnalysisMethod(
    researchDescription: string,
    dataDescription: string,
    _apiKey?: string  // Deprecated — kept for backward compat, not used
): Promise<{
    suggestedMethod: string;
    reasoning: string;
    alternatives: string[];
}> {
    try {
        const response = await fetch('/api/ai-suggest', {
            method: 'POST',
            headers: buildAIHeaders(),
            body: JSON.stringify({
                researchDescription,
                dataDescription
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to get method suggestion:', error);
        throw error;
    }
}
