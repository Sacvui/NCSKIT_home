const fs = require('fs');

const content = fs.readFileSync('components/analyze/views/AutoPilotView.tsx', 'utf8');
const lines = content.split('\n');

let logicPart = lines.slice(0, 484);

// We need to inject imports at the top
logicPart.splice(6, 0, 
    "import { AutoPilotPresetSelector } from './autopilot/AutoPilotPresetSelector';",
    "import { AutoPilotConfigPanel } from './autopilot/AutoPilotConfigPanel';",
    "import { AutoPilotProgress } from './autopilot/AutoPilotProgress';"
);

const renderPart = `
    if (!selectedPreset) {
        return <AutoPilotPresetSelector onSelect={(preset) => {
            setSelectedPreset(preset);
            if (preset.bootstrapDefault) setBootstrapSamples(preset.bootstrapDefault);
        }} />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isAnalyzing && <AutoPilotProgress progress={progress} statusText={statusText} />}
            
            <button 
                onClick={() => setSelectedPreset(null)}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm"
            >
                <ChevronLeft className="w-4 h-4" /> Quay lại danh sách kịch bản
            </button>

            <div className="text-center">
                <div className={\`inline-flex items-center justify-center w-20 h-20 rounded-3xl \${selectedPreset.bgColor} \${selectedPreset.color} shadow-xl mb-6 text-4xl\`}>
                    {selectedPreset.icon}
                </div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-4">
                    {selectedPreset.name}
                </h2>
                <p className="text-slate-500 max-w-2xl mx-auto">
                    {selectedPreset.description}
                </p>
            </div>

            <AutoPilotConfigPanel 
                preset={selectedPreset}
                groups={groups}
                paths={paths}
                newPathFrom={newPathFrom}
                newPathTo={newPathTo}
                setNewPathFrom={setNewPathFrom}
                setNewPathTo={setNewPathTo}
                handleAddPath={handleAddPath}
                handleRemovePath={handleRemovePath}
                bootstrapSamples={bootstrapSamples}
                setBootstrapSamples={setBootstrapSamples}
                categoricalCols={categoricalCols}
                compareGroupVar={compareGroupVar}
                setCompareGroupVar={setCompareGroupVar}
                compareTestVars={compareTestVars}
                setCompareTestVars={setCompareTestVars}
            />

            <div className="bg-white rounded-3xl border border-blue-100 shadow-xl p-8 mt-8">
                <button
                    onClick={handleRunAutoPilot}
                    disabled={
                        isAnalyzing || 
                        (selectedPreset.requiresPaths && paths.length === 0) ||
                        (selectedPreset.id === 'compare' && (!compareGroupVar || compareTestVars.length === 0))
                    }
                    className={\`w-full relative overflow-hidden group text-white p-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl transition-all \${isAnalyzing ? 'bg-slate-400' : 'bg-gradient-to-r from-blue-900 to-indigo-900 hover:shadow-blue-900/40 hover:-translate-y-1 active:scale-95'} disabled:opacity-50 disabled:pointer-events-none\`}
                >
                    <div className="flex items-center justify-center gap-3">
                        <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                        Bắt đầu Phân tích Toàn diện
                    </div>
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    {bootstrapSamples >= 1000 ? 'Bootstrap 1000 mẫu — có thể mất 3-10 phút' : bootstrapSamples >= 500 ? 'Có thể mất 1-5 phút tùy cấu hình' : 'Có thể mất 15-60 giây'}
                </div>
            </div>
        </div>
    );
}
`;

fs.writeFileSync('components/analyze/views/AutoPilotView.tsx', logicPart.join('\n') + '\n' + renderPart);
console.log("Refactored AutoPilotView.tsx successfully.");
