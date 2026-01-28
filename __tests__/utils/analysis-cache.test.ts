import { describe, test, expect, beforeEach } from '@jest/globals';

/**
 * Mock Analysis Cache for testing
 */
class AnalysisCache {
    private cache: Map<string, any> = new Map();
    private readonly TTL = 30 * 60 * 1000; // 30 minutes
    private readonly MAX_ENTRIES = 50;

    generateKey(data: any[], type: string, params: any): string {
        const dataHash = JSON.stringify(data).substring(0, 50);
        const paramsHash = JSON.stringify(params);
        return `${type}-${dataHash}-${paramsHash}`;
    }

    get(data: any[], type: string, params: any): any | null {
        const key = this.generateKey(data, type, params);
        const entry = this.cache.get(key);

        if (!entry) return null;

        // Check TTL
        if (Date.now() - entry.timestamp > this.TTL) {
            this.cache.delete(key);
            return null;
        }

        return entry.result;
    }

    set(data: any[], type: string, params: any, result: any): void {
        // LRU eviction
        if (this.cache.size >= this.MAX_ENTRIES) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey !== undefined) {
                this.cache.delete(oldestKey);
            }
        }

        const key = this.generateKey(data, type, params);
        this.cache.set(key, {
            result,
            timestamp: Date.now()
        });
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }
}

describe('AnalysisCache', () => {
    let cache: AnalysisCache;

    const mockData = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];

    const mockResult = {
        alpha: 0.85,
        items: 5
    };

    beforeEach(() => {
        cache = new AnalysisCache();
    });

    describe('Basic caching', () => {
        test('should store and retrieve cached result', () => {
            cache.set(mockData, 'cronbach', {}, mockResult);

            const retrieved = cache.get(mockData, 'cronbach', {});

            expect(retrieved).toEqual(mockResult);
        });

        test('should return null for non-existent cache', () => {
            const retrieved = cache.get(mockData, 'cronbach', {});

            expect(retrieved).toBeNull();
        });

        test('should differentiate between analysis types', () => {
            cache.set(mockData, 'cronbach', {}, { alpha: 0.85 });
            cache.set(mockData, 'efa', {}, { factors: 3 });

            const cronbach = cache.get(mockData, 'cronbach', {});
            const efa = cache.get(mockData, 'efa', {});

            expect(cronbach).toEqual({ alpha: 0.85 });
            expect(efa).toEqual({ factors: 3 });
        });

        test('should differentiate between different data', () => {
            const data1 = [[1, 2], [3, 4]];
            const data2 = [[5, 6], [7, 8]];

            cache.set(data1, 'cronbach', {}, { alpha: 0.8 });
            cache.set(data2, 'cronbach', {}, { alpha: 0.9 });

            const result1 = cache.get(data1, 'cronbach', {});
            const result2 = cache.get(data2, 'cronbach', {});

            expect(result1).toEqual({ alpha: 0.8 });
            expect(result2).toEqual({ alpha: 0.9 });
        });

        test('should differentiate between different params', () => {
            cache.set(mockData, 'efa', { nFactors: 2 }, { factors: 2 });
            cache.set(mockData, 'efa', { nFactors: 3 }, { factors: 3 });

            const result2 = cache.get(mockData, 'efa', { nFactors: 2 });
            const result3 = cache.get(mockData, 'efa', { nFactors: 3 });

            expect(result2).toEqual({ factors: 2 });
            expect(result3).toEqual({ factors: 3 });
        });
    });

    describe('TTL expiration', () => {
        test('should expire cache after TTL', () => {
            cache.set(mockData, 'cronbach', {}, mockResult);

            // Mock time passage (31 minutes)
            jest.useFakeTimers();
            jest.advanceTimersByTime(31 * 60 * 1000);

            const retrieved = cache.get(mockData, 'cronbach', {});

            expect(retrieved).toBeNull();

            jest.useRealTimers();
        });

        test('should not expire cache before TTL', () => {
            cache.set(mockData, 'cronbach', {}, mockResult);

            // Mock time passage (29 minutes)
            jest.useFakeTimers();
            jest.advanceTimersByTime(29 * 60 * 1000);

            const retrieved = cache.get(mockData, 'cronbach', {});

            expect(retrieved).toEqual(mockResult);

            jest.useRealTimers();
        });
    });

    describe('LRU eviction', () => {
        test('should evict oldest entry when max entries reached', () => {
            // Fill cache to max (50 entries)
            for (let i = 0; i < 50; i++) {
                cache.set([[i]], `type${i}`, {}, { value: i });
            }

            expect(cache.size()).toBe(50);

            // Add one more (should evict first entry)
            cache.set([[51]], 'type51', {}, { value: 51 });

            expect(cache.size()).toBe(50);

            // First entry should be evicted
            const first = cache.get([[0]], 'type0', {});
            expect(first).toBeNull();

            // Last entry should exist
            const last = cache.get([[51]], 'type51', {});
            expect(last).toEqual({ value: 51 });
        });

        test('should maintain max entries limit', () => {
            // Add 100 entries
            for (let i = 0; i < 100; i++) {
                cache.set([[i]], `type${i}`, {}, { value: i });
            }

            // Should only have 50 (max)
            expect(cache.size()).toBe(50);
        });
    });

    describe('Cache invalidation', () => {
        test('should clear all cache entries', () => {
            cache.set(mockData, 'cronbach', {}, mockResult);
            cache.set(mockData, 'efa', {}, { factors: 3 });

            expect(cache.size()).toBe(2);

            cache.clear();

            expect(cache.size()).toBe(0);

            const retrieved = cache.get(mockData, 'cronbach', {});
            expect(retrieved).toBeNull();
        });
    });

    describe('Key generation', () => {
        test('should generate consistent keys for same input', () => {
            const key1 = cache.generateKey(mockData, 'cronbach', {});
            const key2 = cache.generateKey(mockData, 'cronbach', {});

            expect(key1).toBe(key2);
        });

        test('should generate different keys for different inputs', () => {
            const key1 = cache.generateKey(mockData, 'cronbach', {});
            const key2 = cache.generateKey(mockData, 'efa', {});
            const key3 = cache.generateKey([[1]], 'cronbach', {});

            expect(key1).not.toBe(key2);
            expect(key1).not.toBe(key3);
            expect(key2).not.toBe(key3);
        });
    });

    describe('Performance', () => {
        test('should handle large datasets efficiently', () => {
            const largeData = Array.from({ length: 1000 }, (_, i) =>
                Array.from({ length: 10 }, (_, j) => i * 10 + j)
            );

            const startTime = Date.now();

            cache.set(largeData, 'cronbach', {}, mockResult);
            const retrieved = cache.get(largeData, 'cronbach', {});

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(retrieved).toEqual(mockResult);
            expect(duration).toBeLessThan(100); // Should be fast (< 100ms)
        });

        test('should handle many cache operations efficiently', () => {
            const startTime = Date.now();

            // 1000 set operations
            for (let i = 0; i < 1000; i++) {
                cache.set([[i]], `type${i % 50}`, {}, { value: i });
            }

            // 1000 get operations
            for (let i = 0; i < 1000; i++) {
                cache.get([[i]], `type${i % 50}`, {});
            }

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(1000); // Should be fast (< 1s)
        });
    });

    describe('Edge cases', () => {
        test('should handle empty data', () => {
            cache.set([], 'cronbach', {}, mockResult);
            const retrieved = cache.get([], 'cronbach', {});

            expect(retrieved).toEqual(mockResult);
        });

        test('should handle null params', () => {
            cache.set(mockData, 'cronbach', null, mockResult);
            const retrieved = cache.get(mockData, 'cronbach', null);

            expect(retrieved).toEqual(mockResult);
        });

        test('should handle complex nested params', () => {
            const complexParams = {
                rotation: 'varimax',
                nFactors: 3,
                options: {
                    maxIter: 100,
                    threshold: 0.3
                }
            };

            cache.set(mockData, 'efa', complexParams, mockResult);
            const retrieved = cache.get(mockData, 'efa', complexParams);

            expect(retrieved).toEqual(mockResult);
        });
    });
});
