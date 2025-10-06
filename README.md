# � MediBot - AI-Powered Medical Assistant

A sophisticated RAG (Retrieval-Augmented Generation) medical chatbot that provides health information and medical guidance using Google Gemini API and a comprehensive medical knowledge base.

![MediBot](https://img.shields.io/badge/MediBot-AI%20Medical%20Assistant-blue?style=for-the-badge&logo=react)

## ✨ Features

- **🩺 Medical Information**: Get information about symptoms, conditions, and general health advice
- **🤖 AI-Powered**: Uses Google Gemini API for intelligent medical information retrieval
- **📚 RAG Technology**: Leverages medical knowledge base for accurate, context-aware responses
- **💬 Chat History**: Keep track of all your medical consultations
- **🎨 Beautiful UI**: Modern, responsive design with medical-themed interface
- **⚡ Real-time Processing**: Instant responses with loading states
- **🚨 Emergency Information**: Quick access to emergency contacts and procedures
- **💡 Health Tips**: Curated wellness and health maintenance tips
- **⚠️ Safety First**: Built-in disclaimers and emergency guidance

## � Medical Information Categories

1. **General Symptoms** - Common health issues like fever, headaches, colds
2. **Emergency Situations** - Critical symptoms requiring immediate attention
3. **Mental Health** - Depression, anxiety, stress management
4. **Digestive Health** - Stomach issues, digestive problems
5. **Respiratory Health** - Breathing problems, lung health
6. **Cardiovascular** - Heart-related concerns and symptoms
7. **Skin Conditions** - Rashes, allergic reactions, dermatological issues
8. **Musculoskeletal** - Joint pain, muscle problems, back pain
9. **Preventive Care** - Health maintenance and prevention tips
10. **Wellness Tips** - General health and lifestyle advice

**⚠️ Important Disclaimer**: MediBot provides general medical information only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult healthcare professionals for medical concerns.

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Medibot
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cd ../backend
   # Create .env file
   echo GEMINI_API_KEY=your_api_key_here > .env
   ```

5. **Add your logo (optional)**
   - Place your logo image as `logo.png` in `frontend/public/` folder

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   node index.js
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser**
   Navigate to `http://localhost:3000` to use MediBot

## 🛠️ Usage

1. **Ask medical questions** in the chat interface
2. **Get AI-powered responses** based on medical knowledge base
3. **Access health tips** in the dedicated tips section
4. **Find emergency contacts** in the emergency tab
5. **Review chat history** for previous consultations

**Remember**: Always consult healthcare professionals for serious medical concerns!

## 📁 Project Structure

```
Medibot/
├── backend/
│   ├── index.js          # Express server with medical RAG logic
│   ├── package.json      # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── MediBot.jsx    # Main medical chat UI
│   │   ├── api.js             # API utilities
│   │   └── App.jsx            # App entry point
│   ├── public/
│   │   └── index.html         # HTML template
│   └── package.json           # Frontend dependencies
├── dataset/                   # Medical knowledge base
│   ├── general_symptoms.csv   # Common symptoms and advice
│   ├── emergency_symptoms.csv # Emergency situations
│   └── mental_health.csv      # Mental health information
└── README.md                  # This file
```

## 🔧 Technical Details

### Backend (Node.js + Express)
- **Framework**: Express.js
- **AI Integration**: Google Gemini API
- **RAG Implementation**: Medical knowledge base retrieval
- **CORS**: Enabled for frontend communication
- **Data Processing**: CSV parsing for medical dataset loading
- **Safety Features**: Built-in disclaimers and emergency guidance

### Frontend (React)
- **Framework**: React 18
- **Styling**: Inline styles with medical theme
- **State Management**: React hooks
- **API Communication**: Fetch API
- **Responsive Design**: Mobile-friendly medical interface
- **Features**: Chat, Health Tips, Emergency Contacts tabs

### Medical Dataset
- **Format**: CSV files with medical information
- **Structure**: Symptom → Condition → Medical Advice
- **Categories**: General, Emergency, Mental Health
- **Safety**: Includes emergency protocols and disclaimers

## 🔑 API Configuration

### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to `backend/.env`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## 🎨 Customization

### Changing the Theme
The app uses a medical blue theme. To customize:
- Edit colors in `frontend/src/components/MediBot.jsx`
- Modify the gradient background and accent colors

### Adding Medical Categories
1. Create new CSV files in the `dataset/` folder
2. Follow the format: `symptom,condition,advice`
3. The RAG system will automatically load new datasets

### Expanding the Knowledge Base
- Add more medical information to existing CSV files
- Ensure all advice includes appropriate disclaimers
- Consider adding specialist medical categories

### API Customization
- Add new endpoints in `backend/index.js`
- Extend the medical consultation logic
- Implement user authentication if needed

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
- Check if all dependencies are installed: `npm install`
- Verify your `.env` file exists with the API key
- Ensure port 5000 is not in use

**Frontend shows "Failed to process"**
- Make sure the backend is running on port 5000
- Check if your Gemini API key is valid
- Verify the medical dataset files are in the correct location

**Medical advice seems inappropriate**
- Check that dataset files contain proper disclaimers
- Verify the AI prompts include safety guidelines
- Ensure emergency situations are properly flagged

**Emergency information not showing**
- Check the emergency contacts endpoint
- Verify the emergency CSV dataset is loaded
- Ensure the emergency tab is properly configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- React team for the amazing framework
- Medical professionals for guidance on safety protocols
- The open-source community for inspiration

---

**Made with ❤️ and 🏥 by [Your Name]**

*Empowering healthcare information with AI technology!*

## ⚠️ Medical Disclaimer

MediBot is designed to provide general medical information and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read through MediBot.

In case of a medical emergency, call your local emergency number immediately. 