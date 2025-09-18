from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import GlobalAveragePooling2D, Dropout, Dense
from tensorflow.keras.models import Model
from PIL import Image
import numpy as np
import io
import pandas as pd
import os

# ===================== CONFIG =====================
rows, cols = 160, 160
num_classes = 105  # must match training
weights_path = "FCW.h5"
class_names_path = "class_names.txt"
users_csv_path = "users.csv"  # CSV file with user approval status

# ===================== LOAD CLASS NAMES =====================
with open(class_names_path, "r", encoding="utf-8") as f:
    CLASS_NAMES = [line.strip() for line in f.readlines()]

if len(CLASS_NAMES) != num_classes:
    print(f"âš ï¸ Warning: Number of classes in text file ({len(CLASS_NAMES)}) "
    f"does not match num_classes ({num_classes})")

# ===================== LOAD USERS DATA =====================
def load_users_data():
    """Load users data from CSV file"""
    try:
        df = pd.read_csv(users_csv_path)
        # Convert names to lowercase for consistent matching
        df['Name'] = df['Name'].str.lower()
        return df
    except FileNotFoundError:
        print(f"âŒ Warning: {users_csv_path} not found!")
        return pd.DataFrame(columns=['ID', 'Name', 'Status', 'Age'])
    except Exception as e:
        print(f"âŒ Error loading users data: {e}")
        return pd.DataFrame(columns=['ID', 'Name', 'Status', 'Age'])

# Load users data at startup
users_df = load_users_data()
print(f"âœ… Loaded {len(users_df)} users from database")

# ===================== BUILD MODEL =====================
base_model = MobileNetV2(
    input_shape=(rows, cols, 3),
    include_top=False,
    weights='imagenet'
)
base_model.trainable = False
last_layer = base_model.get_layer('out_relu').output

x = GlobalAveragePooling2D()(last_layer)
x = Dropout(0.8)(x)
output = Dense(num_classes, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=output)

# Load pretrained weights
try:
    model.load_weights(weights_path)
    print("âœ… Model weights loaded successfully!")
except Exception as e:
    print(f"âŒ Error loading weights: {e}")

# Compile (optional for inference)
model.compile(
    loss='categorical_crossentropy',
    optimizer=tf.keras.optimizers.Adam(1e-4),
    metrics=['accuracy']
)

# ===================== FLASK APP =====================
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def preprocess_image(image_bytes):
    """Preprocess uploaded image into tensor for prediction."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((rows, cols))
    arr = np.array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)
    return arr

def check_user_status(predicted_name, input_username):
    """Check if user is approved and names match"""
    predicted_name_lower = predicted_name.lower()
    input_username_lower = input_username.lower()
    
    # Find user in database
    user_row = users_df[users_df['Name'] == predicted_name_lower]
    
    if user_row.empty:
        return {
            'is_approved': False,
            'status': 'not_found',
            'message': f'User "{predicted_name}" not found in database'
        }
    
    user_status = user_row.iloc[0]['Status'].lower()
    is_approved = user_status == 'approved'
    
    # Check if names match
    names_match = predicted_name_lower == input_username_lower
    
    return {
        'is_approved': is_approved,
        'names_match': names_match,
        'status': user_status,
        'message': f'User found with status: {user_status}'
    }

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": True,
        "num_classes": num_classes,
        "users_loaded": len(users_df),
        "class_file": class_names_path
    })

@app.route("/verify_face", methods=["POST"])
def verify_face():
    """Complete face verification with approval status check"""
    
    # Check if file and username are provided
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    if "username" not in request.form:
        return jsonify({"error": "No username provided"}), 400
    
    file = request.files["file"]
    input_username = request.form["username"].strip()
    
    if not input_username:
        return jsonify({"error": "Username cannot be empty"}), 400
    
    print(f"Processing verification for username: {input_username}")
    
    try:
        # Process the image
        img_bytes = file.read()
        arr = preprocess_image(img_bytes)
        
        # Get prediction from model
        preds = model.predict(arr)
        class_id = int(np.argmax(preds[0]))
        confidence = float(np.max(preds[0]))
        
        # Get predicted class name
        if class_id < len(CLASS_NAMES):
            predicted_name = CLASS_NAMES[class_id]
        else:
            predicted_name = f"Unknown_Class_{class_id}"
        
        print(f"Face recognition result: {predicted_name} (confidence: {confidence:.3f})")
        
        # Check user status and name matching
        status_check = check_user_status(predicted_name, input_username)
        
        # Determine if authentication is successful
        # All conditions must be met:
        # 1. Confidence above threshold (e.g., 0.5)
        # 2. Names match (predicted vs input)
        # 3. User is approved in database
        
        confidence_threshold = 0.5
        is_confident = confidence >= confidence_threshold
        is_authenticated = (
            is_confident and 
            status_check['names_match'] and 
            status_check['is_approved']
        )
        
        # Determine authentication failure reason
        failure_reason = None
        if not is_confident:
            failure_reason = f"Low confidence: {confidence:.1%}"
        elif not status_check['names_match']:
            failure_reason = f"Name mismatch: recognized as '{predicted_name}', expected '{input_username}'"
        elif not status_check['is_approved']:
            failure_reason = f"User '{predicted_name}' is {status_check['status']} in the system"
        
        response_data = {
            "is_authenticated": is_authenticated,
            "predicted_name": predicted_name,
            "provided_username": input_username,
            "confidence": confidence,
            "user_status": status_check['status'] if not status_check.get('status') == 'not_found' else 'not_found',
            "names_match": status_check['names_match'],
            "is_approved": status_check['is_approved'],
            "message": "Authentication successful" if is_authenticated else failure_reason,
            "details": {
                "confidence_met": is_confident,
                "names_match": status_check['names_match'],
                "user_approved": status_check['is_approved']
            }
        }
        
        print(f"Authentication result: {is_authenticated}")
        print(f"Reason: {response_data['message']}")
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error in face verification: {e}")
        return jsonify({"error": f"Face verification failed: {str(e)}"}), 500

@app.route("/predict", methods=["POST"])
def predict():
    """Simple prediction endpoint (for testing)"""
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files["file"]
    img_bytes = file.read()
    try:
        arr = preprocess_image(img_bytes)
        preds = model.predict(arr)
        class_id = int(np.argmax(preds[0]))
        confidence = float(np.max(preds[0]))
        class_name = CLASS_NAMES[class_id] if class_id < len(CLASS_NAMES) else f"Class_{class_id}"
        return jsonify({
            "class_id": class_id,
            "class_name": class_name,
            "confidence": confidence
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/users", methods=["GET"])
def get_users():
    """Get all users (for debugging)"""
    return jsonify({
        "total_users": len(users_df),
        "approved_users": len(users_df[users_df['Status'].str.lower() == 'approved']),
        "denied_users": len(users_df[users_df['Status'].str.lower() == 'denied']),
        "users": users_df.to_dict('records')[:10]  # Return first 10 users only
    })

@app.route("/reload_users", methods=["POST"])
def reload_users():
    """Reload users data from CSV"""
    global users_df
    users_df = load_users_data()
    return jsonify({
        "message": "Users data reloaded",
        "total_users": len(users_df)
    })

# Run server
if __name__ == "__main__":
    print("ðŸš€ Starting VocalIQ Face Recognition Server...")
    print(f"ðŸ“Š Model classes: {num_classes}")
    print(f"ðŸ‘¥ Users loaded: {len(users_df)}")
    print(f"âœ… Server ready at http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)