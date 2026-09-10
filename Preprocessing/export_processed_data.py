"""
Preprocessing Step 4: Export Processed Data
============================================
Saves the fully pre-processed DataFrame to Dataset/Processed/.

Can be run independently:
    python Preprocessing/export_processed_data.py

Or imported and called from main.ipynb:
    from Preprocessing.export_processed_data import run_export
    output_path = run_export(df)
"""

import os
import pandas as pd

# Resolve project root regardless of working directory
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.normpath(os.path.join(_THIS_DIR, ".."))
_DEFAULT_DATA_PATH = os.path.join(_PROJECT_ROOT, "Dataset", "Raw", "Crop_recommendation.csv")
_DEFAULT_OUTPUT_PATH = os.path.join(_PROJECT_ROOT, "Dataset", "Processed", "processed_crop_data.csv")


def run_export(df=None, data_path=None, output_path=None):
    """
    Export the processed DataFrame to a CSV file.

    Parameters
    ----------
    df : pd.DataFrame, optional
        Pre-processed DataFrame. If None, the raw CSV is loaded and
        the full preprocessing pipeline is applied first.
    data_path : str, optional
        Path to raw CSV (used only when df is None).
    output_path : str, optional
        Destination path for the exported CSV. Defaults to
        Dataset/Processed/processed_crop_data.csv relative to project root.

    Returns
    -------
    str
        Absolute path where the processed CSV was saved.
    """
    if output_path is None:
        output_path = _DEFAULT_OUTPUT_PATH

    # Load & preprocess if no DataFrame supplied
    if df is None:
        if data_path is None:
            data_path = _DEFAULT_DATA_PATH
        print(f"Loading raw dataset from: {data_path}")
        df = pd.read_csv(data_path)

        # Remove duplicates
        df = df.drop_duplicates()

        # Fill missing values with median
        num_cols = df.select_dtypes(include="number").columns
        for col in num_cols:
            df[col] = df[col].fillna(df[col].median())

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Save
    df.to_csv(output_path, index=False)
    print(f"Processed dataset saved to: {output_path}")
    print(f"Final shape: {df.shape}")
    print(df.head())

    return output_path


# ---------------------------------------------------------------------------
# Standalone execution
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    saved_path = run_export()
    print(f"\n[export_processed_data.py] Done. File saved at: {saved_path}")
