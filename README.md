# M3 Assignment – Fullstack App 

## 📖 Project Overview
This project is a simple **full-stack web app** that demonstrates:

- **Frontend**: React (Vite) with Firebase Authentication (Email/Password + Google Auth)
- **Backend**: Node.js + Express running in Docker, deployed on **Cloud Run**
- **Database**: Firestore (per-user data: button click counts)
- **Hosting**: 
  - Frontend → Firebase Hosting  
  - Backend → Google Cloud Run

The app allows users to:
- Sign up / Log in (Firebase Auth)
- Track per-user button clicks (stored in Firestore)
- Call secure backend routes (verified with Firebase Admin)
- Toggle **dark mode** (stored in localStorage)

---

## 🔗 Live URLs
- **Frontend (Firebase Hosting)** → https://m3-project-a730e.web.app/
- **Backend API (Cloud Run)** → https://server-775881363943.northamerica-northeast2.run.app

## 🔑 Environment Variables

This project requires environment variables for both frontend and backend.  
Do **not** commit real keys — only share `.env.example`.

### Frontend (`/frontend/.env`)
Used by Firebase client SDK (safe to expose):
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

### Backend (`/backend/.env`)
Used by Firebase Admin SDK:
- `FIREBASE_API_KEY`
- `GOOGLE_APPLICATION_CREDENTIALS` → path to `serviceAccountKey.json` (serviceAccountKey.json should be downloaded from Firebase Console → Project Settings → Service Accounts, and should be gitIgnored.
- `PORT` (default: `8080`)

## 🚀 Deployment Instructions

This project is deployed with **Firebase Hosting** (frontend) and **Google Cloud Run** (backend).

### 1. Frontend (Firebase Hosting)
1. Install Firebase CLI globally:
   npm install -g firebase-tools
2. Authenticate with Firebase:
   firebase login
  
3. Initialize hosting in the frontend directory (select your Firebase project):
   firebase init hosting
- Choose Use existing project and select your Firebase project

- Set the public directory to dist

- Configure as a single-page app (yes to rewriting all routes to index.html)

- Do not overwrite index.html if prompted

4. Build the frontend:
    
    npm run build

5. Deploy:
    
    firebase deploy --only hosting
    
Your frontend will now be live at:

m3-project-a730e.web.app

m3-project-a730e.firebaseapp.com

2. Backend (Google Cloud Run)
  1.Install the Google Cloud SDK: https://cloud.google.com/sdk/docs/install

  2. Authenticate:

    gcloud auth login
    gcloud config set project <your-project-id>
  4. Build the Docker image:

    docker build -t gcr.io/<your-project-id>/server:latest .

  5. Push the image to Google Container Registry:

    docker push gcr.io/<your-project-id>/server:latest
  6. Deploy to Cloud Run:
    gcloud run deploy server \
          --image gcr.io/<your-project-id>/server:latest \
          --platform managed \
          --region us-central1 \
          --allow-unauthenticated
  
After deployment, you’ll get a public API URL like:

https://server-775881363943.northamerica-northeast2.run.app
