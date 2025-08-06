# Deployment Guide

## Quick Deployment Checklist

### 1. Prepare Your Code
- [ ] Push your code to GitHub
- [ ] Ensure all environment variables are documented
- [ ] Test locally first

### 2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized domains:
   - `http://localhost:3000` (for testing)
   - Your production domain (after deployment)

### 3. Email Setup
1. Enable 2FA on Gmail
2. Generate app password
3. Note down credentials for environment variables

### 4. Deploy Backend on Render

1. **Create PostgreSQL Database:**
   - Go to Render dashboard
   - Create new PostgreSQL database
   - Note the connection string

2. **Create Web Service:**
   - Connect GitHub repository
   - Select `backend` folder as root directory
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`
   - Add environment variables:
     ```
     SECRET_KEY=your-secret-key-here
     JWT_SECRET_KEY=your-jwt-secret-here
     DATABASE_URL=postgresql-connection-string-from-step-1
     MAIL_SERVER=smtp.gmail.com
     MAIL_PORT=587
     MAIL_USE_TLS=True
     MAIL_USERNAME=your-email@gmail.com
     MAIL_PASSWORD=your-app-password
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     ```

3. **Deploy and test**
   - Note the backend URL (e.g., `https://your-app-backend.onrender.com`)

### 5. Deploy Frontend on Render

1. **Create Static Site:**
   - Connect same GitHub repository
   - Select `frontend` folder as root directory
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Add environment variables:
     ```
     REACT_APP_API_URL=https://your-app-backend.onrender.com/api
     REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
     ```

2. **Deploy and test**

### 6. Update Google OAuth
- Add your production frontend domain to Google OAuth settings
- Test Google login functionality

### 7. Final Testing
- [ ] User registration works
- [ ] User login works
- [ ] Google OAuth works
- [ ] Todo creation sends email
- [ ] All CRUD operations work
- [ ] App works on mobile

## Environment Variables Summary

### Backend (.env)
```
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=jwt-secret-key-here
DATABASE_URL=postgresql://username:password@host:port/database
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure backend allows frontend domain in CORS settings

2. **Google Auth Not Working:**
   - Verify client ID is correct
   - Check authorized origins in Google Console

3. **Email Not Sending:**
   - Verify Gmail app password is correct
   - Check Gmail settings allow less secure apps

4. **Database Connection Issues:**
   - Verify DATABASE_URL format is correct
   - Ensure database is running and accessible

### Logs
- Check Render logs for backend issues
- Use browser dev tools for frontend issues

## Cost Considerations

**Render Free Tier:**
- Backend: Free tier available (sleeps after 15 min of inactivity)
- Database: Free PostgreSQL with 1GB storage
- Frontend: Free static site hosting
- Total: $0/month for small usage

**Upgrading:**
- Backend: $7/month for always-on service
- Database: $7/month for 10GB storage
