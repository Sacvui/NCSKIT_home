'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronDown, Plus, X, Sparkles, Key, Edit2, Trash2, Layers } from 'lucide-react';

interface VariableGroup {
    name: string;
    columns: string[];
    selected: boolean;
}

interface SmartGroupSelectorProps {
    columns: string[];
    onAnalyzeGroup: (selectedColumns: string[], scaleName: string) => void;
    onAnalyzeAllGroups: (groups: { name: string; columns: string[] }[]) => void;
    isAnalyzing: boolean;
    analysisLabel?: string; // Custom label for the analysis (e.g., "Cronbach's Alpha" or "McDonald's Omega")
    minItemsPerGroup?: number; // Minimum items per group (default: 2, omega needs 3)
}

// Extract prefix from column name (first 2-3 letters before numbers)
function extractPrefix(colName: string): string {
    // Match letters at the start, ignore numbers at the end
    const match = colName.match(/^([A-Za-z]+)/);
    if (match) {
        return match[1].toUpperCase();
    }
    return colName.substring(0, 2).toUpperCase();
}

// Auto-group columns by prefix
function autoGroupColumns(columns: string[]): VariableGroup[] {
    const groupMap: Record<string, string[]> = {};

    columns.forEach(col => {
        const prefix = extractPrefix(col);
        if (!groupMap[prefix]) {
            groupMap[prefix] = [];
        }
        groupMap[prefix].push(col);
    });

    return Object.entries(groupMap)
        .filter(([_, cols]) => cols.length >= 2) // Only groups with 2+ items (filtered in component based on minItemsPerGroup)
        .map(([name, cols]) => ({
            name,
            columns: cols,
            selected: true
        }));
}

export function SmartGroupSelector({ columns, onAnalyzeGroup, onAnalyzeAllGroups, isAnalyzing, analysisLabel = "Cronbach's Alpha", minItemsPerGroup = 2 }: SmartGroupSelectorProps) {
    const [groups, setGroups] = useState<VariableGroup[]>([]);
    const [editingGroup, setEditingGroup] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [singleMode, setSingleMode] = useState(false);
    const [selectedSingleGroup, setSelectedSingleGroup] = useState<string | null>(null);

    // Auto-detect groups on mount
    useEffect(() => {
        const detectedGroups = autoGroupColumns(columns);
        setGroups(detectedGroups);
    }, [columns]);

    const toggleGroupSelection = (groupName: string) => {
        setGroups(prev => prev.map(g =>
            g.name === groupName ? { ...g, selected: !g.selected } : g
        ));
    };

    const removeColumnFromGroup = (groupName: string, col: string) => {
        setGroups(prev => prev.map(g =>
            g.name === groupName
                ? { ...g, columns: g.columns.filter(c => c !== col) }
                : g
        ).filter(g => g.columns.length >= 2));
    };

    const startEditingGroup = (group: VariableGroup) => {
        setEditingGroup(group.name);
        setEditName(group.name);
    };

    const saveGroupName = (oldName: string) => {
        if (editName.trim()) {
            setGroups(prev => prev.map(g =>
                g.name === oldName ? { ...g, name: editName.trim() } : g
            ));
        }
        setEditingGroup(null);
    };

    const handleAnalyzeAll = () => {
        const selectedGroups = groups.filter(g => g.selected && g.columns.length >= 2);
        if (selectedGroups.length === 0) {
            alert('Vui lòng chọn ít nhất 1 nhóm để phân tích');
            return;
        }
        onAnalyzeAllGroups(selectedGroups.map(g => ({ name: g.name, columns: g.columns })));
    };

    const handleAnalyzeSingle = () => {
        const group = groups.find(g => g.name === selectedSingleGroup);
        if (!group || group.columns.length < 2) {
            alert('Nhóm cần có ít nhất 2 biến');
            return;
        }
        onAnalyzeGroup(group.columns, group.name);
    };

    const selectedCount = groups.filter(g => g.selected).length;
    const ungroupedColumns = columns.filter(col =>
        !groups.some(g => g.columns.includes(col))
    );

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3 tracking-tight uppercase">
                        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-100">
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                        Gom nhóm biến thông minh
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                        Tự động phát hiện {groups.length} thang đo dựa trên tiền tố
                    </p>
                </div>
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
                    <button
                        onClick={() => setSingleMode(false)}
                        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!singleMode ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md transform scale-105' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700'}`}
                    >
                        Tất cả nhóm
                    </button>
                    <button
                        onClick={() => setSingleMode(true)}
                        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${singleMode ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md transform scale-105' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700'}`}
                    >
                        Từng nhóm
                    </button>
                </div>
            </div>

            {/* Groups List */}
            <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                {groups.map(group => (
                    <div
                        key={group.name}
                        className={`border-2 rounded-2xl p-5 transition-all ${singleMode
                            ? selectedSingleGroup === group.name ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/40 shadow-xl ring-1 ring-indigo-600 transform scale-[1.01]' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50'
                            : group.selected ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/40 shadow-xl ring-1 ring-indigo-600 transform scale-[1.01]' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {!singleMode && (
                                    <button
                                        onClick={() => toggleGroupSelection(group.name)}
                                        className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${group.selected ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                            }`}
                                    >
                                        {group.selected && <Check className="w-4 h-4 stroke-[4]" />}
                                    </button>
                                )}
                                {singleMode && (
                                    <input
                                        type="radio"
                                        name="singleGroup"
                                        checked={selectedSingleGroup === group.name}
                                        onChange={() => setSelectedSingleGroup(group.name)}
                                        className="w-5 h-5 text-indigo-600 dark:text-indigo-500 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                                    />
                                )}

                                {editingGroup === group.name ? (
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onBlur={() => saveGroupName(group.name)}
                                        onKeyDown={(e) => e.key === 'Enter' && saveGroupName(group.name)}
                                        className="px-3 py-1 border-2 border-indigo-500 rounded-xl text-base font-black outline-none shadow-inner"
                                        autoFocus
                                    />
                                ) : (
                                        <span className="font-black text-slate-900 dark:text-slate-100 text-lg tracking-tight">{group.name}</span>
                                    )}
                                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800 shadow-sm ml-2">
                                        {group.columns.length} items
                                    </span>
                            </div>

                            <button
                                onClick={() => startEditingGroup(group)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all"
                                title="Đổi tên nhóm"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {group.columns.map(col => (
                                <span
                                    key={col}
                                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 dark:bg-slate-100 border border-slate-950 dark:border-white rounded-xl text-[11px] font-black text-white dark:text-slate-900 shadow-md transition-all hover:scale-105 hover:bg-slate-800 dark:hover:bg-white group/tag"
                                >
                                    <span className="uppercase tracking-tighter">{col}</span>
                                    <X
                                        className="w-3.5 h-3.5 cursor-pointer text-slate-400 hover:text-red-400 transition-colors"
                                        onClick={() => removeColumnFromGroup(group.name, col)}
                                    />
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Ungrouped columns warning */}
            {ungroupedColumns.length > 0 && (
                <div className="mb-8 p-5 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900/30 rounded-2xl shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4" />
                        Biến chưa được gom nhóm
                    </p>
                    <p className="text-sm text-slate-900 dark:text-slate-200 font-black uppercase tracking-tight leading-relaxed">
                        {ungroupedColumns.join(', ')}
                    </p>
                    <p className="text-[10px] text-amber-700 dark:text-amber-500 mt-3 font-bold italic opacity-80">
                        (Các biến này không đủ 2 item cùng tiền tố hoặc có tên khác biệt để tự động gom nhóm)
                    </p>
                </div>
            )}

            {/* Analyze Buttons */}
            {singleMode ? (
                <button
                    onClick={handleAnalyzeSingle}
                    disabled={isAnalyzing || !selectedSingleGroup}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAnalyzing ? 'Đang phân tích...' : `Tính ${analysisLabel} cho ${selectedSingleGroup || '...'}`}
                </button>
            ) : (
                <button
                    onClick={handleAnalyzeAll}
                    disabled={isAnalyzing || selectedCount === 0}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAnalyzing ? 'Đang phân tích...' : `Tính ${analysisLabel} cho ${selectedCount} nhóm đã chọn`}
                </button>
            )}
        </div>
    );
}

// Keep the old VariableSelector for backward compatibility
export function VariableSelector({ columns, onAnalyze, isAnalyzing }: { columns: string[]; onAnalyze: (selectedColumns: string[], scaleName: string) => void; isAnalyzing: boolean }) {
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [scaleName, setScaleName] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const toggleColumn = (col: string) => {
        setSelectedColumns(prev =>
            prev.includes(col)
                ? prev.filter(c => c !== col)
                : [...prev, col]
        );
    };

    const handleAnalyze = () => {
        if (selectedColumns.length < 2) {
            alert('Cần chọn ít nhất 2 biến để tính Cronbach\'s Alpha');
            return;
        }
        onAnalyze(selectedColumns, scaleName || 'Thang đo');
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
                Chọn biến thủ công
            </h3>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên thang đo
                </label>
                <input
                    type="text"
                    value={scaleName}
                    onChange={(e) => setScaleName(e.target.value)}
                    placeholder="VD: Satisfaction, Loyalty..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chọn biến ({selectedColumns.length})
                </label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-left flex items-center justify-between font-black text-slate-900 dark:text-slate-100 hover:border-indigo-400 transition-all shadow-inner group"
                    >
                        <span className="truncate max-w-[90%]">
                            {selectedColumns.length === 0 ? 'Click để chọn biến...' : selectedColumns.join(', ')}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform group-hover:text-indigo-600 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                        <div className="absolute z-50 mt-3 w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-72 flex flex-col">
                            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200">
                                {columns.map(col => (
                                    <div 
                                        key={col} 
                                        onClick={() => toggleColumn(col)}
                                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl transition-all mb-1 ${selectedColumns.includes(col) ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${selectedColumns.includes(col) ? 'bg-white border-white text-indigo-600' : 'border-slate-300 dark:border-slate-700'}`}>
                                            {selectedColumns.includes(col) && <Check className="w-3.5 h-3.5 stroke-[4]" />}
                                        </div>
                                        <span className="font-black text-sm uppercase tracking-tight">{col}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || selectedColumns.length < 2}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50"
            >
                {isAnalyzing ? 'Đang phân tích...' : `Tính Alpha (${selectedColumns.length} biến)`}
            </button>
        </div>
    );
}

// Settings Panel for API Key
export function AISettings() {
    const [apiKey, setApiKey] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            setApiKey(savedKey);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        setIsSaved(true);
        window.dispatchEvent(new Event('gemini-key-updated'));
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleClear = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
        window.dispatchEvent(new Event('gemini-key-updated'));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Cài đặt API Key"
            >
                <Key className="w-5 h-5" />
                <span className="text-sm hidden md:inline">AI Settings</span>
                {apiKey && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border p-4 z-50">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        Gemini AI API Key
                    </h4>
                    <p className="text-xs text-gray-500 mb-3">
                        Nhập API Key Gemini của bạn để sử dụng tính năng AI giải thích.
                        Key được lưu trên máy bạn (localStorage), không gửi lên server.
                    </p>

                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg"
                        >
                            {isSaved ? '✓ Đã lưu!' : 'Lưu Key'}
                        </button>
                        {apiKey && (
                            <button
                                onClick={handleClear}
                                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg"
                            >
                                Xóa
                            </button>
                        )}
                    </div>

                    <a
                        href="https://aistudio.google.com/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-3 text-xs text-blue-600 hover:underline"
                    >
                        → Lấy API Key miễn phí tại Google AI Studio
                    </a>
                </div>
            )}
        </div>
    );
}
