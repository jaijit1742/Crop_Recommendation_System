

import os
import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
import seaborn as sns

_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.normpath(os.path.join(_THIS_DIR, ".."))
_DEFAULT_DATA_PATH = os.path.join(_PROJECT_ROOT, "Dataset", "Raw", "Crop_recommendation.csv")


def run_eda(df=None, data_path=None, show_plots=True):
    
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

    print("\nStatistical Summary:")
    print(eda_df.describe())

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

    numeric_df = eda_df.select_dtypes(include="number")
    print("\nCorrelation Matrix:")
    print(numeric_df.corr())

    plt.figure(figsize=(10, 8))
    sns.heatmap(numeric_df.corr(), annot=True, fmt=".2f", cmap="coolwarm")
    plt.title("Correlation Heatmap")
    plt.tight_layout()
    if show_plots:
        plt.show()
    else:
        plt.close()


# Standalone execution
if __name__ == "__main__":
    run_eda()
    print("\n[eda_correlation.py] Done.")
