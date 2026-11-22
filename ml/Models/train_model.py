
import os
import json
import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.normpath(os.path.join(_THIS_DIR, ".."))

_DEFAULT_DATA_PATH = os.path.join(
    _PROJECT_ROOT, "Dataset", "Processed", "processed_crop_data.csv"
)
_DEFAULT_MODEL_PATH = os.path.join(_PROJECT_ROOT, "Models", "trained_model.pkl")
_DEFAULT_LE_PATH = os.path.join(_PROJECT_ROOT, "Models", "label_encoder.pkl")
_DEFAULT_FR_PATH = os.path.join(_PROJECT_ROOT, "Models", "feature_ranges.json")

FEATURE_NAMES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]


def train_and_save_model(data_path=None, model_path=None, le_path=None, fr_path=None,
                         also_save_to_backend=True):
    if data_path is None:
        data_path = _DEFAULT_DATA_PATH
    if model_path is None:
        model_path = _DEFAULT_MODEL_PATH
    if le_path is None:
        le_path = _DEFAULT_LE_PATH
    if fr_path is None:
        fr_path = _DEFAULT_FR_PATH

    # --- Load Data ---
    print(f"Processed dataset loading from: {data_path}")
    df = pd.read_csv(data_path)
    print(f"Shape before dedup: {df.shape}")

    # Drop duplicate rows BEFORE splitting to prevent data leakage
    df = df.drop_duplicates()
    print(f"Shape after dedup:  {df.shape}")
    print(df.head())

    # --- Feature & Target Setup ---
    X = df[FEATURE_NAMES]
    y = df["label"]
    print(f"\nFeatures (X) shape: {X.shape}")
    print(f"Target (y) shape: {y.shape}")
    print("\nFirst few label values (before encoding):")
    print(y.head(10))

    # --- Label Encoding ---
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    mapping = dict(zip(le.classes_, le.transform(le.classes_)))
    print("\nLabel encoding mapping:")
    print(mapping)

    # --- Train / Test Split (stratified) ---
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    print(f"\nTraining set size: {X_train.shape[0]}")
    print(f"Test set size:     {X_test.shape[0]}")

    # --- Export Feature Ranges (from training set only, no leakage) ---
    feature_ranges = {}
    for feat in FEATURE_NAMES:
        feature_ranges[feat] = {
            "min": float(X_train[feat].min()),
            "max": float(X_train[feat].max()),
        }
    print("\nFeature ranges (from X_train):")
    for feat, r in feature_ranges.items():
        print(f"  {feat}: [{r['min']:.4f}, {r['max']:.4f}]")

    # --- Regularized Model Training (prevents memorization / overfitting) ---
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=3,
        max_features="sqrt",
        random_state=42,
    )
    model.fit(X_train, y_train)
    print("\nModel training complete.")

    # --- Evaluation ---
    y_train_pred = model.predict(X_train)
    y_pred = model.predict(X_test)
    train_acc = accuracy_score(y_train, y_train_pred)
    test_acc = accuracy_score(y_test, y_pred)
    print(f"\nTraining Accuracy: {train_acc:.6f}")
    print(f"Test Accuracy:     {test_acc:.6f}")
    gap = train_acc - test_acc
    print(f"Overfitting gap:   {gap:.6f}  ({'LOW — good!' if gap < 0.05 else 'HIGH — still overfitting'})")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=le.classes_))

    # --- Confusion Matrix ---
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(16, 12))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=le.classes_,
        yticklabels=le.classes_,
    )
    plt.title("Confusion Matrix — Regularized Random Forest Crop Recommendation")
    plt.xlabel("Predicted Label")
    plt.ylabel("True Label")
    plt.xticks(rotation=90)
    plt.yticks(rotation=0)
    plt.tight_layout()
    plt.show()

    # --- Feature Importance ---
    importances = model.feature_importances_
    print("\nFeature Importances:")
    for fname, imp in zip(FEATURE_NAMES, importances):
        print(f"  {fname}: {imp:.4f}")

    plt.figure(figsize=(8, 5))
    plt.barh(FEATURE_NAMES, importances)
    plt.xlabel("Importance")
    plt.title("Feature Importances — Regularized Random Forest")
    plt.tight_layout()
    plt.show()

    # --- Save Model & Encoder to ml/Models/ ---
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    joblib.dump(le, le_path)
    with open(fr_path, "w") as f:
        json.dump(feature_ranges, f, indent=2)
    print(f"\nModel saved to:          {model_path}")
    print(f"Label encoder saved to:  {le_path}")
    print(f"Feature ranges saved to: {fr_path}")

    # --- Also copy artifacts to backend/models/ so the backend is self-contained ---
    if also_save_to_backend:
        backend_models_dir = os.path.normpath(
            os.path.join(_PROJECT_ROOT, "..", "backend", "models")
        )
        os.makedirs(backend_models_dir, exist_ok=True)
        backend_model_path = os.path.join(backend_models_dir, "trained_model.pkl")
        backend_le_path    = os.path.join(backend_models_dir, "label_encoder.pkl")
        backend_fr_path    = os.path.join(backend_models_dir, "feature_ranges.json")
        joblib.dump(model, backend_model_path)
        joblib.dump(le, backend_le_path)
        with open(backend_fr_path, "w") as f:
            json.dump(feature_ranges, f, indent=2)
        print(f"\n[backend/models/] trained_model.pkl  → {backend_model_path}")
        print(f"[backend/models/] label_encoder.pkl  → {backend_le_path}")
        print(f"[backend/models/] feature_ranges.json → {backend_fr_path}")

    return model, le, FEATURE_NAMES, feature_ranges


def load_model(model_path=None, le_path=None):

    if model_path is None:
        model_path = _DEFAULT_MODEL_PATH
    if le_path is None:
        le_path = _DEFAULT_LE_PATH

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model file not found: {model_path}\n"
            "Please run train_model.py first to generate the .pkl files."
        )
    if not os.path.exists(le_path):
        raise FileNotFoundError(
            f"Label encoder file not found: {le_path}\n"
            "Please run train_model.py first to generate the .pkl files."
        )

    model = joblib.load(model_path)
    le = joblib.load(le_path)
    print(f"Model loaded from:         {model_path}")
    print(f"Label encoder loaded from: {le_path}")
    return model, le, FEATURE_NAMES


def predict_crop(model, le, N, P, K, temperature, humidity, ph, rainfall):

    input_data = pd.DataFrame(
        [[N, P, K, temperature, humidity, ph, rainfall]],
        columns=FEATURE_NAMES,
    )
    prediction_encoded = model.predict(input_data)[0]
    crop = le.inverse_transform([prediction_encoded])[0]
    return crop


# Standalone execution

if __name__ == "__main__":
    model, le, feature_names, feature_ranges = train_and_save_model()

    # Quick sanity-check prediction
    test_crop = predict_crop(
        model, le,
        N=90, P=42, K=43,
        temperature=20.88,
        humidity=82.00,
        ph=6.50,
        rainfall=202.94,
    )
    print(f"\n[train_model.py] Sample prediction: {test_crop}")
    print("[train_model.py] Done.")
