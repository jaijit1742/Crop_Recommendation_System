import os
import json
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import List, Optional

app = FastAPI(title="Kropelyx API", version="2.0.0")

# ---------------------------------------------------------------------------
# CORS — allow frontend dev server + configurable env var for production
# ---------------------------------------------------------------------------
_frontend_url = os.environ.get("FRONTEND_URL", "")
_origins = ["http://localhost:5173"]
if _frontend_url and _frontend_url not in _origins:
    _origins.append(_frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Paths — all relative to this file so backend/ is self-contained
# ---------------------------------------------------------------------------
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR  = os.path.join(BASE_DIR, "models")
MODEL_PATH  = os.path.join(MODELS_DIR, "trained_model.pkl")
LE_PATH     = os.path.join(MODELS_DIR, "label_encoder.pkl")
FR_PATH     = os.path.join(MODELS_DIR, "feature_ranges.json")

FEATURE_NAMES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

# Globals populated at startup
model           = None
le              = None
feature_ranges  = None   # dict: {feature: {min: float, max: float}}


@app.on_event("startup")
def load_model_artifacts():
    global model, le, feature_ranges
    missing = [p for p in [MODEL_PATH, LE_PATH, FR_PATH] if not os.path.exists(p)]
    if missing:
        print(f"[WARNING] Missing model artifacts: {missing}")
        print("Run  ml/Models/train_model.py  to generate them.")
        return
    try:
        model          = joblib.load(MODEL_PATH)
        le             = joblib.load(LE_PATH)
        with open(FR_PATH) as f:
            feature_ranges = json.load(f)
        print("Model, Label Encoder, and Feature Ranges loaded successfully.")
    except Exception as exc:
        print(f"[ERROR] Loading model artifacts: {exc}")


# ---------------------------------------------------------------------------
# Health endpoint
# ---------------------------------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class CropRequest(BaseModel):
    """
    Tier 1 — Physical sanity validation via Pydantic.
    Values that are physically impossible are rejected with 422.
    """
    N:           float
    P:           float
    K:           float
    temperature: float
    humidity:    float
    ph:          float
    rainfall:    float

    @field_validator("N", "P", "K")
    @classmethod
    def npk_non_negative(cls, v, info):
        if v < 0:
            raise ValueError(f"{info.field_name} must be >= 0 (got {v})")
        return v

    @field_validator("humidity")
    @classmethod
    def humidity_range(cls, v):
        if not (0 <= v <= 100):
            raise ValueError(f"humidity must be between 0 and 100 (got {v})")
        return v

    @field_validator("ph")
    @classmethod
    def ph_range(cls, v):
        if not (0 <= v <= 14):
            raise ValueError(f"ph must be between 0 and 14 (got {v})")
        return v

    @field_validator("rainfall")
    @classmethod
    def rainfall_non_negative(cls, v):
        if v < 0:
            raise ValueError(f"rainfall must be >= 0 (got {v})")
        return v

    @field_validator("temperature")
    @classmethod
    def temperature_range(cls, v):
        if not (-50 <= v <= 70):
            raise ValueError(f"temperature must be between -50 and 70 °C (got {v})")
        return v


class CropRecommendation(BaseModel):
    crop:       str
    confidence: float   # percentage, e.g. 85.4


class PredictionResponse(BaseModel):
    status:          str                            # "success" | "out_of_range" | "low_confidence"
    recommendations: List[CropRecommendation]
    message:         Optional[str]   = None
    details:         Optional[dict]  = None


# ---------------------------------------------------------------------------
# Predict endpoint
# ---------------------------------------------------------------------------

CONFIDENCE_THRESHOLD = 0.40   # 40 %
TOP_N = 1


@app.post("/predict", response_model=PredictionResponse)
def predict(request: CropRequest):
    if model is None or le is None or feature_ranges is None:
        raise HTTPException(status_code=503, detail="Model artifacts are not loaded.")

    input_values = {
        "N":           request.N,
        "P":           request.P,
        "K":           request.K,
        "temperature": request.temperature,
        "humidity":    request.humidity,
        "ph":          request.ph,
        "rainfall":    request.rainfall,
    }

    # -----------------------------------------------------------------------
    # Tier 2 — OOD check against training feature ranges
    # -----------------------------------------------------------------------
    out_of_range_features = {}
    for feat in FEATURE_NAMES:
        val = input_values[feat]
        lo  = feature_ranges[feat]["min"]
        hi  = feature_ranges[feat]["max"]
        if val < lo or val > hi:
            out_of_range_features[feat] = {
                "value":          val,
                "supported_min":  lo,
                "supported_max":  hi,
            }

    if out_of_range_features:
        return PredictionResponse(
            status="out_of_range",
            recommendations=[],
            message=(
                "One or more input values are outside the range seen during training. "
                "The model cannot make a reliable prediction for these conditions."
            ),
            details={"out_of_range_features": out_of_range_features},
        )

    # -----------------------------------------------------------------------
    # Tier 3 — Model inference with confidence threshold
    # -----------------------------------------------------------------------
    input_df = pd.DataFrame(
        [[input_values[f] for f in FEATURE_NAMES]],
        columns=FEATURE_NAMES,
    )

    try:
        proba   = model.predict_proba(input_df)[0]          # shape: (n_classes,)
        top_idx = np.argsort(proba)[::-1][:TOP_N]           # indices of top-N classes

        top_proba  = proba[top_idx]
        top_labels = le.inverse_transform(top_idx)

        best_confidence = float(top_proba[0])

        if best_confidence < CONFIDENCE_THRESHOLD:
            return PredictionResponse(
                status="low_confidence",
                recommendations=[],
                message=(
                    f"No crop is strongly suited to the given conditions "
                    f"(best confidence: {best_confidence*100:.1f}% < 40%). "
                    "Consider adjusting soil or environmental parameters."
                ),
                details={"best_confidence_pct": round(best_confidence * 100, 2)},
            )

        recommendations = [
            CropRecommendation(
                crop=str(label),
                confidence=round(float(conf) * 100, 2),
            )
            for label, conf in zip(top_labels, top_proba)
        ]

        return PredictionResponse(
            status="success",
            recommendations=recommendations,
        )

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
