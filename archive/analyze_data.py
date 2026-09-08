import pandas as pd
import numpy as np
import json
import sys

try:
    df = pd.read_csv('public/sample-data/cronbach-sample.csv')

    report = {}

    # Descriptive
    desc = df.describe().T
    desc['variance'] = df.var()
    desc['skewness'] = df.skew()
    desc['kurtosis'] = df.kurtosis()

    report['descriptive'] = desc.to_dict(orient='index')

    # Correlation
    corr = df.corr()
    report['correlation'] = corr.to_dict(orient='index')

    # Cronbach's Alpha
    def cronbach_alpha(df):
        df_corr = df.corr()
        N = df.shape[1]
        rs = []
        for i, col in enumerate(df_corr.columns):
            sum_ = df_corr[col][i+1:].values
            rs.extend(sum_)
        mean_r = np.mean(rs)
        cronbach_alpha = (N * mean_r) / (1 + (N - 1) * mean_r)
        return cronbach_alpha

    report['cronbach_alpha'] = cronbach_alpha(df)

    print(json.dumps(report))
except Exception as e:
    print(json.dumps({"error": str(e)}))
