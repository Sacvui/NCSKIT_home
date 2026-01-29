import React from 'react';
import { Check, ArrowRight, Settings, AlertCircle } from 'lucide-react';
import { MeasurementModel, StructuralModel, PLSSEMSettings } from '@/types/plssem';
import { Badge } from '@/components/ui/Badge';

interface ReviewStepProps {
    measurement: MeasurementModel;
    structural: StructuralModel;
    settings: PLSSEMSettings;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
    measurement,
    structural,
    settings
}) => {
    const totalIndicators = measurement.constructs.reduce(
        (sum, c) => sum + c.indicators.length,
        0
    );

    const endogenousConstructs = new Set(structural.paths.map(p => p.to));
    const exogenousConstructs = measurement.constructs.filter(
        c => !endogenousConstructs.has(c.name)
    );

    return (
        <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                    Step 5: Review & Run Analysis
                </h4>
                <p className="text-sm text-blue-700">
                    Review your PLS-SEM model specification before running the analysis.
                    Make sure everything looks correct.
                </p>
            </div>

            {/* Model Summary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Check className="w-6 h-6 text-green-600" />
                    <h4 className="font-semibold text-green-900 text-lg">
                        Model Ready to Run
                    </h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-green-700">Constructs</p>
                        <p className="text-2xl font-bold text-green-900">
                            {measurement.constructs.length}
                        </p>
                    </div>
                    <div>
                        <p className="text-green-700">Indicators</p>
                        <p className="text-2xl font-bold text-green-900">
                            {totalIndicators}
                        </p>
                    </div>
                    <div>
                        <p className="text-green-700">Paths</p>
                        <p className="text-2xl font-bold text-green-900">
                            {structural.paths.length}
                        </p>
                    </div>
                    <div>
                        <p className="text-green-700">Endogenous</p>
                        <p className="text-2xl font-bold text-green-900">
                            {endogenousConstructs.size}
                        </p>
                    </div>
                </div>
            </div>

            {/* Measurement Model */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900">Measurement Model (Outer Model)</h4>
                </div>
                <div className="p-6 space-y-4">
                    {measurement.constructs.map((construct) => (
                        <div
                            key={construct.id}
                            className="border border-gray-200 rounded-lg p-4 bg-white"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h5 className="font-semibold text-lg">{construct.name}</h5>
                                    <div className="flex gap-2 mt-1">
                                        <Badge variant={construct.type === 'reflective' ? 'info' : 'warning'}>
                                            {construct.type === 'reflective' ? 'Reflective' : 'Formative'}
                                        </Badge>
                                        <Badge variant="success">
                                            {construct.indicators.length} indicators
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {construct.indicators.map((ind) => (
                                    <span
                                        key={ind}
                                        className="px-3 py-1 bg-blue-100 text-blue-900 rounded-lg text-sm font-medium"
                                    >
                                        {ind}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Structural Model */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900">Structural Model (Inner Model)</h4>
                </div>
                <div className="p-6">
                    {/* Exogenous Constructs */}
                    {exogenousConstructs.length > 0 && (
                        <div className="mb-6">
                            <h5 className="font-semibold text-gray-700 mb-3">
                                Exogenous Variables (Predictors)
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {exogenousConstructs.map((c) => (
                                    <Badge key={c.id} variant="info">
                                        {c.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Paths */}
                    <div>
                        <h5 className="font-semibold text-gray-700 mb-3">
                            Structural Paths ({structural.paths.length})
                        </h5>
                        <div className="space-y-2">
                            {structural.paths.map((path) => (
                                <div
                                    key={path.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                >
                                    <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded font-medium">
                                        {path.from}
                                    </span>
                                    <ArrowRight className="w-5 h-5 text-gray-400" />
                                    <span className="px-3 py-1 bg-green-100 text-green-900 rounded font-medium">
                                        {path.to}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Endogenous Constructs */}
                    {endogenousConstructs.size > 0 && (
                        <div className="mt-6">
                            <h5 className="font-semibold text-gray-700 mb-3">
                                Endogenous Variables (Outcomes)
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {Array.from(endogenousConstructs).map((name) => (
                                    <Badge key={name} variant="success">
                                        {name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Algorithm Settings */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">Algorithm Settings</h4>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Max Iterations</p>
                            <p className="text-xl font-bold text-gray-900">
                                {settings.maxIterations}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Stop Criterion</p>
                            <p className="text-xl font-bold text-gray-900">
                                {settings.stopCriterion}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Weighting Scheme</p>
                            <p className="text-xl font-bold text-gray-900 capitalize">
                                {settings.weightingScheme}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Check */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-2">Before You Run</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>✓ All constructs have sufficient indicators</li>
                            <li>✓ Structural paths are correctly specified</li>
                            <li>✓ Algorithm settings are appropriate</li>
                            <li>✓ Ready to estimate the model</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Run Button Reminder */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 text-center">
                    Click <strong>"Run Analysis"</strong> below to estimate your PLS-SEM model.
                    This may take a few moments depending on model complexity.
                </p>
            </div>
        </div>
    );
};
