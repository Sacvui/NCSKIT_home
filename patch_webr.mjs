import { workerData, parentPort } from 'worker_threads';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Monkey patch the global Worker constructor to fix WebR Windows bug
import worker_threads from 'worker_threads';
const OriginalWorker = worker_threads.Worker;
worker_threads.Worker = function(scriptUrl, options) {
    if (typeof scriptUrl === 'string' && !scriptUrl.startsWith('file://')) {
        // WebR tries to use "D:/..." instead of "file:///D:/..."
        scriptUrl = 'file:///' + scriptUrl.replace(/\\/g, '/');
    }
    return new OriginalWorker(scriptUrl, options);
};

// Also patch global Worker if needed
globalThis.Worker = worker_threads.Worker;

// Now import WebR
import { WebR } from 'webr';

// Import templates
import { runCronbachAlpha, runEFA, runCFA, runLinearRegression, runTTestIndependent } from './lib/webr-wrapper.ts';
// Wait, lib/webr-wrapper.ts is TypeScript, Node can't run it directly without tsx!
