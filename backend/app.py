import os
import io
import re
import json
import numpy as np
from PIL import Image, UnidentifiedImageError

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import tensorflow as tf


app = FastAPI(title="Plant Disease Detection API")

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(__file__)

# ---------------- MODEL ----------------
MODEL_CANDIDATES = ["model.keras", "model.h5"]
MODEL_PATH = None
for name in MODEL_CANDIDATES:
    p = os.path.join(BASE_DIR, name)
    if os.path.exists(p):
        MODEL_PATH = p
        break

if MODEL_PATH is None:
    raise FileNotFoundError(
        f"Model not found. Put one of these in backend/: {MODEL_CANDIDATES}"
    )

CLASS_PATH = os.path.join(BASE_DIR, "class_name.json")
REMEDY_PATH = os.path.join(BASE_DIR, "remedies.json")

print("✅ Loading model:", MODEL_PATH)
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

# ---------------- HELPERS ----------------
IMG_SIZE = (224, 224)

def preprocess_image(img: Image.Image) -> np.ndarray:
    """
    If your model already includes preprocessing inside it, keep 0..255 as-is.
    Otherwise you may need scaling/normalization.
    """
    img = img.convert("RGB").resize(IMG_SIZE)
    arr = np.array(img).astype(np.float32)  # 0..255
    return np.expand_dims(arr, axis=0)      # (1,224,224,3)

def normalize_label(s: str) -> str:
    """
    Normalize labels so remedies lookup never fails:
    - trim
    - spaces -> underscores
    - multiple underscores -> single underscore
    """
    s = (s or "").strip()
    s = s.replace(" ", "_")
    s = re.sub(r"_+", "_", s)  # "__" -> "_", "___" -> "_"
    return s

def display_name(label: str) -> str:
    return normalize_label(label).replace("_", " ")

# ---------------- LOAD CLASS NAMES ----------------
with open(CLASS_PATH, "r", encoding="utf-8") as f:
    class_data = json.load(f)

if isinstance(class_data, list):
    CLASS_NAMES = class_data
elif isinstance(class_data, dict):
    # expects {"0":"Tomato_healthy", "1":"...", ...}
    CLASS_NAMES = [class_data[str(i)] for i in range(len(class_data))]
else:
    raise ValueError("class_name.json must be list or dict")

# ---------------- LOAD REMEDIES ----------------
REMEDIES = {}
if os.path.exists(REMEDY_PATH):
    with open(REMEDY_PATH, "r", encoding="utf-8") as f:
        loaded = json.load(f)
        if not isinstance(loaded, dict):
            raise ValueError("remedies.json must be a JSON object (dictionary).")

        # Normalize keys ONCE at load time
        REMEDIES = {normalize_label(k): v for k, v in loaded.items()}

# ---------------- SANITY CHECK ----------------
print("✅ Model output units:", model.output_shape[-1])
print("✅ Class names:", len(CLASS_NAMES))
print("✅ Remedies loaded:", len(REMEDIES))
print("✅ First 8 classes:", CLASS_NAMES[:8])

if model.output_shape[-1] != len(CLASS_NAMES):
    raise ValueError(
        f"Mismatch: model outputs {model.output_shape[-1]} classes, "
        f"but class_name.json has {len(CLASS_NAMES)} classes"
    )

# ---------------- ROUTES ----------------
@app.get("/")
def root():
    return {
        "status": "ok",
        "model_path": os.path.basename(MODEL_PATH),
        "classes": len(CLASS_NAMES),
        "remedies_loaded": len(REMEDIES),
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # ✅ validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload a valid image file.")

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")

    # ✅ safely open image
    try:
        img = Image.open(io.BytesIO(content))
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Invalid image format.")

    x = preprocess_image(img)

    probs = model.predict(x, verbose=0)[0]
    idxs = np.argsort(probs)[::-1]

    top = []
    for i in idxs[:5]:
        i = int(i)
        label = CLASS_NAMES[i]
        top.append({"label": label, "confidence": float(probs[i])})

    best_label = top[0]["label"]
    key = normalize_label(best_label)

    # ✅ Remedy lookup (keys are normalized already)
    remedy = REMEDIES.get(key)

    # ✅ Fallback object so frontend never breaks
    if remedy is None:
        remedy = {
            "title": display_name(best_label),
            "advice": [
                "Advice for this disease is not added in remedies.json yet.",
                "Please consult local agriculture expert for exact spray guidance."
            ],
            "medicine": {
                "chemical": [],
                "organic": [],
                "notes": ["Add this disease entry in remedies.json to show medicine advice."]
            }
        }

    return {
        "best_label": best_label,
        "best_confidence": top[0]["confidence"],
        "top_predictions": top,
        "remedy": remedy,
        "filename": file.filename,
        "bytes": len(content),
    }