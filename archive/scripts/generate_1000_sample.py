import pandas as pd
import numpy as np
import os

input_file = "public/data/ncsstat_sample_500.csv"
output_file = "public/data/ncsstat_sample_1000.csv"

print(f"Reading {input_file}...")
df = pd.read_csv(input_file)

# We want to double the dataset but keep it realistic.
# For demographic/categorical columns, we'll just sample with replacement.
# For numeric/Likert columns, we'll add slight random noise but bound them to 1-5.

df_new = df.copy()

np.random.seed(42)

for col in df_new.columns:
    if df_new[col].dtype in ['int64', 'float64']:
        # If it looks like a Likert scale (min >= 1, max <= 7)
        if df_new[col].min() >= 1 and df_new[col].max() <= 7:
            # Shift 20% of the data by either +1 or -1 randomly, bounded by the column's min and max
            shift_mask = np.random.rand(len(df_new)) < 0.2
            shifts = np.random.choice([-1, 1], size=len(df_new))
            
            new_vals = df_new[col].values.copy()
            new_vals[shift_mask] += shifts[shift_mask]
            
            # Clip to original min and max to keep it realistic
            new_vals = np.clip(new_vals, df[col].min(), df[col].max())
            df_new[col] = new_vals
        else:
            # Continuous data: add 5% noise
            std = df_new[col].std()
            if std > 0:
                noise = np.random.normal(0, std * 0.05, len(df_new))
                df_new[col] += noise

# Combine original and new to get 1000 rows
df_1000 = pd.concat([df, df_new], ignore_index=True)

# Ensure exactly 1000 rows if original wasn't exactly 500
if len(df_1000) > 1000:
    df_1000 = df_1000.sample(n=1000, random_state=42).reset_index(drop=True)
elif len(df_1000) < 1000:
    # Just sample more if it's less
    diff = 1000 - len(df_1000)
    extra = df_1000.sample(n=diff, replace=True, random_state=42)
    df_1000 = pd.concat([df_1000, extra], ignore_index=True)

df_1000.to_csv(output_file, index=False)
print(f"Successfully generated {output_file} with {len(df_1000)} rows.")
