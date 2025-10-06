# MediBot Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 14 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

- **Google Gemini API Key**
  - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Step-by-Step Installation

### 1. Clone or Download the Project
```bash
git clone <your-repository-url>
cd Medibot
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env file and add your Gemini API key
# GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 4. Start the Application

#### Start Backend Server (Terminal 1)
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

#### Start Frontend Development Server (Terminal 2)
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### 5. Access the Application
Open your web browser and navigate to `http://localhost:3000`

## Troubleshooting

### Common Issues

**Port already in use:**
- Kill the process using the port: `npx kill-port 5000` or `npx kill-port 3000`
- Or change the port in the configuration

**Module not found errors:**
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

**API key issues:**
- Ensure your `.env` file is in the backend directory
- Check that your Gemini API key is valid
- Restart the backend server after changing the API key

## Production Deployment

### Backend Deployment
1. Set production environment variables
2. Use a process manager like PM2
3. Configure reverse proxy (nginx)
4. Enable HTTPS

### Frontend Deployment
1. Build the production version: `npm run build`
2. Serve static files through a web server
3. Configure routing for single-page application

## Security Considerations

1. Never expose your API keys in frontend code
2. Implement rate limiting for API endpoints
3. Add input validation and sanitization
4. Use HTTPS in production
5. Implement proper error handling

## Need Help?

If you encounter any issues:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure API keys are correctly configured
4. Check the troubleshooting section above
