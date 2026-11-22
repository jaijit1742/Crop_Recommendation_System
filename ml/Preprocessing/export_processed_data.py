import os
import pandas as pd

_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.normpath(os.path.join(_THIS_DIR, ".."))
_DEFAULT_DATA_PATH = os.path.join(_PROJECT_ROOT, "Dataset", "Raw", "Crop_recommendation.csv")
_DEFAULT_OUTPUT_PATH = os.path.join(_PROJECT_ROOT, "Dataset", "Processed", "processed_crop_data.csv")


def run_export(df=None, data_path=None, output_path=None):
   
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


# Standalone execution
if __name__ == "__main__":
    saved_path = run_export()
    print(f"\n[export_processed_data.py] Done. File saved at: {saved_path}")
