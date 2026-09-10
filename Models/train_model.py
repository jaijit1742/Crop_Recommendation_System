
import os
import joblib
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# ---------------------------------------------------------------------------
# Path resolution — works whether run from Models/ or imported from project root
# ---------------------------------------------------------------------------
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.normpath(os.path.join(_THIS_DIR, ".."))

_DEFAULT_DATA_PATH = os.path.join(
    _PROJECT_ROOT, "Dataset", "Processed", "processed_crop_data.csv"
)
_DEFAULT_MODEL_PATH = os.path.join(_PROJECT_ROOT, "Models", "trained_model.pkl")
_DEFAULT_LE_PATH = os.path.join(_PROJECT_ROOT, "Models", "label_encoder.pkl")

FEATURE_NAMES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def train_and_save_model(data_path=None, model_path=None, le_path=None):
    """
    Train a Random Forest classifier on the processed crop dataset and save it.

    Parameters
    ----------
    data_path : str, optional
        Path to processed CSV. Defaults to Dataset/Processed/processed_crop_data.csv.
    model_path : str, optional
        Where to save the trained model .pkl. Defaults to Models/trained_model.pkl.
    le_path : str, optional
        Where to save the label encoder .pkl. Defaults to Models/label_encoder.pkl.

    Returns
    -------
    tuple
        (model, label_encoder, feature_names)
    """
    if data_path is None:
        data_path = _DEFAULT_DATA_PATH
    if model_path is None:
        model_path = _DEFAULT_MODEL_PATH
    if le_path is None:
        le_path = _DEFAULT_LE_PATH

    # --- Load Data ---
    print(f"Processed dataset loading from: {data_path}")
    df = pd.read_csv(data_path)
    print(f"Shape: {df.shape}")
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

    # --- Train / Test Split ---
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    print(f"\nTraining set size: {X_train.shape[0]}")
    print(f"Test set size:     {X_test.shape[0]}")

    # --- Model Training ---
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)
    print("\nModel training complete.")

    # --- Evaluation ---
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nAccuracy: {accuracy:.6f}")
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
    plt.title("Confusion Matrix - Random Forest Crop Recommendation")
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
    plt.title("Feature Importances - Random Forest")
    plt.tight_layout()
    plt.show()

    # --- Save Model & Encoder ---
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    joblib.dump(le, le_path)
    print(f"\nModel saved to:         {model_path}")
    print(f"Label encoder saved to: {le_path}")

    return model, le, FEATURE_NAMES


def load_model(model_path=None, le_path=None):
    """
    Load a previously trained model and label encoder from disk.

    Parameters
    ----------
    model_path : str, optional
        Path to trained_model.pkl. Defaults to Models/trained_model.pkl.
    le_path : str, optional
        Path to label_encoder.pkl. Defaults to Models/label_encoder.pkl.

    Returns
    -------
    tuple
        (model, label_encoder, feature_names)
    """
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
    """
    Predict the recommended crop for a given set of soil/climate parameters.

    Parameters
    ----------
    model : sklearn estimator
        Trained Random Forest model.
    le : LabelEncoder
        Fitted label encoder.
    N, P, K : float
        Nitrogen, Phosphorus, Potassium content in soil.
    temperature : float
        Temperature in degrees Celsius.
    humidity : float
        Relative humidity in %.
    ph : float
        Soil pH value.
    rainfall : float
        Annual rainfall in mm.

    Returns
    -------
    str
        Predicted crop name.
    """
    import numpy as np

    input_data = pd.DataFrame(
        [[N, P, K, temperature, humidity, ph, rainfall]],
        columns=FEATURE_NAMES,
    )
    prediction_encoded = model.predict(input_data)[0]
    crop = le.inverse_transform([prediction_encoded])[0]
    return crop


# ---------------------------------------------------------------------------
# Standalone execution — trains and saves the model
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    model, le, feature_names = train_and_save_model()

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
