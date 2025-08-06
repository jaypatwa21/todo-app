@echo off
echo Setting up Todo App for local development...

echo.
echo Setting up Backend...
cd backend

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Backend setup complete!
echo Please update the .env file with your configuration before running the app.

echo.
echo Setting up Frontend...
cd ..\frontend

echo Installing Node.js dependencies...
npm install

echo.
echo Frontend setup complete!
echo Please update the .env file with your configuration before running the app.

echo.
echo Setup completed successfully!
echo.
echo To start the backend:
echo   cd backend
echo   venv\Scripts\activate
echo   python app.py
echo.
echo To start the frontend:
echo   cd frontend  
echo   npm start
echo.
echo Don't forget to configure your .env files!

pause
