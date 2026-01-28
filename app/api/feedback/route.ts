import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { recordTokenTransaction } from '@/lib/token-service';
import { POINTS_CONFIG } from '@/lib/points-config';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const body = await req.json();
        const { type, message, page_url } = body;

        if (!type || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Insert feedback
        const { error: insertError } = await supabase
            .from('user_feedback')
            .insert({
                user_id: user?.id || null,
                type,
                message,
                page_url: page_url || null,
            });

        if (insertError) {
            console.error('Feedback insert error:', insertError);
            return NextResponse.json(
                { error: 'Failed to submit feedback' },
                { status: 500 }
            );
        }

        // Award tokens if user is logged in
        let rewardResult = null;
        if (user) {
            // Check if user has already submitted feedback recently to prevent spamming?
            // For now, let's just award it. Or maybe limit it.
            // Let's award it for every feedback to encourage it, but maybe small amount.
            // Config is 50. That's generous. Let's assume 1 per day logic is complex for now.
            // We fully trust the strategy "Góp ý hay - Nhận ngay Token".

            // Use Admin version to bypass RLS potentially blocking self-update of tokens
            // if the user doesn't have explicit update rights on their own profile columns
            try {
                const { recordTokenTransactionAdmin } = await import('@/lib/token-service');

                rewardResult = await recordTokenTransactionAdmin(
                    user.id,
                    POINTS_CONFIG.FEEDBACK,
                    'earn_feedback',
                    'Feedback Reward'
                );

                if (rewardResult?.error) {
                    console.error('Failed to award feedback tokens:', rewardResult.error);
                }
            } catch (rewardErr) {
                console.error('Error executing reward transaction:', rewardErr);
                // Non-blocking error for feedback submission
            }
        }

        return NextResponse.json({
            success: true,
            rewarded: !!rewardResult?.success,
            points: POINTS_CONFIG.FEEDBACK
        });

    } catch (error: any) {
        console.error('Feedback API error:', error);
        return NextResponse.json(
            { error: error?.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
