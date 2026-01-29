import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { LatentVariable, ConstructType } from '@/types/plssem';
import { Badge } from '@/components/ui/Badge';

interface ConstructsStepProps {
    constructs: LatentVariable[];
    onAdd: () => void;
    onEdit: (construct: LatentVariable) => void;
    onDelete: (id: string) => void;
    isAdding: boolean;
    editing: LatentVariable | null;
    onSave: (construct: LatentVariable) => void;
    onUpdate: (id: string, construct: LatentVariable) => void;
    onCancelEdit: () => void;
}

export const ConstructsStep: React.FC<ConstructsStepProps> = ({
    constructs,
    onAdd,
    onEdit,
    onDelete,
    isAdding,
    editing,
    onSave,
    onUpdate,
    onCancelEdit
}) => {
    return (
        <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Step 1: Define Latent Variables (Constructs)</h4>
                <p className="text-sm text-blue-700">
                    Create at least 2 latent variables for your PLS-SEM model.
                    Each construct will be measured by observed variables (indicators) in the next step.
                </p>
                <div className="mt-3 space-y-1 text-sm text-blue-600">
                    <p>• <strong>Reflective</strong>: Indicators are caused by the construct (most common)</p>
                    <p>• <strong>Formative</strong>: Indicators form/cause the construct</p>
                </div>
            </div>

            {/* Existing Constructs List */}
            {constructs.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">
                        Defined Constructs ({constructs.length})
                    </h4>
                    {constructs.map((construct) => (
                        <div
                            key={construct.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h5 className="font-semibold text-lg">{construct.name}</h5>
                                        <Badge variant={construct.type === 'reflective' ? 'info' : 'warning'}>
                                            {construct.type === 'reflective' ? 'Reflective' : 'Formative'}
                                        </Badge>
                                        {construct.indicators.length > 0 && (
                                            <Badge variant="success">
                                                {construct.indicators.length} indicators
                                            </Badge>
                                        )}
                                    </div>
                                    {construct.indicators.length > 0 && (
                                        <p className="text-sm text-gray-600">
                                            Indicators: {construct.indicators.join(', ')}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEdit(construct)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(construct.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Form */}
            {(isAdding || editing) && (
                <ConstructForm
                    construct={editing}
                    onSave={editing ? (c) => onUpdate(editing.id, c) : onSave}
                    onCancel={onCancelEdit}
                />
            )}

            {/* Add Button */}
            {!isAdding && !editing && (
                <button
                    onClick={onAdd}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
                >
                    <Plus className="w-5 h-5" />
                    Add Latent Variable
                </button>
            )}

            {/* Validation Message */}
            {constructs.length < 2 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                        ⚠️ You need at least 2 latent variables to proceed.
                        Currently: {constructs.length}/2
                    </p>
                </div>
            )}
        </div>
    );
};

// Construct Form Component
interface ConstructFormProps {
    construct: LatentVariable | null;
    onSave: (construct: LatentVariable) => void;
    onCancel: () => void;
}

const ConstructForm: React.FC<ConstructFormProps> = ({ construct, onSave, onCancel }) => {
    const [name, setName] = useState(construct?.name || '');
    const [type, setType] = useState<ConstructType>(construct?.type || 'reflective');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave({
                id: construct?.id || `lv_${Date.now()}`,
                name: name.trim(),
                type,
                indicators: construct?.indicators || []
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50">
            <h4 className="font-semibold text-gray-900 mb-4">
                {construct ? 'Edit Latent Variable' : 'New Latent Variable'}
            </h4>

            <div className="space-y-4">
                {/* Name Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Construct Name *
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Customer Satisfaction, Brand Loyalty"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        autoFocus
                    />
                </div>

                {/* Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Construct Type *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setType('reflective')}
                            className={`
                                p-4 border-2 rounded-lg text-left transition-all
                                ${type === 'reflective'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }
                            `}
                        >
                            <div className="font-semibold mb-1">Reflective</div>
                            <div className="text-sm text-gray-600">
                                Construct → Indicators
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                (Most common)
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setType('formative')}
                            className={`
                                p-4 border-2 rounded-lg text-left transition-all
                                ${type === 'formative'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }
                            `}
                        >
                            <div className="font-semibold mb-1">Formative</div>
                            <div className="text-sm text-gray-600">
                                Indicators → Construct
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                (Advanced)
                            </div>
                        </button>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className={`
                            flex-1 py-2 rounded-lg flex items-center justify-center gap-2
                            ${name.trim()
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }
                        `}
                    >
                        <Check className="w-4 h-4" />
                        {construct ? 'Update' : 'Add'} Construct
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};
