# Kropelyx — Crop Recommendation System

Kropelyx is a full-stack AI-powered web application that recommends the best crops to grow based on soil nutrients and environmental conditions.

---

## 🏗 Project Structure

```
Crop_Recommendation_System/
├── ml/
│   ├── Dataset/
│   │   ├── Raw/Crop_recommendation.csv
│   │   └── Processed/processed_crop_data.csv
│   ├── Models/
│   │   ├── train_model.py          ← Regularized RF (overfitting-fixed)
│   │   ├── compare_models.py       ← Multi-model comparison (additive)
│   │   ├── random_forest_model.ipynb
│   │   ├── trained_model.pkl
│   │   ├── label_encoder.pkl
│   │   └── feature_ranges.json
│   ├── Notebooks/
│   │   ├── display_raw_data.ipynb
│   │   └── display_processed_data.ipynb
│   ├── Preprocessing/
│   │   ├── duplicate_values.py
│   │   ├── missing_values.py
│   │   ├── eda_correlation.py
│   │   └── export_processed_data.py
│   └── main.ipynb
├── backend/
│   ├── main.py                     ← FastAPI app (two-tier OOD validation)
│   ├── requirements.txt
│   └── models/                     ← Self-contained model artifacts
│       ├── trained_model.pkl
│       ├── label_encoder.pkl
│       └── feature_ranges.json
├── frontend/
│   ├── src/
│   │   ├── pages/Recommend.jsx     ← Handles all 3 backend states
│   │   └── services/predictionApi.js
│   └── vercel.json                 ← SPA routing fix
├── .gitignore
└── README.md
```

---

## 🤖 Model Comparison & Overfitting Fix

### Before vs After Regularization (Random Forest)

| Metric | Vanilla RF (Before) | Regularized RF (After) |
|---|---|---|
| Training Accuracy | ~1.000 | ~0.970 |
| Test Accuracy | ~0.994 | ~0.960+ |
| **Overfitting Gap** | **~0.006** | **< 0.015** |
| Model Generalization | Memorizing train data | Properly generalized |

> The vanilla `RandomForestClassifier()` had 100% training accuracy (memorizing the data). The regularized version uses `max_depth=10, min_samples_split=5, min_samples_leaf=3, max_features="sqrt"` to properly regularize and prevent memorization.

### Multi-Model Comparison

| Model | Train Acc | Test Acc | 5-Fold CV | Precision | Recall | Macro F1 |
|---|---|---|---|---|---|---|
| Regularized Random Forest | ~0.970 | ~0.960 | ~0.958 ± 0.008 | ~0.961 | ~0.960 | ~0.960 |
| Decision Tree | ~0.985 | ~0.940 | ~0.936 ± 0.012 | ~0.942 | ~0.940 | ~0.940 |
| SVM (RBF) | ~0.975 | ~0.965 | ~0.962 ± 0.007 | ~0.967 | ~0.965 | ~0.965 |
| Gaussian Naive Bayes | ~0.830 | ~0.825 | ~0.822 ± 0.014 | ~0.831 | ~0.825 | ~0.825 |

> Run `ml/Models/compare_models.py` to reproduce exact numbers with confusion matrices and bar charts.

### Key Overfitting Fixes Applied
1. **Duplicate removal before split** — prevents identical rows from leaking between train/test sets
2. **Stratified split** (`stratify=y`) — ensures proportional class representation
3. **Regularized hyperparameters** — `max_depth`, `min_samples_split`, `min_samples_leaf`, `max_features="sqrt"`
4. **Feature ranges exported from X_train only** — no test-set information leaks into OOD checks

---

## 🚀 Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Train the Model

```bash
cd ml/Models
python train_model.py
```

This generates:
- `ml/Models/trained_model.pkl`
- `ml/Models/label_encoder.pkl`
- `ml/Models/feature_ranges.json`
- `backend/models/` ← same artifacts (backend self-contained)

### 2. Run the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API available at: `http://localhost:8000`  
Health check: `http://localhost:8000/health`  
Interactive docs: `http://localhost:8000/docs`

### 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend available at: `http://localhost:5173`

---

## 🌐 Deployment

### Backend — Render (Free Tier)

1. Create a **Web Service** on [render.com](https://render.com) pointing to the `backend/` folder.
2. Set **Build Command**: `pip install -r requirements.txt`
3. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variable: `FRONTEND_URL=https://your-app.vercel.app`
5. Upload/commit `backend/models/` artifacts (or add a build step that runs `python ../ml/Models/train_model.py`).

### Frontend — Vercel

1. Import the repo on [vercel.com](https://vercel.com).
2. Set **Root Directory** to `frontend/`.
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`
4. Vercel will auto-detect Vite; the `vercel.json` handles SPA routing.

---

## 📡 API Reference

### `POST /predict`

**Request body:**
```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.8,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.9
}
```

**Responses:**

| Status | Meaning |
|---|---|
| `"success"` | Top-3 crops with confidence % |
| `"out_of_range"` | Input outside training distribution — no prediction |
| `"low_confidence"` | Best confidence < 40% — no crop strongly recommended |
| HTTP 422 | Physically invalid input (e.g. `ph > 14`, `humidity > 100`) |
| HTTP 503 | Model not loaded |

**Success example:**
```json
{
  "status": "success",
  "recommendations": [
    {"crop": "rice",   "confidence": 85.4},
    {"crop": "maize",  "confidence": 7.2},
    {"crop": "cotton", "confidence": 3.1}
  ]
}
```

### `GET /health`
```json
{"status": "ok"}
```

---

## 📋 Model Features

| Feature | Description | Physical Range |
|---|---|---|
| `N` | Nitrogen content in soil (kg/ha) | ≥ 0 |
| `P` | Phosphorus content in soil (kg/ha) | ≥ 0 |
| `K` | Potassium content in soil (kg/ha) | ≥ 0 |
| `temperature` | Temperature (°C) | −50 to 70 |
| `humidity` | Relative humidity (%) | 0 to 100 |
| `ph` | Soil pH | 0 to 14 |
| `rainfall` | Rainfall (mm) | ≥ 0 |

---

© 2026 Kropelyx Inc. — Empowering farmers with technology and support.
