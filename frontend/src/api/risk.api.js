import apiClient from './client';

/**
 * Risk-related API services
 */

// Evaluate risk based on financial data
export const evaluateRisk = async (payload) => {
  return apiClient.post('/risk/evaluate', payload);
};

// Add other risk-related endpoints here as needed
