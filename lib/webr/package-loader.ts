/**
 * Dynamic Package Loader for WebR
 * Ensures packages are only loaded once and tracks loaded state
 */

import { initWebR } from './core';

// Track which packages have been loaded
const loadedPackages = new Set<string>();

/**
 * Load R package only if not already loaded
 */
export async function loadPackageIfNeeded(packageName: string): Promise<boolean> {
    // Check if already loaded
    if (loadedPackages.has(packageName)) {
        console.log(`📦 Package '${packageName}' already loaded, skipping...`);
        return true;
    }

    try {
        const webR = await initWebR();

        // Optimized check: Use file.exists on the primary lib path instead of slow installed.packages()
        const checkInstalled = await webR.evalR(`
          pkg_name <- "${packageName}"
          is_installed <- dir.exists(file.path(.libPaths()[1], pkg_name))
          is_installed
        `);

        const isInstalledResult = await checkInstalled.toJs();
        const isInstalled = (isInstalledResult as any)?.[0] === true ||
            (isInstalledResult as any)?.values?.[0] === true;

        if (!isInstalled) {
            console.log(`📦 Installing package '${packageName}'...`);
            await webR.installPackages([packageName], {
                repos: 'https://repo.r-wasm.org/'
            });
        }

        // Load the library
        console.log(`📦 Loading package '${packageName}'...`);
        await webR.evalR(`library(${packageName})`);

        // Mark as loaded
        loadedPackages.add(packageName);
        console.log(`✅ Package '${packageName}' loaded successfully`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to load package '${packageName}':`, error);
        return false;
    }
}

/**
 * Load multiple packages in sequence
 */
export async function loadPackages(packageNames: string[]): Promise<{ loaded: string[]; failed: string[] }> {
    const loaded: string[] = [];
    const failed: string[] = [];

    for (const pkg of packageNames) {
        const success = await loadPackageIfNeeded(pkg);
        if (success) {
            loaded.push(pkg);
        } else {
            failed.push(pkg);
        }
    }

    return { loaded, failed };
}

/**
 * Check if a package is loaded
 */
export function isPackageLoaded(packageName: string): boolean {
    return loadedPackages.has(packageName);
}

/**
 * Reset loaded packages tracking (for testing/debugging)
 */
export function resetLoadedPackages(): void {
    loadedPackages.clear();
}

/**
 * Get list of all loaded packages
 */
export function getLoadedPackages(): string[] {
    return Array.from(loadedPackages);
}

/**
 * Pre-load packages required for PLS-SEM analysis
 */
export async function preloadPLSSEMPackages(): Promise<void> {
    console.log('🚀 Pre-loading PLS-SEM packages...');

    const requiredPackages = [
        'psych',      // Already loaded in core, but check anyway
        'car',        // For VIF
        'boot',       // For bootstrapping
        // 'seminr',  // Not yet available in WebR
    ];

    const { loaded, failed } = await loadPackages(requiredPackages);

    console.log(`✅ PLS-SEM packages loaded: ${loaded.join(', ')}`);
    if (failed.length > 0) {
        console.warn(`⚠️ Failed to load: ${failed.join(', ')}`);
    }
}
