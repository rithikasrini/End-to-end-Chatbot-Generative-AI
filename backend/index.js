const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Medical dataset for RAG
let medicalDataset = [];

// Load medical knowledge base from CSV files
function loadMedicalDataset() {
    const datasetPath = path.join(__dirname, '..', 'dataset');
    
    try {
        const files = fs.readdirSync(datasetPath);
        const csvFiles = files.filter(file => file.endsWith('.csv'));
        
        csvFiles.forEach(file => {
            const filePath = path.join(datasetPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n').slice(1); // Skip header
            
            lines.forEach(line => {
                if (line.trim()) {
                    const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
                    if (columns.length >= 3) {
                        medicalDataset.push({
                            symptom: columns[0],
                            condition: columns[1],
                            advice: columns[2],
                            category: file.replace('.csv', '')
                        });
                    }
                }
            });
        });
        
        console.log(`Loaded ${medicalDataset.length} medical entries from dataset`);
    } catch (error) {
        console.warn('Dataset not found, using basic medical knowledge');
        // Basic medical knowledge as fallback
        medicalDataset = [
            {
                symptom: "fever, headache, body aches",
                condition: "common cold or flu",
                advice: "Rest, stay hydrated, consider over-the-counter fever reducers. Consult a doctor if symptoms persist beyond 7 days.",
                category: "general"
            },
            {
                symptom: "chest pain, shortness of breath",
                condition: "potential cardiac issue",
                advice: "SEEK IMMEDIATE MEDICAL ATTENTION. Call emergency services if experiencing severe chest pain.",
                category: "emergency"
            }
        ];
    }
}

// Initialize dataset on startup
loadMedicalDataset();

// Function to find relevant medical information from dataset
function findRelevantMedicalInfo(query) {
    const queryLower = query.toLowerCase();
    const relevantEntries = medicalDataset.filter(entry => {
        return entry.symptom.toLowerCase().includes(queryLower) ||
               entry.condition.toLowerCase().includes(queryLower) ||
               queryLower.includes(entry.symptom.toLowerCase()) ||
               queryLower.includes(entry.condition.toLowerCase());
    });
    
    return relevantEntries.slice(0, 5); // Return top 5 relevant entries
}

// Medical consultation endpoint
app.post('/api/medical-consultation', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        // Find relevant medical information from dataset
        const relevantInfo = findRelevantMedicalInfo(message);
        
        // Prepare context for AI
        let context = "You are MediBot, a helpful medical information assistant. ";
        context += "IMPORTANT: You are NOT a replacement for professional medical advice. ";
        context += "Always recommend consulting healthcare professionals for serious concerns. ";
        context += "For emergencies, advise to call emergency services immediately.\n\n";
        
        context += "Response Guidelines:\n";
        context += "- Provide clear, well-structured information\n";
        context += "- Use bullet points or numbered lists when appropriate\n";
        context += "- Include appropriate medical disclaimers\n";
        context += "- Use professional but approachable language\n";
        context += "- Structure your response with clear paragraphs\n";
        context += "- Always emphasize when to seek professional help\n\n";
        
        if (relevantInfo.length > 0) {
            context += "Relevant medical information from knowledge base:\n";
            relevantInfo.forEach((info, index) => {
                context += `${index + 1}. Symptoms: ${info.symptom} | Condition: ${info.condition} | Advice: ${info.advice}\n`;
            });
            context += "\n";
        }
        
        context += "Based on the above information and your medical knowledge, provide helpful, ";
        context += "accurate, and responsible medical information in a well-formatted response. ";
        context += "Structure your answer clearly with proper paragraphs and include appropriate disclaimers. ";
        context += "Use clear, professional language that is easy to understand.";
        
        // Prepare conversation history
        let conversationContext = "";
        if (conversationHistory.length > 0) {
            conversationContext = "\nConversation history:\n";
            conversationHistory.slice(-5).forEach(entry => {
                conversationContext += `User: ${entry.user}\nMediBot: ${entry.bot}\n\n`;
            });
        }
        
        const fullPrompt = `${context}${conversationContext}\nUser question: ${message}\n\nMediBot response:`;
        
        // Generate AI response
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        let aiResponse = response.text();
        
        // Clean and format the response
        aiResponse = aiResponse.trim();
        
        // Ensure proper formatting with line breaks
        aiResponse = aiResponse
            .replace(/\n\n+/g, '\n\n')  // Normalize multiple line breaks
            .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove markdown bold formatting
            .replace(/\*(.*?)\*/g, '$1')  // Remove markdown italic formatting
            .replace(/#{1,6}\s/g, '')  // Remove markdown headers
            .trim();
        
        // Ensure medical disclaimer is included if not present
        if (!aiResponse.toLowerCase().includes('medical professional') && 
            !aiResponse.toLowerCase().includes('healthcare provider') &&
            !aiResponse.toLowerCase().includes('consult') &&
            !aiResponse.toLowerCase().includes('doctor')) {
            aiResponse += '\n\n⚠️ Important: This information is for educational purposes only. Please consult with a healthcare professional for proper medical advice and diagnosis.';
        }
        
        res.json({
            response: aiResponse,
            relevantInfo: relevantInfo,
            timestamp: new Date().toISOString(),
            formatted: true
        });
        
    } catch (error) {
        console.error('Error in medical consultation:', error);
        res.status(500).json({
            error: 'Failed to process medical consultation',
            details: error.message
        });
    }
});

// Health tips endpoint
app.get('/api/health-tips', (req, res) => {
    const healthTips = [
        {
            title: "Stay Hydrated",
            description: "Drink at least 8 glasses of water daily to maintain proper hydration.",
            category: "nutrition"
        },
        {
            title: "Regular Exercise",
            description: "Aim for at least 150 minutes of moderate exercise per week.",
            category: "fitness"
        },
        {
            title: "Adequate Sleep",
            description: "Get 7-9 hours of quality sleep each night for optimal health.",
            category: "wellness"
        },
        {
            title: "Balanced Diet",
            description: "Include fruits, vegetables, whole grains, and lean proteins in your diet.",
            category: "nutrition"
        },
        {
            title: "Mental Health",
            description: "Practice stress management techniques like meditation or deep breathing.",
            category: "mental-health"
        }
    ];
    
    res.json(healthTips);
});

// Emergency contacts endpoint
app.get('/api/emergency-contacts', (req, res) => {
    const emergencyContacts = [
        {
            service: "Emergency Services",
            number: "911",
            description: "For life-threatening emergencies"
        },
        {
            service: "Poison Control",
            number: "1-800-222-1222",
            description: "For poisoning emergencies"
        },
        {
            service: "Mental Health Crisis",
            number: "988",
            description: "Suicide & Crisis Lifeline"
        },
        {
            service: "Non-Emergency Medical",
            number: "311",
            description: "For non-urgent medical questions"
        }
    ];
    
    res.json(emergencyContacts);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'MediBot backend is running',
        timestamp: new Date().toISOString(),
        datasetSize: medicalDataset.length
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: 'Something went wrong on the server'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🏥 MediBot server running on port ${PORT}`);
    console.log(`📊 Loaded ${medicalDataset.length} medical entries`);
});

module.exports = app;
