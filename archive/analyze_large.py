import pandas as pd
import numpy as np
import scipy.stats as stats
import json

try:
    df = pd.read_csv('public/data/sample_data_large.csv')
    report = {}
    
    # 1. Constructs Definition
    constructs = {
        'LD': ['LD1', 'LD2', 'LD3', 'LD4', 'LD5'],
        'MT': ['MT1', 'MT2', 'MT3', 'MT4'],
        'JS': ['JS1', 'JS2', 'JS3', 'JS4'],
        'OC': ['OC1', 'OC2', 'OC3', 'OC4'],
        'IP': ['IP1', 'IP2', 'IP3']
    }
    
    # 2. Descriptive Stats for items
    desc = df.describe().T
    report['descriptive'] = desc.to_dict(orient='index')
    
    # 3. Reliability (Cronbach's Alpha) per construct
    alphas = {}
    for name, items in constructs.items():
        sub_df = df[items]
        k = len(items)
        if k > 1:
            var_items = sub_df.var(ddof=1).sum()
            var_total = sub_df.sum(axis=1).var(ddof=1)
            alpha = (k / (k - 1)) * (1 - var_items / var_total)
            alphas[name] = alpha
    report['cronbach_alpha'] = alphas
    
    # 4. Compute Factor Scores (Mean scores)
    factor_scores = pd.DataFrame()
    for name, items in constructs.items():
        factor_scores[name] = df[items].mean(axis=1)
        
    # 5. Factor Correlation Matrix
    f_corr = factor_scores.corr()
    report['factor_correlation'] = f_corr.to_dict(orient='index')
    
    # 6. EFA (PCA on all items)
    all_items = [item for sublist in constructs.values() for item in sublist]
    from sklearn.decomposition import PCA
    from sklearn.preprocessing import StandardScaler
    df_items = df[all_items].dropna()
    scaler = StandardScaler()
    df_scaled = scaler.fit_transform(df_items)
    pca = PCA(n_components=5) # 5 constructs expected
    pca.fit(df_scaled)
    report['pca_variance_ratio'] = pca.explained_variance_ratio_.tolist()
    
    # 7. Structural Model (Path Analysis via Regression)
    # Model: JS ~ LD + MT; OC ~ JS; IP ~ OC + JS
    def run_ols(X_df, y_series):
        # add constant
        X = np.c_[np.ones(X_df.shape[0]), X_df.values]
        y = y_series.values
        # beta = (X^T X)^-1 X^T y
        beta = np.linalg.inv(X.T.dot(X)).dot(X.T).dot(y)
        # r-squared
        y_pred = X.dot(beta)
        ss_res = np.sum((y - y_pred)**2)
        ss_tot = np.sum((y - np.mean(y))**2)
        r2 = 1 - (ss_res / ss_tot)
        
        # p-values (approximate based on standard errors)
        n, k = X.shape
        sigma_sq = ss_res / (n - k)
        var_beta = sigma_sq * np.linalg.inv(X.T.dot(X))
        se_beta = np.sqrt(np.diag(var_beta))
        t_stat = beta / se_beta
        p_values = [2 * (1 - stats.t.cdf(np.abs(t), df=n-k)) for t in t_stat]
        
        return beta, p_values, r2

    paths = {}
    
    # JS ~ LD + MT
    beta1, p1, r2_1 = run_ols(factor_scores[['LD', 'MT']], factor_scores['JS'])
    paths['JS_r2'] = r2_1
    paths['JS_LD_beta'] = beta1[1]
    paths['JS_LD_p'] = p1[1]
    paths['JS_MT_beta'] = beta1[2]
    paths['JS_MT_p'] = p1[2]
    
    # OC ~ JS
    beta2, p2, r2_2 = run_ols(factor_scores[['JS']], factor_scores['OC'])
    paths['OC_r2'] = r2_2
    paths['OC_JS_beta'] = beta2[1]
    paths['OC_JS_p'] = p2[1]
    
    # IP ~ OC + JS
    beta3, p3, r2_3 = run_ols(factor_scores[['OC', 'JS']], factor_scores['IP'])
    paths['IP_r2'] = r2_3
    paths['IP_OC_beta'] = beta3[1]
    paths['IP_OC_p'] = p3[1]
    paths['IP_JS_beta'] = beta3[2]
    paths['IP_JS_p'] = p3[2]
    
    report['path_analysis'] = paths
    
    print(json.dumps(report))
except Exception as e:
    print(json.dumps({"error": str(e)}))
