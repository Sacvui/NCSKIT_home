"""
Batch add lazy loading calls to remaining hypothesis test methods
"""

import re

# Read the file
with open('lib/webr/analyses/hypothesis.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the methods and their lazy loading method names
methods_to_update = [
    ('runTTestIndependent', 'ttest'),
    ('runTTestPaired', 'paired-ttest'),
    ('runOneWayANOVA', 'anova'),
    ('runMannWhitneyU', 'mann-whitney'),
    ('runChiSquare', 'chi-square'),
    ('runKruskalWallis', 'kruskal'),
    ('runWilcoxonSignedRank', 'wilcoxon'),
]

for func_name, method_name in methods_to_update:
    # Pattern to find the function and add lazy loading after the opening brace
    # Look for: export async function FUNCNAME(...): Promise<{...}> {
    #           const rCode = `
    
    pattern = rf'(export async function {func_name}\([^)]*\): Promise<{{[^}}]*}}> {{\s*)(const rCode = `)'
    
    replacement = rf'\1// Lazy load required packages\n    await loadPackagesForMethod(\'{method_name}\');\n    \n    \2'
    
    # Check if already has lazy loading
    if f"loadPackagesForMethod('{method_name}')" not in content:
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        print(f"✅ Added lazy loading to {func_name}")
    else:
        print(f"⏭️  {func_name} already has lazy loading")

# Write back
with open('lib/webr/analyses/hypothesis.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ All hypothesis methods updated!")
