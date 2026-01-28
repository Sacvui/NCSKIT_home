import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { renderHook, act, waitFor } from '@testing-library/react';
import { set, get, del } from 'idb-keyval';
import { useWorkspacePersistence, WorkspaceState } from '@/hooks/useWorkspacePersistence';

// Mock idb-keyval
jest.mock('idb-keyval');

const mockSet = set as jest.MockedFunction<typeof set>;
const mockGet = get as jest.MockedFunction<typeof get>;
const mockDel = del as jest.MockedFunction<typeof del>;

describe('useWorkspacePersistence', () => {
    const mockData = [
        { id: 1, value: 5 },
        { id: 2, value: 4 },
        { id: 3, value: 3 }
    ];

    const mockProps = {
        uploadedData: mockData,
        fileName: 'test.csv',
        selectedVariables: ['var1', 'var2'],
        analysisType: 'cronbach',
        analysisResults: { alpha: 0.85 },
        enabled: true
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    describe('Auto-save functionality', () => {
        test('should auto-save workspace every 30 seconds', async () => {
            renderHook(() => useWorkspacePersistence(mockProps));

            // Fast-forward 30 seconds
            act(() => {
                jest.advanceTimersByTime(30000);
            });

            await waitFor(() => {
                expect(mockSet).toHaveBeenCalledWith(
                    'ncsstat_workspace',
                    expect.objectContaining({
                        data: mockData,
                        fileName: 'test.csv',
                        selectedVariables: ['var1', 'var2'],
                        analysisType: 'cronbach',
                        results: { alpha: 0.85 },
                        version: '1.0'
                    })
                );
            });
        });

        test('should not save if data is empty', async () => {
            const emptyProps = { ...mockProps, uploadedData: [] };
            renderHook(() => useWorkspacePersistence(emptyProps));

            act(() => {
                jest.advanceTimersByTime(30000);
            });

            await waitFor(() => {
                expect(mockSet).not.toHaveBeenCalled();
            });
        });

        test('should not save if disabled', async () => {
            const disabledProps = { ...mockProps, enabled: false };
            renderHook(() => useWorkspacePersistence(disabledProps));

            act(() => {
                jest.advanceTimersByTime(30000);
            });

            await waitFor(() => {
                expect(mockSet).not.toHaveBeenCalled();
            });
        });

        test('should save multiple times', async () => {
            renderHook(() => useWorkspacePersistence(mockProps));

            // First save
            act(() => {
                jest.advanceTimersByTime(30000);
            });

            // Second save
            act(() => {
                jest.advanceTimersByTime(30000);
            });

            await waitFor(() => {
                expect(mockSet).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe('Restore functionality', () => {
        test('should restore valid workspace', async () => {
            const savedWorkspace: WorkspaceState = {
                data: mockData,
                fileName: 'test.csv',
                selectedVariables: ['var1', 'var2'],
                analysisType: 'cronbach',
                results: { alpha: 0.85 },
                timestamp: Date.now() - 1000, // 1 second ago
                version: '1.0'
            };

            mockGet.mockResolvedValue(savedWorkspace);

            const { result } = renderHook(() => useWorkspacePersistence(mockProps));

            const restored = await result.current.restoreWorkspace();

            expect(restored).toEqual(savedWorkspace);
            expect(mockGet).toHaveBeenCalledWith('ncsstat_workspace');
        });

        test('should return null if no saved workspace', async () => {
            mockGet.mockResolvedValue(undefined);

            const { result } = renderHook(() => useWorkspacePersistence(mockProps));

            const restored = await result.current.restoreWorkspace();

            expect(restored).toBeNull();
        });

        test('should clear old workspace (> 24 hours)', async () => {
            const oldWorkspace: WorkspaceState = {
                data: mockData,
                fileName: 'test.csv',
                selectedVariables: ['var1', 'var2'],
                analysisType: 'cronbach',
                results: { alpha: 0.85 },
                timestamp: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
                version: '1.0'
            };

            mockGet.mockResolvedValue(oldWorkspace);

            const { result } = renderHook(() => useWorkspacePersistence(mockProps));

            const restored = await result.current.restoreWorkspace();

            expect(restored).toBeNull();
            expect(mockDel).toHaveBeenCalledWith('ncsstat_workspace');
        });

        test('should clear workspace with version mismatch', async () => {
            const oldVersionWorkspace: WorkspaceState = {
                data: mockData,
                fileName: 'test.csv',
                selectedVariables: ['var1', 'var2'],
                analysisType: 'cronbach',
                results: { alpha: 0.85 },
                timestamp: Date.now(),
                version: '0.9' // Old version
            };

            mockGet.mockResolvedValue(oldVersionWorkspace);

            const { result } = renderHook(() => useWorkspacePersistence(mockProps));

            const restored = await result.current.restoreWorkspace();

            expect(restored).toBeNull();
            expect(mockDel).toHaveBeenCalledWith('ncsstat_workspace');
        });
    });

    describe('Clear functionality', () => {
        test('should clear workspace', async () => {
            const { result } = renderHook(() => useWorkspacePersistence(mockProps));

            await result.current.clearWorkspace();

            expect(mockDel).toHaveBeenCalledWith('ncsstat_workspace');
        });
    });

    describe('Manual save functionality', () => {
        test('should manually save workspace', async () => {
            const { result } = renderHook(() => useWorkspacePersistence(mockProps));

            const success = await result.current.saveWorkspace();

            expect(success).toBe(true);
            expect(mockSet).toHaveBeenCalledWith(
                'ncsstat_workspace',
                expect.objectContaining({
                    data: mockData,
                    fileName: 'test.csv'
                })
            );
        });

        test('should not save if no data', async () => {
            const emptyProps = { ...mockProps, uploadedData: [] };
            const { result } = renderHook(() => useWorkspacePersistence(emptyProps));

            const success = await result.current.saveWorkspace();

            expect(success).toBe(false);
            expect(mockSet).not.toHaveBeenCalled();
        });
    });

    describe('Error handling', () => {
        test('should handle save errors gracefully', async () => {
            mockSet.mockRejectedValue(new Error('IndexedDB error'));

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            renderHook(() => useWorkspacePersistence(mockProps));

            act(() => {
                jest.advanceTimersByTime(30000);
            });

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith(
                    '❌ Failed to save workspace:',
                    expect.any(Error)
                );
            });

            consoleSpy.mockRestore();
        });

        test('should handle restore errors gracefully', async () => {
            mockGet.mockRejectedValue(new Error('IndexedDB error'));

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            const { result } = renderHook(() => useWorkspacePersistence(mockProps));

            const restored = await result.current.restoreWorkspace();

            expect(restored).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith(
                '❌ Failed to restore workspace:',
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });
    });

    describe('Cleanup', () => {
        test('should cleanup interval on unmount', () => {
            const { unmount } = renderHook(() => useWorkspacePersistence(mockProps));

            const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

            unmount();

            expect(clearIntervalSpy).toHaveBeenCalled();
        });
    });
});
