

import os
import pandas as pd

_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.normpath(os.path.join(_THIS_DIR, ".."))
_DEFAULT_DATA_PATH = os.path.join(_PROJECT_ROOT, "Dataset", "Raw", "Crop_recommendation.csv")


def run_duplicate_check(df=None, data_path=None):
    
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


# Standalone execution
if __name__ == "__main__":
    cleaned_df = run_duplicate_check()
    print("\n[duplicate_values.py] Done. Shape:", cleaned_df.shape)
