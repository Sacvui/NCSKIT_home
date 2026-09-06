import React from 'react';
import { BookOpen } from 'lucide-react';

interface ScientificNoteProps {
    insight: string;
    citation: string;
    reference: string;
}

export function ScientificNote({ insight, citation, reference }: ScientificNoteProps) {
    return (
        <div className="bg-slate-50 border-l-4 border-slate-300 p-5 rounded-r-xl my-6 shadow-sm">
            <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <div className="space-y-3">
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        <span className="font-bold text-slate-900 mr-2">Insight:</span>
                        {insight}
                    </p>
                    <div className="bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm text-xs text-slate-600">
                        <p className="font-bold text-slate-800 mb-1">📚 Cơ sở khoa học ({citation}):</p>
                        <p className="italic">{reference}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
