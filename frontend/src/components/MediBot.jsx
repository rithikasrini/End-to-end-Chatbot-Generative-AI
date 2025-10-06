import React, { useState, useEffect, useRef } from 'react';
import { medicalConsultation, getHealthTips, getEmergencyContacts } from '../api';

const MediBot = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [healthTips, setHealthTips] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadHealthTips();
    loadEmergencyContacts();
    
    // Add welcome message
    setConversation([{
      id: 1,
      user: '',
      bot: "Hello! I'm MediBot, your AI medical information assistant. I can help answer health-related questions and provide general medical information. Please remember that I'm not a substitute for professional medical advice. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString(),
      isWelcome: true
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatBotResponse = (text) => {
    if (!text) return '';
    
    // Format the response for better readability
    return text
      .replace(/\n\n/g, '\n\n')  // Preserve paragraph breaks
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove markdown bold
      .replace(/\*(.*?)\*/g, '$1')  // Remove markdown italic
      .replace(/#{1,6}\s/g, '')  // Remove markdown headers
      .trim();
  };

  const loadHealthTips = async () => {
    try {
      const tips = await getHealthTips();
      setHealthTips(tips);
    } catch (error) {
      console.error('Failed to load health tips:', error);
    }
  };

  const loadEmergencyContacts = async () => {
    try {
      const contacts = await getEmergencyContacts();
      setEmergencyContacts(contacts);
    } catch (error) {
      console.error('Failed to load emergency contacts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    const userMessage = message.trim();
    setMessage('');

    // Add user message to conversation
    const newUserEntry = {
      id: Date.now(),
      user: userMessage,
      bot: '',
      timestamp: new Date().toLocaleTimeString()
    };

    setConversation(prev => [...prev, newUserEntry]);

    try {
      const conversationHistory = conversation.map(entry => ({
        user: entry.user,
        bot: entry.bot
      }));

      const response = await medicalConsultation(userMessage, conversationHistory);
      
      // Add bot response to conversation
      setConversation(prev => prev.map(entry => 
        entry.id === newUserEntry.id 
          ? { ...entry, bot: response.response, relevantInfo: response.relevantInfo }
          : entry
      ));

    } catch (error) {
      setConversation(prev => prev.map(entry => 
        entry.id === newUserEntry.id 
          ? { ...entry, bot: "I apologize, but I'm having trouble processing your request right now. Please try again or consult with a healthcare professional for medical concerns." }
          : entry
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setConversation([{
      id: 1,
      user: '',
      bot: "Hello! I'm MediBot, your AI medical information assistant. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString(),
      isWelcome: true
    }]);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: isDarkMode 
        ? 'linear-gradient(145deg, #1a1d29 0%, #2d3748 100%)'
        : 'linear-gradient(145deg, #f7fafc 0%, #edf2f7 100%)',
      fontFamily: '"Nunito", "Inter", sans-serif',
      padding: '0',
      transition: 'all 0.3s ease'
    },
    header: {
      background: isDarkMode 
        ? 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)'
        : 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
      color: 'white',
      padding: '20px 30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      position: 'relative'
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    logo: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    hospitalIcon: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
      boxShadow: isDarkMode
        ? '0 8px 32px rgba(66, 153, 225, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
        : '0 8px 32px rgba(66, 153, 225, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
      border: isDarkMode ? '1px solid rgba(66, 153, 225, 0.3)' : '1px solid rgba(66, 153, 225, 0.2)'
    },
    hospitalBuilding: {
      fontSize: '2rem',
      background: 'linear-gradient(45deg, #4299e1, #48bb78, #38b2ac)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
      position: 'absolute'
    },
    medicalCross: {
      position: 'absolute',
      bottom: '-2px',
      right: '-2px',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      color: 'white',
      background: 'linear-gradient(135deg, #e53e3e, #c53030)',
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(229, 62, 62, 0.4)',
      border: '2px solid white'
    },
    titleText: {
      fontSize: '2rem',
      fontWeight: '700',
      margin: '0',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      fontFamily: '"Nunito", sans-serif'
    },
    subtitle: {
      fontSize: '0.9rem',
      opacity: '0.9',
      margin: '5px 0 0 0',
      fontWeight: '400'
    },
    darkModeToggle: {
      background: isDarkMode 
        ? 'linear-gradient(45deg, #f093fb, #f5576c)' 
        : 'linear-gradient(45deg, #667eea, #764ba2)',
      border: 'none',
      borderRadius: '50px',
      padding: '12px 24px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    mainContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '30px',
      display: 'grid',
      gridTemplateColumns: '1fr 350px',
      gap: '30px',
      minHeight: 'calc(100vh - 140px)'
    },
    chatSection: {
      background: isDarkMode ? 'rgba(45, 55, 72, 0.4)' : 'white',
      borderRadius: '20px',
      padding: '0',
      boxShadow: isDarkMode 
        ? '0 10px 40px rgba(0,0,0,0.3)' 
        : '0 10px 40px rgba(0,0,0,0.1)',
      border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    chatHeader: {
      background: isDarkMode 
        ? 'linear-gradient(135deg, #4a5568, #2d3748)'
        : 'linear-gradient(135deg, #e2e8f0, #cbd5e0)',
      padding: '20px 25px',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    chatTitle: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: isDarkMode ? '#e2e8f0' : '#2d3748',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    messagesArea: {
      flex: 1,
      padding: '25px',
      overflowY: 'auto',
      maxHeight: '500px',
      background: isDarkMode ? 'rgba(26, 32, 44, 0.5)' : '#f8fafc'
    },
    welcomeMessage: {
      textAlign: 'center',
      padding: '40px 20px',
      color: isDarkMode ? '#a0aec0' : '#4a5568',
      fontSize: '1.1rem',
      lineHeight: '1.6'
    },
    messageGroup: {
      marginBottom: '25px'
    },
    userMessage: {
      background: 'linear-gradient(135deg, #4299e1, #3182ce)',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '25px 25px 5px 25px',
      marginLeft: 'auto',
      marginRight: '0',
      maxWidth: '75%',
      wordWrap: 'break-word',
      marginBottom: '8px',
      boxShadow: '0 4px 15px rgba(66, 153, 225, 0.3)',
      fontSize: '1rem',
      lineHeight: '1.5'
    },
    botMessage: {
      background: isDarkMode ? 'rgba(74, 85, 104, 0.8)' : 'white',
      color: isDarkMode ? '#e2e8f0' : '#2d3748',
      padding: '18px 22px',
      borderRadius: '25px 25px 25px 5px',
      marginLeft: '0',
      marginRight: 'auto',
      maxWidth: '85%',
      wordWrap: 'break-word',
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap',
      fontSize: '1rem',
      boxShadow: isDarkMode 
        ? '0 4px 15px rgba(0,0,0,0.3)' 
        : '0 4px 15px rgba(0,0,0,0.1)',
      border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
    },
    timestamp: {
      fontSize: '0.8rem',
      color: isDarkMode ? '#a0aec0' : '#718096',
      textAlign: 'right',
      marginTop: '8px',
      opacity: '0.7'
    },
    inputSection: {
      padding: '20px 25px',
      background: isDarkMode ? 'rgba(45, 55, 72, 0.8)' : 'white',
      borderTop: '1px solid rgba(0,0,0,0.1)'
    },
    inputForm: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    messageInput: {
      flex: 1,
      padding: '15px 20px',
      border: isDarkMode ? '2px solid rgba(255,255,255,0.2)' : '2px solid #e2e8f0',
      borderRadius: '25px',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      background: isDarkMode ? 'rgba(26, 32, 44, 0.8)' : '#f7fafc',
      color: isDarkMode ? '#e2e8f0' : '#2d3748',
      fontFamily: '"Nunito", sans-serif'
    },
    sendButton: {
      background: 'linear-gradient(135deg, #48bb78, #38a169)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      cursor: 'pointer',
      fontSize: '1.2rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(72, 187, 120, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    sidebarCard: {
      background: isDarkMode ? 'rgba(45, 55, 72, 0.6)' : 'white',
      borderRadius: '16px',
      padding: '25px',
      boxShadow: isDarkMode 
        ? '0 8px 25px rgba(0,0,0,0.3)' 
        : '0 8px 25px rgba(0,0,0,0.1)',
      border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
    },
    cardTitle: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: isDarkMode ? '#e2e8f0' : '#2d3748',
      margin: '0 0 15px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    tabButtons: {
      display: 'flex',
      background: isDarkMode ? 'rgba(26, 32, 44, 0.8)' : '#f1f5f9',
      borderRadius: '12px',
      padding: '4px',
      marginBottom: '20px'
    },
    tabButton: {
      flex: 1,
      padding: '12px 16px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      background: 'transparent',
      color: isDarkMode ? '#a0aec0' : '#64748b'
    },
    activeTabButton: {
      background: isDarkMode 
        ? 'linear-gradient(135deg, #4299e1, #3182ce)'
        : 'linear-gradient(135deg, #4299e1, #3182ce)',
      color: 'white',
      boxShadow: '0 2px 8px rgba(66, 153, 225, 0.3)'
    },
    tipCard: {
      background: isDarkMode ? 'rgba(74, 85, 104, 0.4)' : '#f8fafc',
      padding: '18px',
      borderRadius: '12px',
      marginBottom: '15px',
      border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
      transition: 'all 0.3s ease'
    },
    tipTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: isDarkMode ? '#81c784' : '#2d7d32',
      margin: '0 0 8px 0'
    },
    tipDescription: {
      fontSize: '0.9rem',
      color: isDarkMode ? '#cbd5e0' : '#4a5568',
      lineHeight: '1.5',
      margin: '0'
    },
    emergencyCard: {
      background: 'linear-gradient(135deg, #fed7d7, #feb2b2)',
      color: '#742a2a',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '15px',
      border: '2px solid #fc8181'
    },
    emergencyTitle: {
      fontSize: '1.1rem',
      fontWeight: '700',
      margin: '0 0 8px 0',
      color: '#c53030'
    },
    emergencyNumber: {
      fontSize: '1.4rem',
      fontWeight: '800',
      margin: '0 0 8px 0',
      color: '#2d3748'
    },
    emergencyDescription: {
      fontSize: '0.9rem',
      margin: '0',
      color: '#4a5568'
    },
    clearButton: {
      background: 'linear-gradient(135deg, #f56565, #e53e3e)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(245, 101, 101, 0.3)'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: isDarkMode ? '#81c784' : '#2d7d32',
      fontStyle: 'italic',
      padding: '20px',
      fontSize: '1rem',
      justifyContent: 'center'
    },
    disclaimer: {
      background: isDarkMode 
        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))'
        : 'linear-gradient(135deg, #fef5e7, #fed7aa)',
      border: isDarkMode ? '1px solid rgba(239, 68, 68, 0.3)' : '2px solid #f6ad55',
      borderRadius: '12px',
      padding: '15px 20px',
      margin: '20px auto',
      maxWidth: '1200px',
      color: isDarkMode ? '#fbb6ce' : '#744210',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.1)'
    },
    disclaimerText: {
      margin: '0',
      fontSize: '0.95rem',
      lineHeight: '1.5',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          *::-webkit-scrollbar {
            width: 6px;
          }
          
          *::-webkit-scrollbar-track {
            background: ${isDarkMode ? 'rgba(45, 55, 72, 0.4)' : '#f1f5f9'};
            border-radius: 10px;
          }
          
          *::-webkit-scrollbar-thumb {
            background: ${isDarkMode ? 'rgba(66, 153, 225, 0.6)' : '#4299e1'};
            border-radius: 10px;
          }
          
          *::-webkit-scrollbar-thumb:hover {
            background: ${isDarkMode ? 'rgba(66, 153, 225, 0.8)' : '#3182ce'};
          }
        `}
      </style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.titleSection}>
            <div style={styles.logo}>
              <div style={styles.hospitalIcon}>
                <div style={styles.hospitalBuilding}>🏥</div>
                <div style={styles.medicalCross}>+</div>
              </div>
            </div>
            <div>
              <h1 style={styles.titleText}>MediBot</h1>
              <p style={styles.subtitle}>Your AI Health Assistant</p>
            </div>
          </div>
          <button 
            style={styles.darkModeToggle}
            onClick={() => setIsDarkMode(!isDarkMode)}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Chat Section */}
        <div style={styles.chatSection}>
          <div style={styles.chatHeader}>
            <h2 style={styles.chatTitle}>
              💬 Medical Consultation
            </h2>
            <button 
              style={styles.clearButton}
              onClick={clearConversation}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              🗑️ Clear
            </button>
          </div>

          <div style={styles.messagesArea}>
            {conversation.length === 0 ? (
              <div style={styles.welcomeMessage}>
                <h3>👋 Welcome to MediBot!</h3>
                <p>I'm here to help you with general health information and medical guidance. Feel free to ask me about symptoms, health tips, or any medical concerns you might have.</p>
                <p><strong>Remember:</strong> I'm not a replacement for professional medical advice!</p>
              </div>
            ) : (
              conversation.map((entry) => (
                <div key={entry.id} style={styles.messageGroup}>
                  {entry.user && (
                    <div style={styles.userMessage}>
                      {entry.user}
                    </div>
                  )}
                  {entry.bot && (
                    <div style={styles.botMessage}>
                      {formatBotResponse(entry.bot)}
                    </div>
                  )}
                  <div style={styles.timestamp}>
                    {entry.timestamp}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div style={styles.loading}>
                <div style={{
                  fontSize: '1.5rem',
                  animation: 'bounce 1.5s infinite'
                }}>🤖</div>
                <span>Analyzing your query...</span>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(66, 153, 225, 0.3)',
                  borderTop: '2px solid #4299e1',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={styles.inputSection}>
            <form onSubmit={handleSubmit} style={styles.inputForm}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your symptoms or ask a health question..."
                style={styles.messageInput}
                disabled={isLoading}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4299e1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(66, 153, 225, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.2)' : '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button 
                type="submit" 
                style={styles.sendButton}
                disabled={isLoading || !message.trim()}
                onMouseEnter={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 6px 20px rgba(72, 187, 120, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(72, 187, 120, 0.4)';
                }}
              >
                {isLoading ? '⏳' : '➤'}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          {/* Tab Selection */}
          <div style={styles.sidebarCard}>
            <div style={styles.tabButtons}>
              <button 
                style={{
                  ...styles.tabButton, 
                  ...(activeTab === 'tips' ? styles.activeTabButton : {})
                }}
                onClick={() => setActiveTab('tips')}
              >
                💡 Tips
              </button>
              <button 
                style={{
                  ...styles.tabButton, 
                  ...(activeTab === 'emergency' ? styles.activeTabButton : {})
                }}
                onClick={() => setActiveTab('emergency')}
              >
                🚨 Emergency
              </button>
            </div>

            {activeTab === 'tips' && (
              <>
                <h3 style={styles.cardTitle}>💡 Health Tips</h3>
                {healthTips.slice(0, 4).map((tip, index) => (
                  <div 
                    key={index} 
                    style={styles.tipCard}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <h4 style={styles.tipTitle}>{tip.title}</h4>
                    <p style={styles.tipDescription}>{tip.description}</p>
                  </div>
                ))}
              </>
            )}

            {activeTab === 'emergency' && (
              <>
                <h3 style={styles.cardTitle}>🚨 Emergency Contacts</h3>
                <div style={{...styles.emergencyCard, marginBottom: '20px'}}>
                  <h4 style={styles.emergencyTitle}>⚡ Life-Threatening Emergency</h4>
                  <p style={styles.emergencyNumber}>911</p>
                  <p style={styles.emergencyDescription}>Call immediately for heart attack, stroke, severe bleeding, unconsciousness</p>
                </div>
                {emergencyContacts.slice(1).map((contact, index) => (
                  <div key={index} style={styles.emergencyCard}>
                    <h4 style={styles.emergencyTitle}>{contact.service}</h4>
                    <p style={styles.emergencyNumber}>{contact.number}</p>
                    <p style={styles.emergencyDescription}>{contact.description}</p>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div style={styles.sidebarCard}>
            <h3 style={styles.cardTitle}>⚡ Quick Actions</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <button 
                style={{
                  ...styles.tabButton,
                  background: 'linear-gradient(135deg, #4299e1, #3182ce)',
                  color: 'white',
                  borderRadius: '8px'
                }}
                onClick={() => setMessage("I have a headache and fever")}
              >
                🤒 Common Cold Symptoms
              </button>
              <button 
                style={{
                  ...styles.tabButton,
                  background: 'linear-gradient(135deg, #48bb78, #38a169)',
                  color: 'white',
                  borderRadius: '8px'
                }}
                onClick={() => setMessage("Give me health tips for better sleep")}
              >
                😴 Sleep Health
              </button>
              <button 
                style={{
                  ...styles.tabButton,
                  background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
                  color: 'white',
                  borderRadius: '8px'
                }}
                onClick={() => setMessage("What are signs of stress?")}
              >
                🧠 Mental Health
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div style={styles.disclaimer}>
        <p style={styles.disclaimerText}>
          <strong>⚠️ Disclaimer:</strong> For informational purposes only. Not a substitute for professional medical advice. Consult healthcare professionals for medical concerns.
        </p>
      </div>
    </div>
  );
};

export default MediBot;
