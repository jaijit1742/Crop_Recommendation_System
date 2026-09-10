"""
Preprocessing Step 3: Exploratory Data Analysis & Correlation
==============================================================
Performs EDA including distribution plots and correlation heatmap.

Can be run independently:
    python Preprocessing/eda_correlation.py

Or imported and called from main.ipynb:
    from Preprocessing.eda_correlation import run_eda
    run_eda(df)
"""

import os
import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
import seaborn as sns

# Resolve project root regardless of working directory
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.normpath(os.path.join(_THIS_DIR, ".."))
_DEFAULT_DATA_PATH = os.path.join(_PROJECT_ROOT, "Dataset", "Raw", "Crop_recommendation.csv")


def run_eda(df=None, data_path=None, show_plots=True):
    """
    Perform exploratory data analysis and correlation analysis.

    Parameters
    ----------
    df : pd.DataFrame, optional
        Pre-processed DataFrame (duplicates removed, missing values filled).
        If None, the raw CSV is loaded and preprocessing is applied first.
    data_path : str, optional
        Path to raw CSV (used only when df is None).
    show_plots : bool
        If True (default), display plots interactively. Set to False when
        running in non-interactive environments.

    Returns
    -------
    None
    """
    # Load & preprocess if no DataFrame supplied
    if df is None:
        if data_path is None:
            data_path = _DEFAULT_DATA_PATH
        print(f"Loading raw dataset from: {data_path}")
        df = pd.read_csv(data_path)
        df = df.drop_duplicates()
        num_cols = df.select_dtypes(include="number").columns
        for col in num_cols:
            df[col] = df[col].fillna(df[col].median())

    eda_df = df.copy()

    print(eda_df.head())

    # --- Statistical Summary ---
    print("\nStatistical Summary:")
    print(eda_df.describe())

    # --- Crop Distribution ---
    plt.figure(figsize=(12, 6))
    eda_df["label"].value_counts().plot(kind="bar")
    plt.title("Crop Distribution")
    plt.xlabel("Crop")
    plt.ylabel("Number of Samples")
    plt.xticks(rotation=90)
    plt.tight_layout()
    if show_plots:
        plt.show()
    else:
        plt.close()

    # --- Feature Distributions ---
    features = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    for feature in features:
        plt.figure(figsize=(6, 4))
        plt.hist(eda_df[feature], bins=20)
        plt.title(f"Distribution of {feature}")
        plt.xlabel(feature)
        plt.ylabel("Frequency")
        plt.tight_layout()
        if show_plots:
            plt.show()
        else:
            plt.close()

    # --- Correlation Matrix ---
    numeric_df = eda_df.select_dtypes(include="number")
    print("\nCorrelation Matrix:")
    print(numeric_df.corr())

    # --- Correlation Heatmap ---
    plt.figure(figsize=(10, 8))
    sns.heatmap(numeric_df.corr(), annot=True, fmt=".2f", cmap="coolwarm")
    plt.title("Correlation Heatmap")
    plt.tight_layout()
    if show_plots:
        plt.show()
    else:
        plt.close()


# ---------------------------------------------------------------------------
# Standalone execution
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    run_eda()
    print("\n[eda_correlation.py] Done.")
