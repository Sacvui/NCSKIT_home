/**
 * Enhanced Activity Tracking System
 * Tracks user activities, session time, and NCS token flow
 */

import { getSupabase } from '@/utils/supabase/client';

// Activity Types - Comprehensive tracking
export type ActivityType =
    // Session events
    | 'session_start'
    | 'session_end'
    | 'session_heartbeat'
    // Page events
    | 'page_view'
    | 'page_exit'
    // Feature usage
    | 'data_upload'
    | 'data_profile'
    | 'analysis_start'
    | 'analysis_complete'
    | 'analysis_error'
    | 'export_start'
    | 'export_complete'
    // NCS Token events
    | 'tokens_earned'
    | 'tokens_spent'
    | 'tokens_adjusted'
    // Auth events
    | 'login'
    | 'logout'
    | 'signup'
    // Engagement events
    | 'feedback_submit'
    | 'share_action'
    | 'invite_sent'
    | 'invite_accepted';

// Activity details interface
export interface ActivityDetails {
    // Session tracking
    session_id?: string;
    session_duration_seconds?: number;

    // Page tracking
    page_url?: string;
    page_title?: string;
    time_on_page_seconds?: number;

    // Analysis tracking
    analysis_type?: string;
    variables_count?: number;
    rows_count?: number;
    execution_time_ms?: number;

    // Token tracking
    tokens_amount?: number;
    tokens_balance_after?: number;
    transaction_type?: string;

    // Data tracking
    file_name?: string;
    file_size_bytes?: number;
    columns_count?: number;

    // Export tracking
    export_format?: string;

    // Error tracking
    error_message?: string;
    error_code?: string;

    // Device info
    device_type?: 'desktop' | 'tablet' | 'mobile';
    browser?: string;
    os?: string;

    // Custom data
    [key: string]: any;
}

// User activity summary
export interface UserActivitySummary {
    userId: string;

    // Time metrics
    totalTimeInAppSeconds: number;
    avgSessionDurationSeconds: number;
    totalSessions: number;
    lastActiveAt: string | null;

    // Usage metrics
    totalAnalyses: number;
    analysesByType: Record<string, number>;
    totalExports: number;
    totalUploads: number;

    // Token metrics
    tokensEarned: number;
    tokensSpent: number;
    tokensBalance: number;
    tokenTransactions: number;

    // Engagement metrics
    feedbackCount: number;
    invitesSent: number;
    invitesAccepted: number;
}

// Session manager - tracks current session
class SessionManager {
    private sessionId: string | null = null;
    private sessionStartTime: Date | null = null;
    private lastHeartbeat: Date | null = null;
    private heartbeatInterval: NodeJS.Timeout | null = null;

    startSession(userId: string): string {
        this.sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        this.sessionStartTime = new Date();

        // Log session start
        logEnhancedActivity(userId, 'session_start', {
            session_id: this.sessionId,
            device_type: this.getDeviceType(),
            browser: this.getBrowser(),
        });

        // Start heartbeat (every 30 seconds)
        this.startHeartbeat(userId);

        return this.sessionId;
    }

    private startHeartbeat(userId: string) {
        if (typeof window === 'undefined') return;

        this.heartbeatInterval = setInterval(() => {
            if (this.sessionId && this.sessionStartTime) {
                const duration = Math.floor((Date.now() - this.sessionStartTime.getTime()) / 1000);
                logEnhancedActivity(userId, 'session_heartbeat', {
                    session_id: this.sessionId,
                    session_duration_seconds: duration,
                });
                this.lastHeartbeat = new Date();
            }
        }, 30000); // Every 30 seconds
    }

    endSession(userId: string) {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        if (this.sessionId && this.sessionStartTime) {
            const duration = Math.floor((Date.now() - this.sessionStartTime.getTime()) / 1000);

            logEnhancedActivity(userId, 'session_end', {
                session_id: this.sessionId,
                session_duration_seconds: duration,
            });
        }

        this.sessionId = null;
        this.sessionStartTime = null;
    }

    getSessionId(): string | null {
        return this.sessionId;
    }

    getSessionDuration(): number {
        if (!this.sessionStartTime) return 0;
        return Math.floor((Date.now() - this.sessionStartTime.getTime()) / 1000);
    }

    private getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
        if (typeof window === 'undefined') return 'desktop';
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    private getBrowser(): string {
        if (typeof navigator === 'undefined') return 'unknown';
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Other';
    }
}

// Global session manager
export const sessionManager = new SessionManager();

/**
 * Log enhanced activity with full details
 */
export async function logEnhancedActivity(
    userId: string,
    activityType: ActivityType,
    details: ActivityDetails = {}
): Promise<boolean> {
    const supabase = getSupabase();

    try {
        const { error } = await supabase
            .from('activity_logs')
            .insert({
                user_id: userId,
                action_type: activityType,
                action_details: {
                    ...details,
                    timestamp: new Date().toISOString(),
                    session_id: details.session_id || sessionManager.getSessionId(),
                },
            });

        if (error) {
            console.warn('[ActivityTracker] Failed to log:', error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.warn('[ActivityTracker] Error:', err);
        return false;
    }
}

/**
 * Log analysis usage with NCS token impact
 */
export async function logAnalysisWithTokens(
    userId: string,
    analysisType: string,
    tokensCost: number,
    details: Partial<ActivityDetails> = {}
): Promise<void> {
    await logEnhancedActivity(userId, 'analysis_complete', {
        analysis_type: analysisType,
        tokens_amount: -tokensCost,
        ...details,
    });

    if (tokensCost > 0) {
        await logEnhancedActivity(userId, 'tokens_spent', {
            tokens_amount: tokensCost,
            transaction_type: `analysis_${analysisType}`,
        });
    }
}

/**
 * Get user activity summary for admin dashboard
 */
export async function getUserActivitySummary(userId: string): Promise<UserActivitySummary | null> {
    const supabase = getSupabase();

    try {
        // Get all activities for user
        const { data: activities, error } = await supabase
            .from('activity_logs')
            .select('action_type, action_details, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error || !activities) {
            console.error('[ActivityTracker] Failed to fetch activities:', error);
            return null;
        }

        // Get profile for token info
        const { data: profile } = await supabase
            .from('profiles')
            .select('tokens, total_earned, total_spent, last_active')
            .eq('id', userId)
            .single();

        // Calculate metrics
        const sessionActivities = activities.filter((a: any) =>
            a.action_type === 'session_end' || a.action_type === 'session_heartbeat'
        );

        const totalTimeInApp = sessionActivities.reduce((sum: number, a: any) => {
            const duration = a.action_details?.session_duration_seconds || 0;
            return sum + duration;
        }, 0);

        const sessions = activities.filter((a: any) => a.action_type === 'session_start').length;

        const analyses = activities.filter((a: any) => a.action_type === 'analysis_complete');
        const analysesByType: Record<string, number> = {};
        analyses.forEach((a: any) => {
            const type = a.action_details?.analysis_type || 'unknown';
            analysesByType[type] = (analysesByType[type] || 0) + 1;
        });

        return {
            userId,
            totalTimeInAppSeconds: totalTimeInApp,
            avgSessionDurationSeconds: sessions > 0 ? Math.floor(totalTimeInApp / sessions) : 0,
            totalSessions: sessions,
            lastActiveAt: profile?.last_active || null,
            totalAnalyses: analyses.length,
            analysesByType,
            totalExports: activities.filter((a: any) => a.action_type === 'export_complete').length,
            totalUploads: activities.filter((a: any) => a.action_type === 'data_upload').length,
            tokensEarned: profile?.total_earned || 0,
            tokensSpent: profile?.total_spent || 0,
            tokensBalance: profile?.tokens || 0,
            tokenTransactions: activities.filter((a: any) =>
                a.action_type === 'tokens_earned' ||
                a.action_type === 'tokens_spent' ||
                a.action_type === 'tokens_adjusted'
            ).length,
            feedbackCount: activities.filter((a: any) => a.action_type === 'feedback_submit').length,
            invitesSent: activities.filter((a: any) => a.action_type === 'invite_sent').length,
            invitesAccepted: activities.filter((a: any) => a.action_type === 'invite_accepted').length,
        };
    } catch (err) {
        console.error('[ActivityTracker] Error getting summary:', err);
        return null;
    }
}

/**
 * Get activity stats for admin dashboard (all users)
 */
export async function getGlobalActivityStats(
    fromDate?: Date,
    toDate?: Date
): Promise<{
    totalSessions: number;
    totalTimeInAppHours: number;
    totalAnalyses: number;
    analysesByType: Record<string, number>;
    totalTokensEarned: number;
    totalTokensSpent: number;
    activeUsers: number;
    newSignups: number;
}> {
    const supabase = getSupabase();

    let query = supabase
        .from('activity_logs')
        .select('action_type, action_details, user_id');

    if (fromDate) {
        query = query.gte('created_at', fromDate.toISOString());
    }
    if (toDate) {
        query = query.lte('created_at', toDate.toISOString());
    }

    const { data: activities, error } = await query;

    if (error || !activities) {
        return {
            totalSessions: 0,
            totalTimeInAppHours: 0,
            totalAnalyses: 0,
            analysesByType: {},
            totalTokensEarned: 0,
            totalTokensSpent: 0,
            activeUsers: 0,
            newSignups: 0,
        };
    }

    const uniqueUsers = new Set(activities.map((a: any) => a.user_id));

    const totalTimeSeconds = activities
        .filter((a: any) => a.action_type === 'session_end')
        .reduce((sum: number, a: any) => sum + (a.action_details?.session_duration_seconds || 0), 0);

    const analyses = activities.filter((a: any) => a.action_type === 'analysis_complete');
    const analysesByType: Record<string, number> = {};
    analyses.forEach((a: any) => {
        const type = a.action_details?.analysis_type || 'unknown';
        analysesByType[type] = (analysesByType[type] || 0) + 1;
    });

    const tokensEarned = activities
        .filter((a: any) => a.action_type === 'tokens_earned')
        .reduce((sum: number, a: any) => sum + (a.action_details?.tokens_amount || 0), 0);

    const tokensSpent = activities
        .filter((a: any) => a.action_type === 'tokens_spent')
        .reduce((sum: number, a: any) => sum + (a.action_details?.tokens_amount || 0), 0);

    return {
        totalSessions: activities.filter((a: any) => a.action_type === 'session_start').length,
        totalTimeInAppHours: Math.round(totalTimeSeconds / 3600 * 10) / 10,
        totalAnalyses: analyses.length,
        analysesByType,
        totalTokensEarned: tokensEarned,
        totalTokensSpent: tokensSpent,
        activeUsers: uniqueUsers.size,
        newSignups: activities.filter((a: any) => a.action_type === 'signup').length,
    };
}
