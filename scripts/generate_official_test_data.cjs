const fs = require('fs');
const path = require('path');

function generateCSV(filename, n, constructs) {
    const headers = ['id', 'gender', 'age', 'education'];
    const data = [];

    // Add construct items to headers
    constructs.forEach(c => {
        for (let i = 1; i <= c.items; i++) {
            headers.push(`${c.name}${i}`);
        }
    });

    for (let i = 1; i <= n; i++) {
        const row = [
            i,
            Math.random() > 0.5 ? 'Male' : 'Female',
            Math.floor(Math.random() * 40) + 20,
            Math.floor(Math.random() * 3) + 1 // 1: BS, 2: MS, 3: PhD
        ];

        // Generate correlated or random data for constructs
        constructs.forEach(c => {
            const baseValue = Math.floor(Math.random() * 5) + 1; // 1-5 scale
            for (let j = 1; j <= c.items; j++) {
                // Add some noise but keep correlation
                let val = baseValue + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0);
                val = Math.max(1, Math.min(5, val));
                row.push(val);
            }
        });
        data.push(row.join(','));
    }

    const content = [headers.join(','), ...data].join('\n');
    const outputPath = path.join('d:', 'ncskit_2026', 'public', filename);
    fs.writeFileSync(outputPath, content);
    console.log(`Generated ${filename} with ${n} rows.`);
}

// 1. Dùng thử dữ liệu mẫu (N=300)
generateCSV('sample_data_large.csv', 300, [
    { name: 'LD', items: 5 }, // Leadership
    { name: 'MT', items: 4 }, // Motivation
    { name: 'JS', items: 4 }, // Job Satisfaction
    { name: 'OC', items: 4 }, // Org Commitment
    { name: 'IP', items: 3 }  // Individual Perf
]);

// 2. Test SEM/CFA (N=500, 8 constructs)
generateCSV('test_data_sem_cfa.csv', 500, [
    { name: 'F1', items: 4 },
    { name: 'F2', items: 4 },
    { name: 'F3', items: 3 },
    { name: 'F4', items: 3 },
    { name: 'F5', items: 4 },
    { name: 'F6', items: 3 },
    { name: 'F7', items: 4 },
    { name: 'F8', items: 3 }
]);
