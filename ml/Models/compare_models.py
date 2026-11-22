"""
compare_models.py
=================
Standalone script: multi-model comparison & evaluation on the SAME train/test split.

Models compared:
  1. Regularized Random Forest  (same hyperparams as train_model.py)
  2. Decision Tree              (regularized via max_depth)
  3. Support Vector Machine     (RBF kernel)
  4. Gaussian Naive Bayes

Metrics printed per model:
  - Training Accuracy
  - Test Accuracy
  - 5-Fold CV Mean ± Std
  - Precision (macro)
  - Recall (macro)
  - Macro F1-Score

Plots generated:
  - Confusion Matrix for each model
  - Before vs After bar chart showing overfitting reduction in Random Forest
"""

import os
import sys

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.normpath(os.path.join(_THIS_DIR, ".."))
_DATA_PATH = os.path.join(_PROJECT_ROOT, "Dataset", "Processed", "processed_crop_data.csv")

FEATURE_NAMES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]


def run_comparison(data_path=None, cv_folds=5):
    if data_path is None:
        data_path = _DATA_PATH

    # -----------------------------------------------------------------------
    # 1. Load & prepare data (drop duplicates before split)
    # -----------------------------------------------------------------------
    print(f"Loading data from: {data_path}")
    df = pd.read_csv(data_path).drop_duplicates()
    print(f"Dataset shape after dedup: {df.shape}")

    X = df[FEATURE_NAMES]
    y = df["label"]

    le = LabelEncoder()
    y_enc = le.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_enc, test_size=0.2, random_state=42, stratify=y_enc
    )
    print(f"Train / Test split: {X_train.shape[0]} / {X_test.shape[0]} samples\n")

    # -----------------------------------------------------------------------
    # 2. Define models
    # -----------------------------------------------------------------------
    # "Vanilla" RF (no regularization) — used only for Before/After comparison
    rf_vanilla = RandomForestClassifier(random_state=42)

    models = {
        "Regularized Random Forest": RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=3,
            max_features="sqrt",
            random_state=42,
        ),
        "Decision Tree": DecisionTreeClassifier(
            max_depth=12,
            min_samples_split=5,
            min_samples_leaf=3,
            random_state=42,
        ),
        "SVM (RBF)": SVC(kernel="rbf", C=10, gamma="scale", probability=True, random_state=42),
        "Gaussian Naive Bayes": GaussianNB(),
    }

    # -----------------------------------------------------------------------
    # 3. Train, evaluate & collect metrics
    # -----------------------------------------------------------------------
    results = {}

    for name, clf in models.items():
        print(f"{'='*60}")
        print(f"Model: {name}")
        print(f"{'='*60}")

        clf.fit(X_train, y_train)

        y_train_pred = clf.predict(X_train)
        y_test_pred  = clf.predict(X_test)

        train_acc = accuracy_score(y_train, y_train_pred)
        test_acc  = accuracy_score(y_test,  y_test_pred)

        # 5-Fold CV on the FULL (deduplicated) dataset for unbiased estimate
        cv_scores = cross_val_score(clf, X, y_enc, cv=cv_folds, scoring="accuracy")
        cv_mean, cv_std = cv_scores.mean(), cv_scores.std()

        prec   = precision_score(y_test, y_test_pred, average="macro", zero_division=0)
        rec    = recall_score(   y_test, y_test_pred, average="macro", zero_division=0)
        f1     = f1_score(       y_test, y_test_pred, average="macro", zero_division=0)

        results[name] = {
            "Train Accuracy":    train_acc,
            "Test Accuracy":     test_acc,
            "Overfitting Gap":   train_acc - test_acc,
            f"CV-{cv_folds} Mean": cv_mean,
            f"CV-{cv_folds} Std":  cv_std,
            "Precision (macro)": prec,
            "Recall (macro)":    rec,
            "Macro F1":          f1,
        }

        print(f"  Training Accuracy : {train_acc:.4f}")
        print(f"  Test Accuracy     : {test_acc:.4f}")
        print(f"  Overfitting Gap   : {train_acc - test_acc:.4f}")
        print(f"  {cv_folds}-Fold CV         : {cv_mean:.4f} ± {cv_std:.4f}")
        print(f"  Precision (macro) : {prec:.4f}")
        print(f"  Recall (macro)    : {rec:.4f}")
        print(f"  Macro F1-Score    : {f1:.4f}")
        print()

        # Confusion Matrix
        cm = confusion_matrix(y_test, y_test_pred)
        plt.figure(figsize=(16, 12))
        sns.heatmap(
            cm,
            annot=True,
            fmt="d",
            cmap="Blues",
            xticklabels=le.classes_,
            yticklabels=le.classes_,
        )
        plt.title(f"Confusion Matrix — {name}")
        plt.xlabel("Predicted Label")
        plt.ylabel("True Label")
        plt.xticks(rotation=90)
        plt.yticks(rotation=0)
        plt.tight_layout()
        plt.show()

    # -----------------------------------------------------------------------
    # 4. Summary table
    # -----------------------------------------------------------------------
    print("\n" + "="*72)
    print("MODEL COMPARISON SUMMARY")
    print("="*72)
    results_df = pd.DataFrame(results).T
    print(results_df.to_string(float_format="{:.4f}".format))

    # -----------------------------------------------------------------------
    # 5. Before vs After — Random Forest overfitting reduction
    # -----------------------------------------------------------------------
    print("\n" + "="*72)
    print("BEFORE vs AFTER — Random Forest Regularization")
    print("="*72)

    rf_vanilla.fit(X_train, y_train)
    before_train = accuracy_score(y_train, rf_vanilla.predict(X_train))
    before_test  = accuracy_score(y_test,  rf_vanilla.predict(X_test))
    after_train  = results["Regularized Random Forest"]["Train Accuracy"]
    after_test   = results["Regularized Random Forest"]["Test Accuracy"]

    print(f"  Vanilla RF  — Train: {before_train:.4f}  Test: {before_test:.4f}  "
          f"Gap: {before_train - before_test:.4f}")
    print(f"  Regularized — Train: {after_train:.4f}  Test: {after_test:.4f}  "
          f"Gap: {after_train - after_test:.4f}")

    # Bar chart
    labels = ["Vanilla RF\n(Before)", "Regularized RF\n(After)"]
    train_vals = [before_train, after_train]
    test_vals  = [before_test,  after_test]
    x = np.arange(len(labels))
    width = 0.35

    fig, ax = plt.subplots(figsize=(8, 5))
    bars_train = ax.bar(x - width/2, train_vals, width, label="Train Accuracy", color="#4C72B0")
    bars_test  = ax.bar(x + width/2, test_vals,  width, label="Test Accuracy",  color="#55A868")

    ax.set_ylabel("Accuracy")
    ax.set_title("Random Forest — Before vs After Regularization")
    ax.set_xticks(x)
    ax.set_xticklabels(labels)
    ax.set_ylim(0.8, 1.02)
    ax.legend()

    for bar in list(bars_train) + list(bars_test):
        height = bar.get_height()
        ax.annotate(
            f"{height:.4f}",
            xy=(bar.get_x() + bar.get_width() / 2, height),
            xytext=(0, 3),
            textcoords="offset points",
            ha="center",
            va="bottom",
            fontsize=9,
        )

    plt.tight_layout()
    plt.show()

    return results_df


if __name__ == "__main__":
    results_df = run_comparison()
    print("\n[compare_models.py] Done.")
