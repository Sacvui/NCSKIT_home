import numpy as np
import pandas as pd
import random

np.random.seed(42)
random.seed(42)

N = 1000

# Generate latent factors
# QUAL and TRU are exogenous
F_QUAL = np.random.normal(0, 1, N)
F_TRU = np.random.normal(0, 1, N)

# SAT is dependent on QUAL and TRU
# R^2 ~ 0.5
error_SAT = np.random.normal(0, 1, N)
F_SAT = 0.5 * F_QUAL + 0.4 * F_TRU + np.sqrt(1 - (0.5**2 + 0.4**2)) * error_SAT

# LOY is dependent on SAT
# R^2 ~ 0.6
error_LOY = np.random.normal(0, 1, N)
F_LOY = 0.77 * F_SAT + np.sqrt(1 - 0.77**2) * error_LOY

# Function to generate items for a factor
def generate_items(factor, prefix, num_items=5, loading=0.85):
    items = {}
    for i in range(1, num_items + 1):
        # vary loading slightly
        l = loading + np.random.uniform(-0.05, 0.05)
        error = np.random.normal(0, 1, N)
        val = l * factor + np.sqrt(1 - l**2) * error
        items[f"{prefix}{i}"] = val
    return items

# Generate continuous items
data_dict = {}
data_dict.update(generate_items(F_QUAL, "QUAL", 5, 0.85))
data_dict.update(generate_items(F_TRU, "TRU", 5, 0.85))
data_dict.update(generate_items(F_SAT, "SAT", 5, 0.85))
data_dict.update(generate_items(F_LOY, "LOY", 5, 0.85))

df_cont = pd.DataFrame(data_dict)

# Discretize to 1-7 Likert scale
def to_likert(x):
    # Map from standard normal to 1-7
    # Mean = 4, SD = 1.5
    val = x * 1.5 + 4.5
    val = np.round(val)
    val = np.clip(val, 1, 7)
    return val.astype(int)

df_likert = df_cont.apply(to_likert)

# Add demographic variables
df_likert['GENDER'] = np.random.choice(['Male', 'Female'], N, p=[0.45, 0.55])
df_likert['AGE'] = np.random.choice(['18-25', '26-35', '36-45', '46+'], N, p=[0.2, 0.4, 0.3, 0.1])
df_likert['EXPERIENCE'] = np.random.choice(['< 1 year', '1-3 years', '3-5 years', '> 5 years'], N, p=[0.1, 0.3, 0.4, 0.2])

# Save to CSV
df_likert.to_csv('public/data/ncsstat_sample_1000.csv', index=False)
print("Dataset generated successfully.")
