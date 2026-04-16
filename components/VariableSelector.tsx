'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronDown, X, Sparkles, Edit2, Trash2, Layers, Info, Target, Settings, Play } from 'lucide-react';
import { storeApiKey, retrieveApiKey, clearApiKey, hasStoredApiKey } from '@/utils/key-encryption';

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
    analysisLabel?: string;
    minItemsPerGroup?: number;
}

function extractPrefix(colName: string): string {
    const match = colName.match(/^([A-Za-z]+)/);
    return match ? match[1].toUpperCase() : colName.substring(0, 2).toUpperCase();
}

function autoGroupColumns(columns: string[]): VariableGroup[] {
    const groupMap: Record<string, string[]> = {};
    columns.forEach(col => {
        const prefix = extractPrefix(col);
        if (!groupMap[prefix]) groupMap[prefix] = [];
        groupMap[prefix].push(col);
    });
    return Object.entries(groupMap)
        .filter(([_, cols]) => cols.length >= 2)
        .map(([name, cols]) => ({ name, columns: cols, selected: true }));
}

export function SmartGroupSelector({ columns, onAnalyzeGroup, onAnalyzeAllGroups, isAnalyzing, analysisLabel = "Cronbach's Alpha", minItemsPerGroup = 2 }: SmartGroupSelectorProps) {
    const [groups, setGroups] = useState<VariableGroup[]>([]);
    const [editingGroup, setEditingGroup] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [singleMode, setSingleMode] = useState(false);
    const [selectedSingleGroup, setSelectedSingleGroup] = useState<string | null>(null);

    useEffect(() => {
        setGroups(autoGroupColumns(columns));
    }, [columns]);

    const toggleGroupSelection = (groupName: string) => {
        setGroups(prev => prev.map(g => g.name === groupName ? { ...g, selected: !g.selected } : g));
    };

    const removeColumnFromGroup = (groupName: string, col: string) => {
        setGroups(prev => prev.map(g => g.name === groupName ? { ...g, columns: g.columns.filter(c => c !== col) } : g).filter(g => g.columns.length >= 2));
    };

    const saveGroupName = (oldName: string) => {
        if (editName.trim()) {
            setGroups(prev => prev.map(g => g.name === oldName ? { ...g, name: editName.trim() } : g));
        }
        setEditingGroup(null);
    };

    const handleAnalyzeAll = () => {
        const selectedGroups = groups.filter(g => g.selected && g.columns.length >= minItemsPerGroup);
        if (selectedGroups.length === 0) return alert('Vui lòng chọn ít nhất 1 nhóm thỏa mãn điều kiện để phân tích');
        onAnalyzeAllGroups(selectedGroups.map(g => ({ name: g.name, columns: g.columns })));
    };

    const handleAnalyzeSingle = () => {
        const group = groups.find(g => g.name === selectedSingleGroup);
        if (!group || group.columns.length < minItemsPerGroup) return alert(`Nhóm cần có ít nhất ${minItemsPerGroup} biến`);
        onAnalyzeGroup(group.columns, group.name);
    };

    const selectedCount = groups.filter(g => g.selected).length;
    const ungroupedColumns = columns.filter(col => !groups.some(g => g.columns.includes(col)));

    return (
        <div className="bg-white rounded-2xl border border-blue-100 p-8 space-y-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-lg font-black text-blue-900 uppercase tracking-tight flex items-center gap-3">
                        <Layers className="w-5 h-5 text-blue-600" /> Gom nhóm biến thông minh
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Hệ thống tự động phát hiện {groups.length} thang đo tiềm năng</p>
                </div>
                <div className="flex bg-slate-50 p-1 rounded-xl border border-blue-50">
                    <button onClick={() => setSingleMode(false)} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${!singleMode ? 'bg-white text-blue-900 shadow-sm border border-blue-100' : 'text-slate-400 hover:text-blue-900'}`}>Tất cả nhóm</button>
                    <button onClick={() => setSingleMode(true)} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${singleMode ? 'bg-white text-blue-900 shadow-sm border border-blue-100' : 'text-slate-400 hover:text-blue-900'}`}>Từng nhóm</button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 p-1">
                {groups.map(group => (
                    <div key={group.name} className={`p-5 rounded-2xl border-2 transition-all ${singleMode ? (selectedSingleGroup === group.name ? 'border-blue-900 bg-blue-50/30' : 'border-slate-50 bg-white') : (group.selected ? 'border-blue-900 bg-blue-50/30 font-black' : 'border-slate-50 bg-white')}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                {!singleMode ? (
                                    <button onClick={() => toggleGroupSelection(group.name)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${group.selected ? 'bg-blue-900 border-blue-900 text-white' : 'border-slate-200 bg-white'}`}>
                                        {group.selected && <Check className="w-3.5 h-3.5 stroke-[4]" />}
                                    </button>
                                ) : (
                                    <input type="radio" name="singleGroup" checked={selectedSingleGroup === group.name} onChange={() => setSelectedSingleGroup(group.name)} className="w-5 h-5 text-blue-900 border-slate-300 focus:ring-blue-900" />
                                )}
                                {editingGroup === group.name ? (
                                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} onBlur={() => saveGroupName(group.name)} onKeyDown={(e) => e.key === 'Enter' && saveGroupName(group.name)} className="px-3 py-1 border-2 border-blue-900 rounded-xl text-sm font-black outline-none" autoFocus />
                                ) : (
                                    <span className="font-black text-blue-900 uppercase tracking-tighter text-base">{group.name}</span>
                                )}
                                <span className="text-[9px] font-black uppercase tracking-widest text-blue-600/60 bg-white px-2.5 py-1 rounded-full border border-blue-50 shadow-sm">{group.columns.length} items</span>
                            </div>
                            <button onClick={() => { setEditingGroup(group.name); setEditName(group.name); }} className="text-slate-300 hover:text-blue-900 p-1.5 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {group.columns.map(col => (
                                <div key={col} className="px-3 py-1.5 bg-white border border-blue-50 rounded-xl flex items-center gap-2 group/tag shadow-sm transition-all hover:border-blue-300">
                                    <span className="text-[10px] font-black text-blue-900 uppercase tracking-tighter">{col}</span>
                                    <X className="w-3 h-3 text-slate-300 hover:text-red-500 cursor-pointer" onClick={() => removeColumnFromGroup(group.name, col)} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {ungroupedColumns.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-blue-50/50">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-2"><Sparkles className="w-3 h-3" /> Biến tự do (khác tiền tố)</p>
                    <div className="flex flex-wrap gap-1.5 opacity-60">
                        {ungroupedColumns.map(c => <span key={c} className="text-[9px] font-black uppercase text-blue-900/60 bg-white px-2 py-0.5 rounded border border-blue-50">{c}</span>)}
                    </div>
                </div>
            )}

            <button
                onClick={singleMode ? handleAnalyzeSingle : handleAnalyzeAll}
                disabled={isAnalyzing || (singleMode ? !selectedSingleGroup : selectedCount === 0)}
                className="w-full py-4 bg-blue-900 hover:bg-blue-950 text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
                {isAnalyzing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                {isAnalyzing ? 'Processing...' : `Chạy ${analysisLabel}`}
            </button>
        </div>
    );
}

export function VariableSelector({ columns, onAnalyze, isAnalyzing }: { columns: string[]; onAnalyze: (selectedColumns: string[], scaleName: string) => void; isAnalyzing: boolean }) {
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [scaleName, setScaleName] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const toggleColumn = (col: string) => {
        setSelectedColumns(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]);
    };

    return (
        <div className="bg-white rounded-2xl border border-blue-100 p-8 space-y-6 shadow-sm">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-tight flex items-center gap-2"><Target className="w-4 h-4 text-blue-600" /> Chọn biến thủ công</h3>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Tên thang đo (Scale Label)</label>
                    <input type="text" value={scaleName} onChange={(e) => setScaleName(e.target.value)} placeholder="VD: Satisfaction, Loyalty..." className="w-full px-4 py-3 bg-slate-50 border border-blue-50 rounded-xl text-blue-900 font-bold text-sm focus:ring-2 focus:ring-blue-900 outline-none transition-all" />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Chọn biến quan sát ({selectedColumns.length})</label>
                    <div className="relative">
                        <button onClick={() => setIsOpen(!isOpen)} className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl text-left flex items-center justify-between font-black text-blue-900 text-sm shadow-sm transition-all hover:border-blue-900 group">
                            <span className="truncate max-w-[90%]">{selectedColumns.length === 0 ? 'Click để chọn biến từ danh sách...' : selectedColumns.join(', ')}</span>
                            <ChevronDown className={`w-4 h-4 text-blue-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                            <div className="absolute z-50 mt-2 w-full bg-white border border-blue-100 rounded-2xl shadow-2xl overflow-hidden max-h-64 flex flex-col p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="overflow-y-auto space-y-1">
                                    {columns.map(col => (
                                        <div key={col} onClick={() => toggleColumn(col)} className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl transition-all ${selectedColumns.includes(col) ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'}`}>
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedColumns.includes(col) ? 'bg-white border-white text-blue-900' : 'border-blue-100'}`}>
                                                {selectedColumns.includes(col) && <Check className="w-3 h-3 stroke-[4]" />}
                                            </div>
                                            <span className="font-black text-xs uppercase tracking-tighter">{col}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={() => { if (selectedColumns.length < 2) return alert('Cần ít nhất 2 biến'); onAnalyze(selectedColumns, scaleName || 'Scale'); }}
                disabled={isAnalyzing || selectedColumns.length < 2}
                className="w-full py-4 bg-blue-900 hover:bg-blue-950 text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
                {isAnalyzing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                Chạy phân tích Thang đo
            </button>
        </div>
    );
}

export function AISettings() {
    const [apiKey, setApiKey] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        // Load the decrypted key for display (masked) — retrieve from encrypted storage
        const decrypted = retrieveApiKey();
        if (decrypted) setApiKey(decrypted);
    }, []);

    const handleSave = () => {
        // Store encrypted — raw key never persisted in plaintext
        storeApiKey(apiKey);
        setIsSaved(true);
        window.dispatchEvent(new Event('gemini-key-updated'));
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleClear = () => {
        clearApiKey();
        setApiKey('');
        window.dispatchEvent(new Event('gemini-key-updated'));
    };

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-blue-900 bg-slate-50 hover:bg-white border border-blue-50 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest shadow-sm">
                <Settings className={`w-4 h-4 ${apiKey ? 'text-blue-600' : ''}`} />
                <span className="hidden md:inline">AI Config</span>
                {apiKey && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-blue-100 p-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h4 className="font-black text-blue-900 uppercase tracking-tight mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5 text-blue-600" /> Gemini API Key</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-4">Cấu hình API Key từ Google AI Studio để kích hoạt tính năng Nhận định học thuật tự động bằng AI.</p>

                    <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="AIzaSy..." className="w-full px-4 py-3 bg-slate-50 border border-blue-100 rounded-xl text-blue-900 font-bold text-sm mb-4 focus:ring-2 focus:ring-blue-900 outline-none transition-all" />

                    <div className="flex gap-2">
                        <button onClick={handleSave} className="flex-1 py-3 bg-blue-900 hover:bg-blue-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95">{isSaved ? '✓ SAVED' : 'SAVE KEY'}</button>
                        {apiKey && <button onClick={handleClear} className="px-4 py-3 bg-slate-100 text-slate-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>}
                    </div>

                    <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="block mt-4 text-[9px] font-black text-blue-600 hover:underline uppercase tracking-widest text-center">→ Get Free API Key</a>
                </div>
            )}
        </div>
    );
}
