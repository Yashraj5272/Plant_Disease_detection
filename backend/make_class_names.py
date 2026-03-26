import os
import json

DATASET_DIR = os.path.join(os.path.dirname(__file__), "dataset")

# Keras sorts folder names alphabetically for class indices
classes = sorted([
    d for d in os.listdir(DATASET_DIR)
    if os.path.isdir(os.path.join(DATASET_DIR, d))
])

out_path = os.path.join(os.path.dirname(__file__), "class_name.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(classes, f, indent=2)

print("✅ class_name.json created with", len(classes), "classes")
print(classes[:10], "..." if len(classes) > 10 else "")
