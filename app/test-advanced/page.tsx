'use client';

import { useState } from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import BootstrapResults from '@/components/results/plssem/BootstrapResults';
import IPMAResults from '@/components/results/plssem/IPMAResults';
import MGAResults from '@/components/results/plssem/MGAResults';
import BlindfoldingResults from '@/components/results/plssem/BlindfoldingResults';
import AdvancedMethodView from '@/components/analyze/views/AdvancedMethodView';
import { runBootstrapping, runIPMA, runMGA, runBlindfolding } from '@/lib/webr/pls-sem';

type TestMethod = 'bootstrap' | 'ipma' | 'mga' | 'blindfolding' | null;

export default function TestAdvancedMethods() {
    const [selectedMethod, setSelectedMethod] = useState<TestMethod>(null);
    const [results, setResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Sample test data
    const testData = [
        [5, 4, 5, 3, 4],
        [4, 5, 4, 4, 5],
        [3, 3, 4, 2, 3],
        [5, 5, 5, 5, 5],
        [4, 4, 3, 4, 4],
        [3, 4, 4, 3, 4],
        [5, 4, 5, 4, 5],
        [4, 3, 4, 3, 4],
        [5, 5, 4, 5, 5],
        [3, 3, 3, 2, 3]
    ];

    const columnNames = ['Var1', 'Var2', 'Var3', 'Var4', 'Var5'];

    const runTest = async (method: TestMethod) => {
        if (!method) return;

        setIsLoading(true);
        setResults(null);

        try {
            let result;
            switch (method) {
                case 'bootstrap':
                    result = await runBootstrapping(testData, 1000);
                    break;
                case 'ipma':
                    result = await runIPMA(testData, 0);
                    break;
                case 'mga':
                    const groups = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2];
                    result = await runMGA(testData, groups, 0);
                    break;
                case 'blindfolding':
                    result = await runBlindfolding(testData, 7);
                    break;
            }
            setResults(result);
        } catch (error: any) {
            console.error('Test error:', error);
            alert('Error: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (selectedMethod && !results) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => setSelectedMethod(null)}
                        className="mb-6 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to menu
                    </button>

                    <AdvancedMethodView
                        method={selectedMethod}
                        data={testData}
                        columnNames={columnNames}
                        onBack={() => setSelectedMethod(null)}
                        setResults={(res) => setResults(res)}
                    />
                </div>
            </div>
        );
    }

    if (results) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={() => {
                            setResults(null);
                            setSelectedMethod(null);
                        }}
                        className="mb-6 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to menu
                    </button>

                    {selectedMethod === 'bootstrap' && <BootstrapResults results={results} />}
                    {selectedMethod === 'ipma' && <IPMAResults results={results} />}
                    {selectedMethod === 'mga' && <MGAResults results={results} />}
                    {selectedMethod === 'blindfolding' && <BlindfoldingResults results={results} />}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8 mb-8">
                    <h1 className="text-3xl font-bold mb-2">🧪 Test Advanced Methods</h1>
                    <p className="text-purple-100">
                        Test Bootstrap, IPMA, MGA, and Blindfolding components
                    </p>
                </div>

                {/* Test Menu */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Bootstrap */}
                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Bootstrap</h3>
                                <p className="text-xs text-slate-500">Confidence Intervals</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                            Test Bootstrap resampling with 1000 iterations
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedMethod('bootstrap')}
                                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                            >
                                Test with UI
                            </button>
                            <button
                                onClick={() => runTest('bootstrap')}
                                disabled={isLoading}
                                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-medium disabled:opacity-50 flex items-center gap-2"
                            >
                                <Play className="w-4 h-4" />
                                Quick Test
                            </button>
                        </div>
                    </div>

                    {/* IPMA */}
                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">IPMA</h3>
                                <p className="text-xs text-slate-500">Importance-Performance</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                            Test Importance-Performance Matrix Analysis
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedMethod('ipma')}
                                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium"
                            >
                                Test with UI
                            </button>
                            <button
                                onClick={() => runTest('ipma')}
                                disabled={isLoading}
                                className="px-4 py-2 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 font-medium disabled:opacity-50 flex items-center gap-2"
                            >
                                <Play className="w-4 h-4" />
                                Quick Test
                            </button>
                        </div>
                    </div>

                    {/* MGA */}
                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">MGA</h3>
                                <p className="text-xs text-slate-500">Multi-Group Analysis</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                            Test Multi-Group comparison with 2 groups
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedMethod('mga')}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                            >
                                Test with UI
                            </button>
                            <button
                                onClick={() => runTest('mga')}
                                disabled={isLoading}
                                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium disabled:opacity-50 flex items-center gap-2"
                            >
                                <Play className="w-4 h-4" />
                                Quick Test
                            </button>
                        </div>
                    </div>

                    {/* Blindfolding */}
                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">👁️</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Blindfolding</h3>
                                <p className="text-xs text-slate-500">Predictive Relevance</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                            Test Blindfolding procedure for Q²
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedMethod('blindfolding')}
                                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                            >
                                Test with UI
                            </button>
                            <button
                                onClick={() => runTest('blindfolding')}
                                disabled={isLoading}
                                className="px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 font-medium disabled:opacity-50 flex items-center gap-2"
                            >
                                <Play className="w-4 h-4" />
                                Quick Test
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-blue-900 mb-3">ℹ️ Test Information</h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                        <li>• <strong>Test Data:</strong> 10 rows × 5 columns (sample data)</li>
                        <li>• <strong>Test with UI:</strong> Opens full input interface</li>
                        <li>• <strong>Quick Test:</strong> Runs with default parameters</li>
                        <li>• <strong>Purpose:</strong> Verify components work before integrating</li>
                    </ul>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 text-center">
                            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-lg font-bold text-slate-900">Running test...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
