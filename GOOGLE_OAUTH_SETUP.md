# Google OAuth Setup Instructions

## After Getting Your Google Credentials

### 1. Update Frontend Environment File
File: `frontend\.env`

Replace `REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
```

### 2. Update Backend Environment File
File: `backend\.env`

Replace both placeholders with your actual Google credentials:

```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=dev-secret-key-12345
JWT_SECRET_KEY=jwt-secret-key-67890
DATABASE_URL=sqlite:///todoapp.db
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=demo@gmail.com
MAIL_PASSWORD=demo-password
GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_actual_client_secret_here
```

### 3. Example of What Your Credentials Look Like

**Client ID (for frontend):**
```
1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

**Client Secret (for backend only):**
```
GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz
```

### 4. Test Google Authentication

After updating both files:

1. Restart both servers:
   ```bash
   # Stop both servers (Ctrl+C)
   # Restart backend:
   cd C:\Users\Admin\todo-app\backend
   venv\Scripts\activate
   python app.py
   
   # Restart frontend (new window):
   cd C:\Users\Admin\todo-app\frontend
   npm start
   ```

2. Open http://localhost:3000/login

3. Click "Sign in with Google" button

4. You should see Google's login popup

## Security Notes

- Never share your Client Secret publicly
- The Client ID can be public (it's in your frontend code)
- For production, add your production domain to authorized origins

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure you added `http://localhost:3000` to authorized JavaScript origins
- Make sure you added `http://localhost:3000` to authorized redirect URIs

### Error: "Invalid client"
- Double-check your Client ID is correctly copied
- Make sure there are no extra spaces

### Google button doesn't appear
- Check browser console for errors
- Verify Client ID is set in frontend/.env
- Make sure you restarted the frontend server after updating .env
