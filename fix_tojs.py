import re
import sys

def remove_redundant_tojs(filepath):
    """Remove redundant .toJs() calls after executeRWithRecovery"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern: executeRWithRecovery → toJs → parseWebRResult
    # Replace with: executeRWithRecovery → parseWebRResult (skip toJs)
    pattern = r'(const result = await executeRWithRecovery\([^)]+\);)\s*\n\s*const jsResult = await result\.toJs\(\) as any;\s*\n\s*(const getValue = parseWebRResult\()jsResult\);'
    
    replacement = r'\1\n    \2result);'
    
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ Fixed {filepath}")
        return True
    else:
        print(f"⏭️  No changes needed in {filepath}")
        return False

if __name__ == "__main__":
    files = [
        'lib/webr/analyses/hypothesis.ts',
        'lib/webr/analyses/reliability.ts',
        'lib/webr/analyses/regression.ts',
        'lib/webr/analyses/multivariate.ts',
        'lib/webr/analyses/mediation.ts',
    ]
    
    fixed_count = 0
    for filepath in files:
        if remove_redundant_tojs(filepath):
            fixed_count += 1
    
    print(f"\n🎯 Fixed {fixed_count}/{len(files)} files")
