import { useEffect, useCallback } from 'react';
import { set, get, del } from 'idb-keyval';

export interface WorkspaceState {
    data: any[];
    fileName: string;
    selectedVariables: string[];
    analysisType: string;
    results: any;
    timestamp: number;
    version: string; // For future compatibility
}

interface UseWorkspacePersistenceProps {
    uploadedData: any[];
    fileName: string;
    selectedVariables: string[];
    analysisType: string;
    analysisResults: any;
    enabled?: boolean;
}

export function useWorkspacePersistence({
    uploadedData,
    fileName,
    selectedVariables,
    analysisType,
    analysisResults,
    enabled = true
}: UseWorkspacePersistenceProps) {
    const WORKSPACE_KEY = 'ncsstat_workspace';
    const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
    const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
    const VERSION = '1.0';

    // Auto-save workspace
    useEffect(() => {
        if (!enabled) return;

        const interval = setInterval(async () => {
            // Only save if there's actual data
            if (uploadedData && uploadedData.length > 0) {
                try {
                    const workspace: WorkspaceState = {
                        data: uploadedData,
                        fileName,
                        selectedVariables,
                        analysisType,
                        results: analysisResults,
                        timestamp: Date.now(),
                        version: VERSION
                    };

                    await set(WORKSPACE_KEY, workspace);
                    console.log('✅ Workspace auto-saved at', new Date().toLocaleTimeString());
                } catch (error) {
                    console.error('❌ Failed to save workspace:', error);
                }
            }
        }, AUTO_SAVE_INTERVAL);

        return () => clearInterval(interval);
    }, [uploadedData, fileName, selectedVariables, analysisType, analysisResults, enabled]);

    // Restore workspace on mount
    const restoreWorkspace = useCallback(async (): Promise<WorkspaceState | null> => {
        try {
            const saved = await get<WorkspaceState>(WORKSPACE_KEY);

            if (!saved) {
                console.log('ℹ️ No saved workspace found');
                return null;
            }

            // Check version compatibility
            if (saved.version !== VERSION) {
                console.warn('⚠️ Workspace version mismatch, clearing old data');
                await del(WORKSPACE_KEY);
                return null;
            }

            // Check if saved data is recent (< 24 hours)
            const age = Date.now() - saved.timestamp;
            if (age > MAX_AGE) {
                console.log('ℹ️ Saved workspace is too old, clearing');
                await del(WORKSPACE_KEY);
                return null;
            }

            console.log('✅ Found saved workspace from', new Date(saved.timestamp).toLocaleString());
            return saved;
        } catch (error) {
            console.error('❌ Failed to restore workspace:', error);
            return null;
        }
    }, []);

    // Clear workspace
    const clearWorkspace = useCallback(async () => {
        try {
            await del(WORKSPACE_KEY);
            console.log('✅ Workspace cleared');
        } catch (error) {
            console.error('❌ Failed to clear workspace:', error);
        }
    }, []);

    // Manual save (for explicit user action)
    const saveWorkspace = useCallback(async () => {
        if (uploadedData && uploadedData.length > 0) {
            try {
                const workspace: WorkspaceState = {
                    data: uploadedData,
                    fileName,
                    selectedVariables,
                    analysisType,
                    results: analysisResults,
                    timestamp: Date.now(),
                    version: VERSION
                };

                await set(WORKSPACE_KEY, workspace);
                console.log('✅ Workspace manually saved');
                return true;
            } catch (error) {
                console.error('❌ Failed to save workspace:', error);
                return false;
            }
        }
        return false;
    }, [uploadedData, fileName, selectedVariables, analysisType, analysisResults]);

    return {
        restoreWorkspace,
        clearWorkspace,
        saveWorkspace
    };
}
