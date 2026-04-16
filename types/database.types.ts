/**
 * Supabase Database Types — ncsStat
 *
 * Auto-generated from schema. To regenerate:
 *   npx supabase gen types typescript --project-id nflmoaclnyjwuloydmmv > types/database.types.ts
 *
 * Last updated: 2026-04-17
 * Schema version: migrations up to 20260417000002
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string | null;
                    full_name: string | null;
                    avatar_url: string | null;
                    role: string | null;
                    tokens: number | null;
                    total_earned: number | null;
                    total_spent: number | null;
                    organization: string | null;
                    academic_level: string | null;
                    research_field: string | null;
                    orcid_id: string | null;
                    last_active: string | null;
                    created_at: string;
                    updated_at: string | null;
                    researcher_unlocked_at: string | null;
                };
                Insert: {
                    id: string;
                    email?: string | null;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    role?: string | null;
                    tokens?: number | null;
                    total_earned?: number | null;
                    total_spent?: number | null;
                    organization?: string | null;
                    academic_level?: string | null;
                    research_field?: string | null;
                    orcid_id?: string | null;
                    last_active?: string | null;
                    created_at?: string;
                    updated_at?: string | null;
                    researcher_unlocked_at?: string | null;
                };
                Update: {
                    id?: string;
                    email?: string | null;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    role?: string | null;
                    tokens?: number | null;
                    total_earned?: number | null;
                    total_spent?: number | null;
                    organization?: string | null;
                    academic_level?: string | null;
                    research_field?: string | null;
                    orcid_id?: string | null;
                    last_active?: string | null;
                    updated_at?: string | null;
                    researcher_unlocked_at?: string | null;
                };
            };
            token_transactions: {
                Row: {
                    id: string;
                    user_id: string;
                    amount: number;
                    type: string;
                    description: string | null;
                    related_id: string | null;
                    balance_after: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    amount: number;
                    type: string;
                    description?: string | null;
                    related_id?: string | null;
                    balance_after: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    amount?: number;
                    type?: string;
                    description?: string | null;
                    related_id?: string | null;
                    balance_after?: number;
                };
            };
            user_feedback: {
                Row: {
                    id: string;
                    user_id: string | null;
                    type: 'bug' | 'idea' | 'other';
                    message: string;
                    page_url: string | null;
                    status: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id?: string | null;
                    type: 'bug' | 'idea' | 'other';
                    message: string;
                    page_url?: string | null;
                    status?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string | null;
                    type?: 'bug' | 'idea' | 'other';
                    message?: string;
                    page_url?: string | null;
                    status?: string | null;
                };
            };
            knowledge_articles: {
                Row: {
                    id: string;
                    slug: string;
                    category: string;
                    author: string | null;
                    published_at: string | null;
                    updated_at: string | null;
                    title_vi: string;
                    title_en: string;
                    excerpt_vi: string | null;
                    excerpt_en: string | null;
                    expert_tip_vi: string | null;
                    expert_tip_en: string | null;
                    content_structure: Json;
                    icon_name: string | null;
                    read_time: string | null;
                };
                Insert: {
                    id?: string;
                    slug: string;
                    category: string;
                    author?: string | null;
                    published_at?: string | null;
                    updated_at?: string | null;
                    title_vi: string;
                    title_en: string;
                    excerpt_vi?: string | null;
                    excerpt_en?: string | null;
                    expert_tip_vi?: string | null;
                    expert_tip_en?: string | null;
                    content_structure?: Json;
                    icon_name?: string | null;
                    read_time?: string | null;
                };
                Update: {
                    id?: string;
                    slug?: string;
                    category?: string;
                    author?: string | null;
                    published_at?: string | null;
                    updated_at?: string | null;
                    title_vi?: string;
                    title_en?: string;
                    excerpt_vi?: string | null;
                    excerpt_en?: string | null;
                    expert_tip_vi?: string | null;
                    expert_tip_en?: string | null;
                    content_structure?: Json;
                    icon_name?: string | null;
                    read_time?: string | null;
                };
            };
            activity_logs: {
                Row: {
                    id: string;
                    user_id: string;
                    action_type: string;
                    action_details: Json | null;
                    points_earned: number | null;
                    points_spent: number | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    action_type: string;
                    action_details?: Json | null;
                    points_earned?: number | null;
                    points_spent?: number | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    action_type?: string;
                    action_details?: Json | null;
                    points_earned?: number | null;
                    points_spent?: number | null;
                };
            };
            user_sessions: {
                Row: {
                    id: string;
                    user_id: string;
                    ip_address: string | null;
                    user_agent: string | null;
                    login_at: string;
                    logout_at: string | null;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    ip_address?: string | null;
                    user_agent?: string | null;
                    login_at?: string;
                    logout_at?: string | null;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    ip_address?: string | null;
                    user_agent?: string | null;
                    login_at?: string;
                    logout_at?: string | null;
                };
            };
            invitations: {
                Row: {
                    id: string;
                    inviter_id: string;
                    invitee_email: string | null;
                    code: string;
                    status: string | null;
                    created_at: string;
                    used_at: string | null;
                };
                Insert: {
                    id?: string;
                    inviter_id: string;
                    invitee_email?: string | null;
                    code: string;
                    status?: string | null;
                    created_at?: string;
                    used_at?: string | null;
                };
                Update: {
                    id?: string;
                    inviter_id?: string;
                    invitee_email?: string | null;
                    code?: string;
                    status?: string | null;
                    used_at?: string | null;
                };
            };
            system_config: {
                Row: {
                    key: string;
                    value: Json;
                    updated_at: string | null;
                };
                Insert: {
                    key: string;
                    value: Json;
                    updated_at?: string | null;
                };
                Update: {
                    key?: string;
                    value?: Json;
                    updated_at?: string | null;
                };
            };
        };
        Views: Record<string, never>;
        Functions: {
            deduct_credits_atomic: {
                Args: {
                    p_user_id: string;
                    p_amount: number;
                    p_reason: string;
                };
                Returns: Json;
            };
            award_credits_atomic: {
                Args: {
                    p_user_id: string;
                    p_amount: number;
                    p_type: string;
                    p_reason: string;
                };
                Returns: Json;
            };
        };
        Enums: Record<string, never>;
    };
}

// ─── Convenience type aliases ─────────────────────────────────────────────────

export type Tables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Update'];

// Common row types
export type Profile = Tables<'profiles'>;
export type TokenTransaction = Tables<'token_transactions'>;
export type UserFeedback = Tables<'user_feedback'>;
export type KnowledgeArticle = Tables<'knowledge_articles'>;
export type ActivityLog = Tables<'activity_logs'>;
export type UserSession = Tables<'user_sessions'>;
export type SystemConfig = Tables<'system_config'>;
