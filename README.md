# To-Do App - Full Stack Application

A complete To-Do application with authentication, built with Flask (Python) backend and React (TypeScript) frontend.
Preview:- https://todo-app-frontend-0mxs.onrender.com

## Features


- ✅ User authentication (Login/Register)
- ✅ Google OAuth integration
- ✅ JWT token-based authentication
- ✅ Create, read, update, delete to-dos
- ✅ Email notifications when to-dos are created
- ✅ PostgreSQL database
- ✅ Responsive design
- ✅ Ready for deployment on Render

## Tech Stack

**Backend:**
- Python Flask
- PostgreSQL
- JWT authentication
- Google OAuth 2.0
- Flask-Mail for email notifications

**Frontend:**
- React with TypeScript
- React Router for navigation
- Axios for API calls
- Google Sign-In integration

## Local Development Setup

### Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL (or use SQLite for development)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Setup environment variables:
Copy `.env` file and update the values:
```bash
cp .env.example .env
```

Required environment variables:
- `SECRET_KEY`: Flask secret key
- `JWT_SECRET_KEY`: JWT signing key
- `DATABASE_URL`: PostgreSQL connection string
- `MAIL_USERNAME`: Gmail address for sending emails
- `MAIL_PASSWORD`: Gmail app password
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

5. Run the Flask application:
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
Create `.env` file:
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

4. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Add your domain to authorized origins:
   - For local development: `http://localhost:3000`
   - For production: your deployed domain
6. Copy the Client ID to your environment variables

## Email Configuration

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password for your account
3. Use your Gmail address as `MAIL_USERNAME`
4. Use the generated app password as `MAIL_PASSWORD`

## Database Setup

### For Local Development (SQLite)
The app will automatically create a SQLite database if no PostgreSQL URL is provided.

### For Production (PostgreSQL)
1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your environment variables:
```
DATABASE_URL=postgresql://username:password@host:port/database
```

## Deployment on Render

### Backend Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Environment**: `Python 3`

4. Add environment variables in Render dashboard:
   - `SECRET_KEY`
   - `JWT_SECRET_KEY`
   - `DATABASE_URL` (Render PostgreSQL)
   - `MAIL_USERNAME`
   - `MAIL_PASSWORD`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### Database Setup on Render

1. Create a PostgreSQL database on Render
2. Copy the connection string to `DATABASE_URL`

### Frontend Deployment

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set the following:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add environment variables:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com/api`)
   - `REACT_APP_GOOGLE_CLIENT_ID`: Your Google OAuth client ID

### Post-Deployment

1. Update Google OAuth settings to include your production domains
2. Test all functionality including:
   - User registration/login
   - Google OAuth login
   - To-Do CRUD operations
   - Email notifications

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

### To-Dos
- `GET /api/todos` - Get all to-dos for user
- `POST /api/todos` - Create new to-do
- `PUT /api/todos/:id` - Update to-do
- `DELETE /api/todos/:id` - Delete to-do

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
