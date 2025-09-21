# AI-Powered Personalized Trip Planner

An intelligent trip planning application that creates personalized travel itineraries based on user preferences, budget, and real-time conditions.

## Features

- 🎯 Personalized itinerary generation based on user preferences
- 💰 Budget optimization and cost breakdown
- 🏨 Hotel and activity recommendations
- 🚗 Transportation planning
- 🌦️ Real-time weather and condition updates
- 📱 Multi-language support
- 🔄 Real-time collaboration and sharing
- 💳 Integrated booking system

## Tech Stack

### Frontend
- React.js
- Streamlit UI
- Tailwind CSS
- shadcn/ui
- Google Maps API

### Backend
- FastAPI
- Python 3.9+
- Firebase (Authentication, Firestore)
- Google Cloud Vertex AI (Gemini)
- Google Cloud Functions

### Database
- Firestore (NoSQL)
- BigQuery (Analytics)

### DevOps
- Docker
- GitHub Actions
- Google Cloud Run

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- Docker (optional)
- Google Cloud SDK (for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-trip-planner.git
   cd ai-trip-planner
   ```

2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Add your API keys and configurations

5. Run the development servers:
   - Backend: `uvicorn main:app --reload`
   - Frontend: `npm run dev`

## Project Structure

```
ai-trip-planner/
├── backend/               # FastAPI backend
│   ├── app/               # Main application package
│   │   ├── api/           # API routes
│   │   ├── core/          # Core functionality
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── tests/             # Backend tests
│   ├── main.py            # FastAPI application entry point
│   └── requirements.txt   # Python dependencies
│
├── frontend/              # React frontend
│   ├── public/            # Static files
│   └── src/               # Source code
│       ├── components/    # Reusable components
│       ├── pages/         # Page components
│       ├── services/      # API services
│       ├── store/         # State management
│       └── styles/        # Global styles
│
├── docs/                  # Documentation
└── docker-compose.yml     # Docker configuration
```

## Environment Variables

### Backend (`.env`)
```
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
FIREBASE_CREDENTIALS=path/to/firebase-credentials.json
OPENAI_API_KEY=your_openai_api_key
```

### Frontend (`.env.local`)
```
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Deployment

### Prerequisites
- Google Cloud account
- Firebase project
- Domain (optional)

### Steps
1. Set up Google Cloud project and enable required APIs
2. Deploy backend to Cloud Run:
   ```bash
   gcloud run deploy ai-trip-planner-backend --source .
   ```
3. Deploy frontend to Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - your.email@example.com

Project Link: [https://github.com/yourusername/ai-trip-planner](https://github.com/yourusername/ai-trip-planner)
