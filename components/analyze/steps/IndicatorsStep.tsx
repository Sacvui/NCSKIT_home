import React, { useState } from 'react';
import { Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { LatentVariable } from '@/types/plssem';
import { Badge } from '@/components/ui/Badge';
import { ModelValidation } from '@/types/plssem';

interface IndicatorsStepProps {
    constructs: LatentVariable[];
    columns: string[];
    onUpdate: (constructs: LatentVariable[]) => void;
    validation: ModelValidation;
}

export const IndicatorsStep: React.FC<IndicatorsStepProps> = ({
    constructs,
    columns,
    onUpdate,
    validation
}) => {
    const [expandedConstruct, setExpandedConstruct] = useState<string | null>(
        constructs[0]?.id || null
    );

    // Get assigned and unassigned indicators
    const assignedIndicators = new Set(
        constructs.flatMap(c => c.indicators)
    );
    const unassignedIndicators = columns.filter(col => !assignedIndicators.has(col));

    const handleToggleIndicator = (constructId: string, indicator: string) => {
        const updatedConstructs = constructs.map(c => {
            if (c.id === constructId) {
                const hasIndicator = c.indicators.includes(indicator);
                return {
                    ...c,
                    indicators: hasIndicator
                        ? c.indicators.filter(i => i !== indicator)
                        : [...c.indicators, indicator]
                };
            }
            // Remove from other constructs if assigned there
            return {
                ...c,
                indicators: c.indicators.filter(i => i !== indicator)
            };
        });
        onUpdate(updatedConstructs);
    };

    return (
        <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                    Step 2: Assign Indicators to Constructs
                </h4>
                <p className="text-sm text-blue-700">
                    Select which observed variables (columns from your dataset) measure each latent variable.
                </p>
                <div className="mt-3 space-y-1 text-sm text-blue-600">
                    <p>• <strong>Reflective</strong>: Need at least 2 indicators</p>
                    <p>• <strong>Formative</strong>: Need at least 1 indicator</p>
                    <p>• Each indicator can only belong to one construct</p>
                </div>
            </div>

            {/* Validation Errors */}
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

            {/* Validation Warnings */}
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

            {/* Constructs with Indicator Selection */}
            <div className="space-y-3">
                {constructs.map((construct) => {
                    const isExpanded = expandedConstruct === construct.id;
                    const minIndicators = construct.type === 'reflective' ? 2 : 1;
                    const hasEnough = construct.indicators.length >= minIndicators;

                    return (
                        <div
                            key={construct.id}
                            className={`
                                border-2 rounded-lg overflow-hidden transition-all
                                ${hasEnough ? 'border-green-300' : 'border-yellow-300'}
                            `}
                        >
                            {/* Construct Header */}
                            <button
                                onClick={() => setExpandedConstruct(
                                    isExpanded ? null : construct.id
                                )}
                                className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center
                                        ${hasEnough ? 'bg-green-600' : 'bg-yellow-600'}
                                    `}>
                                        {hasEnough ? (
                                            <Check className="w-5 h-5 text-white" />
                                        ) : (
                                            <span className="text-white font-bold">
                                                {construct.indicators.length}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-semibold text-lg">{construct.name}</h4>
                                        <p className="text-sm text-gray-600">
                                            {construct.indicators.length} / {minIndicators} indicators
                                            {' • '}
                                            {construct.type === 'reflective' ? 'Reflective' : 'Formative'}
                                        </p>
                                    </div>
                                </div>
                                {isExpanded ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </button>

                            {/* Indicator Selection */}
                            {isExpanded && (
                                <div className="p-4 bg-white border-t">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {columns.map((col) => {
                                            const isSelected = construct.indicators.includes(col);
                                            const isAssignedElsewhere = assignedIndicators.has(col) && !isSelected;

                                            return (
                                                <button
                                                    key={col}
                                                    onClick={() => handleToggleIndicator(construct.id, col)}
                                                    disabled={isAssignedElsewhere}
                                                    className={`
                                                        px-3 py-2 rounded-lg text-sm font-medium transition-all
                                                        ${isSelected
                                                            ? 'bg-blue-600 text-white'
                                                            : isAssignedElsewhere
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }
                                                    `}
                                                >
                                                    {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                                                    {col}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Selected Indicators Summary */}
                                    {construct.indicators.length > 0 && (
                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                            <p className="text-sm font-medium text-blue-900 mb-2">
                                                Selected Indicators:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {construct.indicators.map((ind) => (
                                                    <Badge key={ind} variant="info">
                                                        {ind}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Unassigned Indicators */}
            {unassignedIndicators.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                        Unassigned Variables ({unassignedIndicators.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {unassignedIndicators.map((col) => (
                            <Badge key={col} variant="default">
                                {col}
                            </Badge>
                        ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                        💡 These variables are not assigned to any construct.
                        You can leave them unassigned if they're not part of your model.
                    </p>
                </div>
            )}

            {/* Progress Summary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <div>
                        <p className="font-semibold text-green-900">
                            {constructs.filter(c =>
                                c.indicators.length >= (c.type === 'reflective' ? 2 : 1)
                            ).length} / {constructs.length} constructs ready
                        </p>
                        <p className="text-sm text-green-700">
                            {assignedIndicators.size} indicators assigned
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
