
import fs from 'fs';
import path from 'path';

function generateSEMData(n = 500) {
    const data = [];
    const headers = [
        'ID', 'Gender', 'Age', 'Education',
        'SN1', 'SN2', 'SN3', 'SN4',
        'ATT1', 'ATT2', 'ATT3', 'ATT4',
        'PBC1', 'PBC2', 'PBC3', 'PBC4',
        'INT1', 'INT2', 'INT3', 'INT4',
        'BEH1', 'BEH2', 'BEH3', 'BEH4'
    ];

    const rnorm = () => (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3) / 1.732;
    const clamp = (val, min, max) => Math.round(Math.max(min, Math.min(max, val)));

    for (let i = 1; i <= n; i++) {
        // Latent Traits
        const sn_latent = rnorm();
        const att_latent = rnorm();
        const pbc_latent = rnorm();
        
        const int_latent = 0.4 * sn_latent + 0.3 * att_latent + 0.2 * pbc_latent + (rnorm() * 0.5);
        const beh_latent = 0.6 * int_latent + (rnorm() * 0.4);

        const row = {
            ID: i,
            Gender: Math.random() > 0.5 ? 'Male' : 'Female',
            Age: 18 + Math.floor(Math.random() * 40),
            Education: 1 + Math.floor(Math.random() * 4)
        };

        const toLikert = (latent, loading = 0.8) => clamp(3.5 + (latent * loading) + (rnorm() * 0.8), 1, 5);

        row.SN1 = toLikert(sn_latent, 0.85); row.SN2 = toLikert(sn_latent, 0.82); row.SN3 = toLikert(sn_latent, 0.78); row.SN4 = toLikert(sn_latent, 0.75);
        row.ATT1 = toLikert(att_latent, 0.88); row.ATT2 = toLikert(att_latent, 0.84); row.ATT3 = toLikert(att_latent, 0.81); row.ATT4 = toLikert(att_latent, 0.79);
        row.PBC1 = toLikert(pbc_latent, 0.83); row.PBC2 = toLikert(pbc_latent, 0.80); row.PBC3 = toLikert(pbc_latent, 0.77); row.PBC4 = toLikert(pbc_latent, 0.74);
        row.INT1 = toLikert(int_latent, 0.90); row.INT2 = toLikert(int_latent, 0.87); row.INT3 = toLikert(int_latent, 0.85); row.INT4 = toLikert(int_latent, 0.82);
        row.BEH1 = toLikert(beh_latent, 0.89); row.BEH2 = toLikert(beh_latent, 0.86); row.BEH3 = toLikert(beh_latent, 0.83); row.BEH4 = toLikert(beh_latent, 0.80);

        data.push(headers.map(h => row[h]).join(','));
    }

    return [headers.join(','), ...data].join('\n');
}

const csvContent = generateSEMData(500);
fs.writeFileSync('public/data/ncsstat_sample_500.csv', csvContent);
console.log('✅ Created ncsstat_sample_500.csv in public/data/');
