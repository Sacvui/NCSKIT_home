import pandas as pd
import numpy as np

def cronbach_alpha(df):
    df = df.dropna()
    item_vars = df.var(axis=0, ddof=1)
    t_var = df.sum(axis=1).var(ddof=1)
    k = df.shape[1]
    if t_var == 0:
        return np.nan
    return (k / (k - 1)) * (1 - (item_vars.sum() / t_var))

df = pd.read_csv("public/data/ncsstat_sample_1000.csv")

# Scales
scales = {
    'SN': ['SN1', 'SN2', 'SN3', 'SN4'],
    'ATT': ['ATT1', 'ATT2', 'ATT3', 'ATT4'],
    'PBC': ['PBC1', 'PBC2', 'PBC3', 'PBC4'],
    'INT': ['INT1', 'INT2', 'INT3', 'INT4'],
    'BEH': ['BEH1', 'BEH2', 'BEH3', 'BEH4']
}

print("=== RELIABILITY (Cronbach's Alpha) ===")
for name, items in scales.items():
    alpha = cronbach_alpha(df[items])
    print(f"{name} ({len(items)} items): {alpha:.4f}")

# Generate Composite Scores (Means)
for name, items in scales.items():
    df[name] = df[items].mean(axis=1)

print("\n=== DESCRIPTIVE STATS ===")
for name in scales.keys():
    print(f"{name}: Mean = {df[name].mean():.4f}, SD = {df[name].std():.4f}")

# Multiple Regression: INT ~ SN + ATT + PBC
print("\n=== REGRESSION: INT ~ SN + ATT + PBC ===")
from scipy import stats
import statsmodels.api as sm

X = df[['SN', 'ATT', 'PBC']]
X = sm.add_constant(X)
y = df['INT']

model = sm.OLS(y, X, missing='drop').fit()
print(model.summary().tables[1])

print("\n=== REGRESSION: BEH ~ INT + PBC ===")
X2 = df[['INT', 'PBC']]
X2 = sm.add_constant(X2)
y2 = df['BEH']
model2 = sm.OLS(y2, X2, missing='drop').fit()
print(model2.summary().tables[1])

print("\n=== VIF (INT ~ SN + ATT + PBC) ===")
# manual vif
from statsmodels.stats.outliers_influence import variance_inflation_factor
vifs = [variance_inflation_factor(X.values, i) for i in range(1, X.shape[1])]
for idx, name in enumerate(['SN', 'ATT', 'PBC']):
    print(f"VIF {name}: {vifs[idx]:.4f}")
