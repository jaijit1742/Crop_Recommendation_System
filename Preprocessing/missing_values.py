"""
Preprocessing Step 2: Missing Value Detection and Imputation
=============================================================
Detects and fills missing numerical values using the column median.

Can be run independently:
    python Preprocessing/missing_values.py

Or imported and called from main.ipynb:
    from Preprocessing.missing_values import run_missing_values
    df = run_missing_values(df)
"""

import os
import pandas as pd

# Resolve project root regardless of working directory
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.normpath(os.path.join(_THIS_DIR, ".."))
_DEFAULT_DATA_PATH = os.path.join(_PROJECT_ROOT, "Dataset", "Raw", "Crop_recommendation.csv")


def run_missing_values(df=None, data_path=None):
    """
    Detect missing values and fill numerical columns with their median.

    Parameters
    ----------
    df : pd.DataFrame, optional
        If provided, use this DataFrame (duplicates must already be removed).
        If None, the raw CSV is loaded and duplicates are removed first.
    data_path : str, optional
        Path to the raw CSV file (used only when df is None).

    Returns
    -------
    pd.DataFrame
        DataFrame with missing values filled.
    """
    # Load & deduplicate if no DataFrame supplied
    if df is None:
        if data_path is None:
            data_path = _DEFAULT_DATA_PATH
        print(f"Loading raw dataset from: {data_path}")
        df = pd.read_csv(data_path)
        df = df.drop_duplicates()
        print(f"After removing duplicates: {len(df)} rows")

    # --- Report missing values ---
    print("\nMissing values per column:")
    print(df.isnull().sum())
    print(f"Total missing values: {df.isnull().sum().sum()}")

    # --- Fill missing values ---
    print("\nBefore filling - Missing values per column:")
    print(df.isnull().sum())

    num_cols = df.select_dtypes(include="number").columns
    for col in num_cols:
        df[col] = df[col].fillna(df[col].median())

    print(f"\nTotal missing values after filling: {df.isnull().sum().sum()}")
    print(df.head())

    return df


# ---------------------------------------------------------------------------
# Standalone execution
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    cleaned_df = run_missing_values()
    print("\n[missing_values.py] Done. Shape:", cleaned_df.shape)
