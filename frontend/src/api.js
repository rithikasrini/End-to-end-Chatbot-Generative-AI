// API utilities for MediBot frontend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const medicalConsultation = async (message, conversationHistory = []) => {
  try {
    const response = await fetch(`${API_BASE_URL}/medical-consultation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in medical consultation:', error);
    throw error;
  }
};

export const getHealthTips = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health-tips`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching health tips:', error);
    throw error;
  }
};

export const getEmergencyContacts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/emergency-contacts`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    throw error;
  }
};

export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking server health:', error);
    throw error;
  }
};
