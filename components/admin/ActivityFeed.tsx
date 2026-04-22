'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/utils/supabase/client';
import { 
    Activity, Clock, User, BarChart3, Coins, 
    AlertCircle, CheckCircle2, Zap 
} from 'lucide-react';

type ActivityLog = {
    id: string;
    user_id: string;
    action_type: string;
    action_details: any;
    created_at: string;
    profiles?: {
        full_name: string | null;
        email: string | null;
    };
};

export default function ActivityFeed() {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = getSupabase();

    useEffect(() => {
        fetchInitialActivities();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('admin_activity_feed')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'activity_logs' },
                async (payload) => {
                    // Fetch profile info for the new log
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('full_name, email')
                        .eq('id', payload.new.user_id)
                        .single();

                    const newActivity = {
                        ...payload.new,
                        profiles: profile
                    } as ActivityLog;

                    setActivities(prev => [newActivity, ...prev].slice(0, 30));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchInitialActivities = async () => {
        const { data, error } = await supabase
            .from('activity_logs')
            .select('id, user_id, action_type, action_details, created_at, profiles(full_name, email)')
            .order('created_at', { ascending: false })
            .limit(20);

        if (data) {
            setActivities(data as any);
        }
        setLoading(false);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'analysis': return <BarChart3 className="w-4 h-4 text-blue-500" />;
            case 'token_transaction': return <Coins className="w-4 h-4 text-emerald-500" />;
            case 'auth': return <Shield className="w-4 h-4 text-purple-500" />;
            case 'error': return <AlertCircle className="w-4 h-4 text-rose-500" />;
            default: return <Zap className="w-4 h-4 text-amber-500" />;
        }
    };

    const formatDetails = (log: ActivityLog) => {
        const { action_type, action_details } = log;
        if (action_type === 'analysis_start') {
            return `Bắt đầu phân tích: ${action_details?.analysis_type || 'N/A'}`;
        }
        if (action_type === 'analysis_complete') {
            return `Hoàn thành ${action_details?.analysis_type || 'N/A'} (${action_details?.duration_ms || 0}ms)`;
        }
        if (action_type === 'token_spent') {
            return `Đã chi ${action_details?.amount || 0} NCS cho ${action_details?.reason || 'dịch vụ'}`;
        }
        return action_type.replace(/_/g, ' ');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    Dòng hoạt động thời gian thực
                </h3>
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
            </div>

            <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto no-scrollbar">
                {activities.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-slate-50/80 transition-colors flex gap-4">
                        <div className="mt-1">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                {getIcon(log.action_type)}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-bold text-slate-900 truncate">
                                    {log.profiles?.full_name || 'Hệ thống'}
                                </span>
                                <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(log.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                                {formatDetails(log)}
                            </p>
                        </div>
                    </div>
                ))}
                {activities.length === 0 && (
                    <div className="p-10 text-center text-slate-400 italic text-sm">
                        Chưa có hoạt động nào ghi nhận.
                    </div>
                )}
            </div>
            
            <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700">
                    Xem tất cả nhật ký →
                </button>
            </div>
        </div>
    );
}

function Shield({ className }: { className?: string }) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>;
}
