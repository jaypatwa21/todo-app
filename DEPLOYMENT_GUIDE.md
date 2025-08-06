# 🚀 Complete Deployment Guide

## Prerequisites (Do These First)

### 1. Install Git (if not already done)
```bash
# Git should now be installed, but if not:
# Download from: https://git-scm.com/download/win
# Or use: winget install Git.Git
```

### 2. Create GitHub Account
- Go to: https://github.com
- Sign up for a free account
- Verify your email

## Step-by-Step Deployment

### Step 1: Push Code to GitHub

1. **Restart PowerShell/VS Code** (to reload Git)

2. **Initialize Git repository:**
```bash
git init
git add .
git commit -m "Initial commit - Todo App"
```

3. **Create GitHub repository:**
   - Go to: https://github.com/new
   - Repository name: `todo-app`
   - Description: `Full-stack Todo app with React and Flask`
   - Keep it Public
   - Don't initialize with README (we already have files)
   - Click "Create repository"

4. **Push to GitHub:**
```bash
# Replace 'yourusername' with your actual GitHub username
git branch -M main
git remote add origin https://github.com/yourusername/todo-app.git
git push -u origin main
```

### Step 2: Deploy Backend on Render

1. **Go to Render:** https://render.com
2. **Sign up** using your GitHub account
3. **Create new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `todo-app` repository
   
4. **Configure Backend Service:**
   - **Name:** `todo-app-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python app.py`

5. **Set Environment Variables:**
   ```
   FLASK_ENV=production
   SECRET_KEY=your-secret-key-12345
   JWT_SECRET_KEY=your-jwt-secret-67890
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-gmail-app-password
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   ```

6. **Create PostgreSQL Database:**
   - Click "New +" → "PostgreSQL"
   - Name: `todo-app-db`
   - Plan: Free
   - Copy the connection string
   - Add to backend environment: `DATABASE_URL=<connection-string>`

### Step 3: Deploy Frontend on Render

1. **Create Static Site:**
   - Click "New +" → "Static Site"
   - Connect same GitHub repository
   
2. **Configure Frontend:**
   - **Name:** `todo-app-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

3. **Set Environment Variables:**
   ```
   REACT_APP_API_URL=https://todo-app-backend.onrender.com/api
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
   ```

### Step 4: Update Google OAuth Settings

1. **Go to Google Cloud Console:** https://console.cloud.google.com
2. **APIs & Services → Credentials**
3. **Edit your OAuth Client**
4. **Add Production URLs:**

   **Authorized JavaScript origins:**
   ```
   https://your-frontend-url.onrender.com
   ```

   **Authorized redirect URIs:**
   ```
   https://your-frontend-url.onrender.com
   https://your-frontend-url.onrender.com/login
   ```

### Step 5: Test Your Deployment

1. **Backend Health Check:**
   - Go to: `https://todo-app-backend.onrender.com/api/health`
   - Should return: `{"status": "healthy", "message": "Todo API is running"}`

2. **Frontend:**
   - Go to: `https://todo-app-frontend.onrender.com`
   - Should show your Todo app login page

3. **Test Features:**
   - ✅ User registration
   - ✅ User login
   - ✅ Google OAuth
   - ✅ Todo CRUD operations
   - ✅ Email notifications

## 🎉 Your App is Live!

**Frontend URL:** `https://todo-app-frontend.onrender.com`
**Backend API:** `https://todo-app-backend.onrender.com`

## Cost: FREE! 🆓

- Backend: Free tier (sleeps after 15 min inactivity)
- Frontend: Free static hosting
- Database: Free PostgreSQL (1GB)

## Next Steps (Optional)

### Custom Domain
- Buy a domain from any provider
- Add CNAME record pointing to your Render URL
- Configure in Render dashboard

### Upgrade to Paid Plan ($7/month)
- Always-on backend (no sleeping)
- Custom domain support
- More database storage

## Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check build logs in Render dashboard
   - Ensure all dependencies are listed correctly

2. **Environment Variables:**
   - Double-check all env vars are set
   - No extra spaces or quotes

3. **Database Connection:**
   - Verify DATABASE_URL is correctly formatted
   - Check database is running

4. **Google OAuth:**
   - Add production URLs to Google Console
   - Wait 5-10 minutes for changes to propagate

## Support

Check logs in Render dashboard for any issues. Most problems are related to environment variables or missing dependencies.

Your Todo app is production-ready! 🚀
