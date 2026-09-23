import os
import io
import re
import json
import base64
import numpy as np
import cv2
import requests

# Path to local YOLOv8n ONNX model
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "yolov8n.onnx")

COCO_CLASSES = [
    'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
    'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
    'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
    'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle',
    'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange',
    'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed',
    'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven',
    'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
]

# Food & packaging related classes in COCO
COCO_FOOD_MAP = {
    'apple': {'name': 'Apple', 'hindi': 'सेब', 'category': 'Fruits'},
    'banana': {'name': 'Banana', 'hindi': 'केला', 'category': 'Fruits'},
    'orange': {'name': 'Orange', 'hindi': 'संतरा', 'category': 'Fruits'},
    'broccoli': {'name': 'Broccoli', 'hindi': 'ब्रोकली / हरी गोभी', 'category': 'Vegetables'},
    'carrot': {'name': 'Carrot', 'hindi': 'गाजर', 'category': 'Vegetables'},
    'sandwich': {'name': 'Sandwich / Bakery', 'hindi': 'सैंडविच / बेकरी', 'category': 'Processed Food'},
    'pizza': {'name': 'Pizza / Flatbread', 'hindi': 'पिज़्ज़ा / रोटी', 'category': 'Processed Food'},
    'donut': {'name': 'Donut / Sweets', 'hindi': 'मिठाई / डोनट', 'category': 'Confectionery'},
    'cake': {'name': 'Cake / Pastry', 'hindi': 'केक / पेस्ट्री', 'category': 'Bakery'},
    'bottle': {'name': 'Bottled Beverage / Oil', 'hindi': 'बोतलबंद पेय / तेल', 'category': 'Liquid Foods'},
    'bowl': {'name': 'Food Bowl / Dairy', 'hindi': 'खाद्य कटोरी / दही-पनीर', 'category': 'Dairy'},
    'potted plant': {'name': 'Fresh Greens / Herb', 'hindi': 'ताजा साग / जड़ी-बूटी', 'category': 'Vegetables'},
}

# Preload YOLO net
_yolo_net = None

def get_yolo_net():
    global _yolo_net
    if _yolo_net is None and os.path.exists(MODEL_PATH):
        try:
            _yolo_net = cv2.dnn.readNetFromONNX(MODEL_PATH)
            # Prefer OpenCV backend
            _yolo_net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
            _yolo_net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)
        except Exception as e:
            print(f"[YOLO] Error loading ONNX model: {e}")
            _yolo_net = None
    return _yolo_net

def run_yolo_detection(image_bgr: np.ndarray, conf_threshold: float = 0.25):
    """
    Run YOLOv8n ONNX forward pass via OpenCV DNN.
    Returns list of detections: [{'class_name', 'confidence', 'bbox': [x, y, w, h] (normalized 0-100)}]
    """
    net = get_yolo_net()
    if net is None:
        return []

    h_orig, w_orig = image_bgr.shape[:2]
    blob = cv2.dnn.blobFromImage(image_bgr, 1 / 255.0, (640, 640), swapRB=True, crop=False)
    net.setInput(blob)
    preds = net.forward()  # Shape: (1, 84, 8400)

    # Transpose to (8400, 84)
    preds = np.transpose(preds[0])

    boxes = []
    confidences = []
    class_ids = []

    for row in preds:
        classes_scores = row[4:]
        max_score_idx = np.argmax(classes_scores)
        max_score = float(classes_scores[max_score_idx])

        if max_score >= conf_threshold:
            cx, cy, w, h = float(row[0]), float(row[1]), float(row[2]), float(row[3])
            # YOLO output is relative to 640x640
            x = (cx - w / 2) / 640.0
            y = (cy - h / 2) / 640.0
            nw = w / 640.0
            nh = h / 640.0

            boxes.append([x * 100.0, y * 100.0, nw * 100.0, nh * 100.0])
            confidences.append(max_score)
            class_ids.append(int(max_score_idx))

    if not boxes:
        return []

    # Non-maximum suppression
    indices = cv2.dnn.NMSBoxes(
        [[int(b[0]), int(b[1]), int(b[2]), int(b[3])] for b in boxes],
        confidences,
        conf_threshold,
        0.45
    )

    results = []
    if len(indices) > 0:
        for i in indices.flatten():
            cid = class_ids[i]
            cname = COCO_CLASSES[cid] if cid < len(COCO_CLASSES) else f"class_{cid}"
            results.append({
                "class_name": cname,
                "confidence": round(confidences[i] * 100, 1),
                "bbox": boxes[i],
                "is_food": cname in COCO_FOOD_MAP
            })

    # Sort food detections first, then highest confidence
    results.sort(key=lambda x: (x["is_food"], x["confidence"]), reverse=True)
    return results

def fallback_gemini_vision(image_base64: str, api_key: str):
    """
    Multimodal crop & agricultural food recognition via Gemini 3.6 Flash.
    """
    clean_b64 = re.sub(r"^data:image\/[a-zA-Z]+;base64,", "", image_base64)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={api_key}"

    prompt = (
        "Identify the agricultural crop, fruit, vegetable, or food product in this image. "
        "Respond ONLY with a JSON object in this exact schema without any markdown formatting:\n"
        "{\n"
        '  "crop_name": "English name (e.g. Tomato, Mango, Potato, Onion, Rice)",\n'
        '  "hindi_name": "Hindi name in Devanagari (e.g. टमाटर, आम, आलू, प्याज)",\n'
        '  "category": "Fruits / Vegetables / Grains / Spices / Dairy",\n'
        '  "confidence": 95,\n'
        '  "recommended_material": "Best packaging material (e.g. Anti-Fog Micro-Perforated Pouch, Leno Mesh Bag)",\n'
        '  "storage_temp": "Optimal temperature in °C",\n'
        '  "shelf_life_gain": "Expected shelf life (e.g. 14-18 Days)",\n'
        '  "map_gas": "O2: 3-5%, CO2: 3-5%, N2: 90%",\n'
        '  "advice_hindi": "2 short simple sentences in Hindi explaining why this package is best and storage tip for uneducated farmers."\n'
        "}"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": clean_b64
                        }
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 400
        }
    }

    resp = requests.post(url, json=payload, timeout=12)
    if resp.status_code == 200:
        data = resp.json()
        raw_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        # Strip json codeblock wrappers if present
        raw_text = re.sub(r"^```json\s*", "", raw_text.strip())
        raw_text = re.sub(r"```$", "", raw_text.strip())
        return json.loads(raw_text)
    return None
