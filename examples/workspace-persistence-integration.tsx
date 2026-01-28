/**
 * Example Integration: Auto-Save Workspace
 * 
 * This file demonstrates how to integrate the workspace persistence feature
 * into the analyze page.
 * 
 * Add this code to: app/analyze/page.tsx
 */

import { useState, useEffect } from 'react';
import { useWorkspacePersistence, WorkspaceState } from '@/hooks/useWorkspacePersistence';
import { WorkspaceRestorePrompt } from '@/components/WorkspaceRestorePrompt';

export default function AnalyzePage() {
    // Existing state
    const [uploadedData, setUploadedData] = useState<any[]>([]);
    const [fileName, setFileName] = useState('');
    const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
    const [analysisType, setAnalysisType] = useState('');
    const [analysisResults, setAnalysisResults] = useState<any>(null);

    // NEW: Workspace persistence state
    const [showRestorePrompt, setShowRestorePrompt] = useState(false);
    const [savedWorkspace, setSavedWorkspace] = useState<WorkspaceState | null>(null);

    // NEW: Initialize persistence hook
    const { restoreWorkspace, clearWorkspace, saveWorkspace } = useWorkspacePersistence({
        uploadedData,
        fileName,
        selectedVariables,
        analysisType,
        analysisResults,
        enabled: true // Set to false to disable auto-save
    });

    // NEW: Check for saved workspace on mount
    useEffect(() => {
        async function checkSavedWorkspace() {
            const saved = await restoreWorkspace();
            if (saved) {
                setSavedWorkspace(saved);
                setShowRestorePrompt(true);
            }
        }

        checkSavedWorkspace();
    }, [restoreWorkspace]);

    // NEW: Handle restore action
    const handleRestore = () => {
        if (savedWorkspace) {
            setUploadedData(savedWorkspace.data);
            setFileName(savedWorkspace.fileName);
            setSelectedVariables(savedWorkspace.selectedVariables);
            setAnalysisType(savedWorkspace.analysisType);
            setAnalysisResults(savedWorkspace.results);
            setShowRestorePrompt(false);

            // Optional: Show success toast
            console.log('✅ Workspace restored successfully');
        }
    };

    // NEW: Handle discard action
    const handleDiscard = async () => {
        await clearWorkspace();
        setShowRestorePrompt(false);
        setSavedWorkspace(null);

        // Optional: Show info toast
        console.log('ℹ️ Starting fresh workspace');
    };

    // NEW: Manual save button (optional)
    const handleManualSave = async () => {
        const success = await saveWorkspace();
        if (success) {
            console.log('✅ Workspace saved manually');
            // Show success toast
        }
    };

    return (
        <div>
            {/* NEW: Show restore prompt if saved workspace exists */}
            {showRestorePrompt && savedWorkspace && (
                <WorkspaceRestorePrompt
                    fileName={savedWorkspace.fileName}
                    timestamp={savedWorkspace.timestamp}
                    dataRows={savedWorkspace.data.length}
                    onRestore={handleRestore}
                    onDiscard={handleDiscard}
                />
            )}

            {/* Existing analyze page content */}
            <div className="container mx-auto p-6">
                <h1>Statistical Analysis</h1>

                {/* Optional: Manual save button */}
                {uploadedData.length > 0 && (
                    <button
                        onClick={handleManualSave}
                        className="btn-secondary"
                        title="Save workspace manually"
                    >
                        💾 Save Workspace
                    </button>
                )}

                {/* Rest of your analyze page... */}
            </div>
        </div>
    );
}

/**
 * NOTES:
 * 
 * 1. Auto-save runs every 30 seconds automatically
 * 2. Data is saved to IndexedDB (persistent across sessions)
 * 3. Saved data expires after 24 hours
 * 4. Version checking prevents incompatible data restoration
 * 5. Manual save button is optional but recommended
 * 
 * TESTING:
 * 
 * 1. Upload data and select variables
 * 2. Refresh the page
 * 3. You should see the restore prompt
 * 4. Click "Phục hồi" to restore your work
 * 5. Check browser console for auto-save logs
 * 
 * CUSTOMIZATION:
 * 
 * - Change AUTO_SAVE_INTERVAL in useWorkspacePersistence.ts (default: 30s)
 * - Change MAX_AGE for data expiration (default: 24h)
 * - Disable auto-save by setting enabled={false}
 * - Customize WorkspaceRestorePrompt styling
 */
