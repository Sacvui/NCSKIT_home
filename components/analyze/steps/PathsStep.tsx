import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, AlertCircle } from 'lucide-react';
import { LatentVariable, StructuralPath } from '@/types/plssem';
import { ModelValidation } from '@/types/plssem';

interface PathsStepProps {
    constructs: LatentVariable[];
    paths: StructuralPath[];
    onAddPath: (path: StructuralPath) => void;
    onDeletePath: (id: string) => void;
    validation: ModelValidation;
}

export const PathsStep: React.FC<PathsStepProps> = ({
    constructs,
    paths,
    onAddPath,
    onDeletePath,
    validation
}) => {
    const [fromConstruct, setFromConstruct] = useState('');
    const [toConstruct, setToConstruct] = useState('');

    const constructNames = constructs.map(c => c.name);

    const handleAddPath = () => {
        if (fromConstruct && toConstruct && fromConstruct !== toConstruct) {
            // Check if path already exists
            const exists = paths.some(
                p => p.from === fromConstruct && p.to === toConstruct
            );

            if (!exists) {
                onAddPath({
                    id: `path_${Date.now()}`,
                    from: fromConstruct,
                    to: toConstruct
                });
                setFromConstruct('');
                setToConstruct('');
            }
        }
    };

    // Group paths by target for better visualization
    const pathsByTarget = paths.reduce((acc, path) => {
        if (!acc[path.to]) acc[path.to] = [];
        acc[path.to].push(path);
        return acc;
    }, {} as Record<string, StructuralPath[]>);

    return (
        <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                    Step 3: Define Structural Paths
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                    Define the relationships between your latent variables.
                    Each path represents a hypothesized causal relationship.
                </p>
                <div className="text-sm text-blue-600">
                    <p>• <strong>From</strong>: Independent/Predictor variable</p>
                    <p>• <strong>To</strong>: Dependent/Outcome variable</p>
                    <p>• You need at least 1 path to proceed</p>
                </div>
            </div>

            {/* Validation Messages */}
            {!validation.isValid && validation.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-semibold text-red-900 mb-2">Validation Errors</h4>
                            <ul className="space-y-1 text-sm text-red-700">
                                {validation.errors.map((error, idx) => (
                                    <li key={idx}>• {error.message}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {validation.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-semibold text-yellow-900 mb-2">Warnings</h4>
                            <ul className="space-y-1 text-sm text-yellow-700">
                                {validation.warnings.map((warning, idx) => (
                                    <li key={idx}>• {warning}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Path Form */}
            <div className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50">
                <h4 className="font-semibold text-gray-900 mb-4">Add New Path</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    {/* From Construct */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            From (Predictor)
                        </label>
                        <select
                            value={fromConstruct}
                            onChange={(e) => setFromConstruct(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select construct...</option>
                            {constructNames.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex justify-center pb-2">
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                    </div>

                    {/* To Construct */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            To (Outcome)
                        </label>
                        <select
                            value={toConstruct}
                            onChange={(e) => setToConstruct(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select construct...</option>
                            {constructNames
                                .filter(name => name !== fromConstruct)
                                .map((name) => (
                                    <option key={name} value={name}>
                                        {name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleAddPath}
                    disabled={!fromConstruct || !toConstruct || fromConstruct === toConstruct}
                    className={`
                        mt-4 w-full py-2 rounded-lg flex items-center justify-center gap-2
                        ${fromConstruct && toConstruct && fromConstruct !== toConstruct
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                    `}
                >
                    <Plus className="w-4 h-4" />
                    Add Path
                </button>
            </div>

            {/* Existing Paths */}
            {paths.length > 0 ? (
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">
                        Defined Paths ({paths.length})
                    </h4>

                    {/* Simple List View */}
                    <div className="space-y-2">
                        {paths.map((path) => (
                            <div
                                key={path.id}
                                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-white"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg font-medium">
                                            {path.from}
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-400" />
                                        <div className="px-4 py-2 bg-green-100 text-green-900 rounded-lg font-medium">
                                            {path.to}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onDeletePath(path.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        title="Delete path"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Visual Diagram (Simple) */}
                    <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h5 className="font-semibold text-gray-900 mb-4">Model Diagram</h5>
                        <div className="space-y-3">
                            {Object.entries(pathsByTarget).map(([target, targetPaths]) => (
                                <div key={target} className="bg-white rounded-lg p-4 border border-gray-200">
                                    <div className="font-semibold text-green-900 mb-2">
                                        {target}
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        {targetPaths.map((path) => (
                                            <div key={path.id} className="flex items-center gap-2">
                                                <ArrowRight className="w-4 h-4 text-blue-600" />
                                                <span>Predicted by <strong>{path.from}</strong></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                        ⚠️ No paths defined yet. Add at least 1 path to proceed.
                    </p>
                </div>
            )}
        </div>
    );
};
