# AI Face Recognition Project

## Description

A full-stack web application featuring AI-powered face recognition capabilities. Built with React frontend and Flask backend.

## Features

- Face recognition using AI/ML models
- Real-time image processing
- User-friendly web interface
- RESTful API backend
- Generalized Ai Voice Agent

## Project Structure

```
├── frontend/          # React application
│   ├── public/
│   ├── src/
│   └── package.json
├── backend/           # Flask API server
│   ├── face_recognition_backend.py
│   ├── requirements.txt
│   └── other backend files
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.7 or higher)
- pip (Python package manager)
- At least 4GB RAM (for TensorFlow model loading)

## Installation & Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

4. Upgrade pip and install dependencies:
   ```bash
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```

5. Ensure you have the required model files:
   - `FCW.h5` (trained model weights)
   - `class_names.txt` (class names file)
   - `users.csv` (user database)

6. Run the Flask server:
   ```bash
   python face_recognition_backend_tf.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

## Usage

1. Start the backend server (Flask API) on port 5000
2. Start the frontend server (React app) on port 3000
3. Open your browser and navigate to `http://localhost:3000`
4. Upload images for face recognition processing

## Technologies Used

- **Frontend**: React, HTML5, CSS3, JavaScript
- **Backend**: Python, Flask
- **AI/ML**: Face Recognition Libraries
- **Generalized Ai Voice Agent**: elevenlabs

## Demo Video

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Contact

https://www.linkedin.com/in/yousef-abu-nimreh-04781232b/
