import React from 'react';
import { Settings } from 'lucide-react';
import { PLSSEMSettings, WeightingScheme } from '@/types/plssem';

interface SettingsStepProps {
    settings: PLSSEMSettings;
    onUpdate: (settings: PLSSEMSettings) => void;
}

export const SettingsStep: React.FC<SettingsStepProps> = ({ settings, onUpdate }) => {
    const handleUpdate = (field: keyof PLSSEMSettings, value: any) => {
        onUpdate({ ...settings, [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                    Step 4: Algorithm Settings
                </h4>
                <p className="text-sm text-blue-700">
                    Configure the PLS-SEM algorithm parameters. Default values are recommended for most cases.
                </p>
            </div>

            {/* Settings Form */}
            <div className="space-y-6">
                {/* Max Iterations */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                    <div className="flex items-start gap-4">
                        <Settings className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <label className="block font-semibold text-gray-900 mb-2">
                                Maximum Iterations
                            </label>
                            <p className="text-sm text-gray-600 mb-4">
                                Maximum number of iterations for the PLS algorithm to converge.
                                Higher values allow more time for convergence but take longer to compute.
                            </p>
                            <input
                                type="number"
                                value={settings.maxIterations}
                                onChange={(e) => handleUpdate('maxIterations', parseInt(e.target.value))}
                                min={100}
                                max={1000}
                                step={50}
                                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Default: 300 | Range: 100-1000
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stop Criterion */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                    <div className="flex items-start gap-4">
                        <Settings className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <label className="block font-semibold text-gray-900 mb-2">
                                Stop Criterion
                            </label>
                            <p className="text-sm text-gray-600 mb-4">
                                The algorithm stops when the change in outer weights is below this threshold.
                                Smaller values mean more precise results but longer computation time.
                            </p>
                            <select
                                value={settings.stopCriterion}
                                onChange={(e) => handleUpdate('stopCriterion', parseFloat(e.target.value))}
                                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value={1e-5}>0.00001 (Very Precise)</option>
                                <option value={1e-6}>0.000001 (Precise)</option>
                                <option value={1e-7}>0.0000001 (Default)</option>
                                <option value={1e-8}>0.00000001 (Very Precise)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                Default: 1e-7 (0.0000001)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Weighting Scheme */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                    <div className="flex items-start gap-4">
                        <Settings className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <label className="block font-semibold text-gray-900 mb-2">
                                Weighting Scheme
                            </label>
                            <p className="text-sm text-gray-600 mb-4">
                                Method for calculating inner weights between latent variables.
                            </p>

                            <div className="space-y-3">
                                {/* Path Weighting */}
                                <button
                                    type="button"
                                    onClick={() => handleUpdate('weightingScheme', 'path')}
                                    className={`
                                        w-full p-4 border-2 rounded-lg text-left transition-all
                                        ${settings.weightingScheme === 'path'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <div className="font-semibold mb-1">Path Weighting (Recommended)</div>
                                    <div className="text-sm text-gray-600">
                                        Uses path coefficients as weights. Best for most models.
                                    </div>
                                </button>

                                {/* Centroid */}
                                <button
                                    type="button"
                                    onClick={() => handleUpdate('weightingScheme', 'centroid')}
                                    className={`
                                        w-full p-4 border-2 rounded-lg text-left transition-all
                                        ${settings.weightingScheme === 'centroid'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <div className="font-semibold mb-1">Centroid Weighting</div>
                                    <div className="text-sm text-gray-600">
                                        Uses sign of correlations. Simple but less precise.
                                    </div>
                                </button>

                                {/* Factor */}
                                <button
                                    type="button"
                                    onClick={() => handleUpdate('weightingScheme', 'factor')}
                                    className={`
                                        w-full p-4 border-2 rounded-lg text-left transition-all
                                        ${settings.weightingScheme === 'factor'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <div className="font-semibold mb-1">Factor Weighting</div>
                                    <div className="text-sm text-gray-600">
                                        Uses correlations as weights. Good for reflective models.
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Current Settings</h4>
                <div className="text-sm text-green-700 space-y-1">
                    <p>• Max Iterations: <strong>{settings.maxIterations}</strong></p>
                    <p>• Stop Criterion: <strong>{settings.stopCriterion}</strong></p>
                    <p>• Weighting Scheme: <strong>{settings.weightingScheme}</strong></p>
                </div>
            </div>
        </div>
    );
};
