"""
Preprocessing Step 1: Duplicate Value Detection and Removal
============================================================
Loads the raw CSV dataset, identifies and removes duplicate records,
and returns the cleaned DataFrame.

Can be run independently:
    python Preprocessing/duplicate_values.py

Or imported and called from main.ipynb:
    from Preprocessing.duplicate_values import run_duplicate_check
    df = run_duplicate_check()
"""

import os
import pandas as pd

# Resolve project root regardless of working directory
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.normpath(os.path.join(_THIS_DIR, ".."))
_DEFAULT_DATA_PATH = os.path.join(_PROJECT_ROOT, "Dataset", "Raw", "Crop_recommendation.csv")


def run_duplicate_check(df=None, data_path=None):
    """
    Detect and remove duplicate records from the dataset.

    Parameters
    ----------
    df : pd.DataFrame, optional
        If provided, use this DataFrame instead of loading from disk.
    data_path : str, optional
        Path to the raw CSV file. Defaults to Dataset/Raw/Crop_recommendation.csv
        relative to the project root.

    Returns
    -------
    pd.DataFrame
        The cleaned DataFrame with duplicates removed.
    """
    # Load data if not supplied
    if df is None:
        if data_path is None:
            data_path = _DEFAULT_DATA_PATH
        print(f"Loading raw dataset from: {data_path}")
        df = pd.read_csv(data_path)

    print("First few rows of the raw dataset:")
    print(df.head())

    # --- Duplicate Detection ---
    print(f"\nDuplicate records: {df.duplicated().sum()}")

    # --- Remove Duplicates ---
    df = df.drop_duplicates()
    print(f"Records after removing duplicates: {len(df)}")

    # --- Verify ---
    print(f"Duplicate records after removal: {df.duplicated().sum()}")
    print(df.head())

    return df


# ---------------------------------------------------------------------------
# Standalone execution
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    cleaned_df = run_duplicate_check()
    print("\n[duplicate_values.py] Done. Shape:", cleaned_df.shape)
