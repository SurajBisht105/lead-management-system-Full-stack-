import api from './api';

export const leadService = {
  // Create a new lead
  createLead: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },

  // Get all leads
  getAllLeads: async (params = {}) => {
    const response = await api.get('/leads', { params });
    return response.data;
  },

  // Get single lead
  getLeadById: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  // Update lead status
  updateLeadStatus: async (id, status) => {
    const response = await api.patch(`/leads/${id}/status`, { status });
    return response.data;
  },

  // Delete lead
  deleteLead: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  }
};