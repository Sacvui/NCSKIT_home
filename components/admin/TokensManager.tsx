'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/utils/supabase/client';
import {
    Search, Coins, ArrowUpRight, ArrowDownRight, History, Shield, User,
    PlusCircle, MinusCircle
} from 'lucide-react';

type Profile = {
    id: string;
    email?: string;
    full_name: string | null;
    tokens: number;
    total_spent: number;
    avatar_url: string | null;
};

type TokenTransaction = {
    id: string;
    user_id: string;
    amount: number;
    type: string;
    description: string;
    balance_after: number;
    created_at: string;
    profiles?: {
        full_name: string | null;
        email: string | null;
    };
};

export default function TokensManager() {
    const [activeTab, setActiveTab] = useState<'balances' | 'history'>('balances');
    
    // Balances State
    const [users, setUsers] = useState<Profile[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [searchUser, setSearchUser] = useState('');
    
    // History State
    const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
    const [loadingTx, setLoadingTx] = useState(true);
    
    // Manage Token Modal State
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
    const [manageType, setManageType] = useState<'add' | 'deduct'>('add');
    const [manageAmount, setManageAmount] = useState<number>(0);
    const [manageReason, setManageReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const supabase = getSupabase();

    useEffect(() => {
        if (activeTab === 'balances') {
            fetchUsers();
        } else {
            fetchTransactions();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, email, tokens, total_spent, avatar_url')
            .order('tokens', { ascending: false });

        if (data && !error) {
            setUsers(data);
        }
        setLoadingUsers(false);
    };

    const fetchTransactions = async () => {
        setLoadingTx(true);
        const { data, error } = await supabase
            .from('token_transactions')
            .select('id, user_id, amount, type, description, balance_after, created_at, profiles(full_name, email)')
            .order('created_at', { ascending: false })
            .limit(100); // Limit temporarily for viewing

        if (data && !error) {
            setTransactions(data as unknown as TokenTransaction[]);
        }
        setLoadingTx(false);
    };

    const filteredUsers = users.filter(u => 
        (u.full_name?.toLowerCase() || '').includes(searchUser.toLowerCase()) || 
        (u.email?.toLowerCase() || '').includes(searchUser.toLowerCase())
    );

    const handleOpenManage = (user: Profile, type: 'add' | 'deduct') => {
        setSelectedUser(user);
        setManageType(type);
        setManageAmount(0);
        setManageReason('');
        setIsManageModalOpen(true);
    };

    const submitTokenChange = async () => {
        if (!selectedUser || manageAmount <= 0) return;
        setIsSubmitting(true);

        const amount = manageType === 'add' ? manageAmount : -manageAmount;
        const newBalance = selectedUser.tokens + amount;

        // Ensure balance doesn't go below 0 (optional constraint, but good practice)
        if (newBalance < 0) {
            alert('Số dư không thể âm');
            setIsSubmitting(false);
            return;
        }

        // Update profile
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ 
                tokens: newBalance,
                updated_at: new Date().toISOString()
            })
            .eq('id', selectedUser.id);

        if (profileError) {
            alert('Lỗi cập nhật số dư');
            setIsSubmitting(false);
            return;
        }

        // Log transaction
        await supabase
            .from('token_transactions')
            .insert({
                user_id: selectedUser.id,
                amount: amount,
                type: manageType === 'add' ? 'admin_bonus' : 'admin_deduct',
                description: manageReason || (manageType === 'add' ? 'Admin cộng token' : 'Admin trừ token'),
                balance_after: newBalance
            });

        // Refresh Data
        await fetchUsers();
        setIsSubmitting(false);
        setIsManageModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 w-full max-w-sm">
                <button 
                    onClick={() => setActiveTab('balances')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'balances' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <Coins className="w-4 h-4" /> Số dư User
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <History className="w-4 h-4" /> Lịch sử Giao dịch
                </button>
            </div>

            {/* Balances Tab */}
            {activeTab === 'balances' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm người dùng..."
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sm"
                            />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Thành viên</th>
                                    <th className="px-6 py-4 text-right">Số dư hiện tại (NCS)</th>
                                    <th className="px-6 py-4 text-right">Đã tiêu</th>
                                    <th className="px-6 py-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loadingUsers ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Đang tải dữ liệu...</td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Không tìm thấy người dùng.</td>
                                    </tr>
                                ) : (
                                    filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                            {user.full_name?.[0]?.toUpperCase() || 'U'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-semibold text-slate-900">{user.full_name || 'Chưa đặt tên'}</div>
                                                        <div className="text-xs text-slate-500">{user.email || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-mono font-bold text-blue-600">{user.tokens?.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-500">
                                                <span className="font-mono">{user.total_spent?.toLocaleString() || 0}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleOpenManage(user, 'add')}
                                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                                                        title="Cộng Token"
                                                    >
                                                        <PlusCircle className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleOpenManage(user, 'deduct')}
                                                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                                                        title="Trừ Token"
                                                    >
                                                        <MinusCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                        <h3 className="font-medium text-slate-800">Giao dịch gần đây</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Thời gian</th>
                                    <th className="px-6 py-4">Người dùng</th>
                                    <th className="px-6 py-4 text-right">Biến động</th>
                                    <th className="px-6 py-4 text-right">Số dư cuối</th>
                                    <th className="px-6 py-4">Loại GD</th>
                                    <th className="px-6 py-4">Diễn giải</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loadingTx ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Đang tải lịch sử...</td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Chưa có giao dịch nào.</td>
                                    </tr>
                                ) : (
                                    transactions.map(tx => (
                                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                                {new Date(tx.created_at).toLocaleString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-800">
                                                {tx.profiles?.full_name || tx.profiles?.email || tx.user_id.substring(0, 8) + '...'}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-mono font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-600">
                                                {tx.balance_after?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={tx.description}>
                                                {tx.description}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Manage Token Modal */}
            {isManageModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className={`p-4 border-b ${manageType === 'add' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'} flex items-center gap-3`}>
                            {manageType === 'add' ? (
                                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                            ) : (
                                <ArrowDownRight className="w-5 h-5 text-rose-600" />
                            )}
                            <h3 className={`font-bold ${manageType === 'add' ? 'text-emerald-900' : 'text-rose-900'}`}>
                                {manageType === 'add' ? 'Cộng NCS Token' : 'Trừ NCS Token'}
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                    {selectedUser.full_name?.[0] || 'U'}
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900">{selectedUser.full_name}</div>
                                    <div className="text-sm text-slate-500">Số dư hiện tại: <span className="font-bold font-mono text-slate-800">{selectedUser.tokens?.toLocaleString()}</span></div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Số lượng NCS</label>
                                <input 
                                    type="number"
                                    min="1"
                                    value={manageAmount}
                                    onChange={(e) => setManageAmount(parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Lý do / Ghi chú</label>
                                <textarea 
                                    rows={3}
                                    value={manageReason}
                                    onChange={(e) => setManageReason(e.target.value)}
                                    placeholder="Vd: Thưởng đóng góp, Thu hồi do hệ thống lỗi..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setIsManageModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={submitTokenChange}
                                    disabled={isSubmitting || manageAmount <= 0}
                                    className={`flex-1 px-4 py-2 font-medium rounded-lg text-white transition-colors disabled:opacity-50
                                        ${manageType === 'add' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}
                                    `}
                                >
                                    {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
