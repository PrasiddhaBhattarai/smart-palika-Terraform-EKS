import { api } from './api';

export const complaintService = {
// In client/src/services/complaints.js - fileComplaint function
async fileComplaint(complaintData) {
  const formData = new FormData();

  Object.keys(complaintData).forEach(key => {
    if (key === 'tags' && Array.isArray(complaintData[key])) {
      formData.append(key, JSON.stringify(complaintData[key]));
    } else if (key === 'photo' && complaintData[key]) {
      formData.append('image', complaintData[key]);
    } else if (complaintData[key] !== null && complaintData[key] !== undefined) {
      formData.append(key, complaintData[key]);
    }
  });

  const response = await api.post('/complaint/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  });

  return response.data;
},
  async getUserComplaints(params = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const response = await api.get(`/complaint/user?${queryParams}`);
    
    // Handle both response formats from your backend
    if (response.data.success) {
      return {
        success: true,
        complaints: response.data.complaints || [],
        message: response.data.message
      };
    }
    
    return response.data;
  },

  async getComplaintById(id) {
    const response = await api.get(`/complaint/${id}`);
    
    // Handle both response formats
    if (response.data.success) {
      return {
        success: true,
        complaint: response.data.complaint || null,
        message: response.data.message
      };
    }
    
    return response.data;
  },

 async getComplaintsByLocation(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    console.log('API Call: /complaint/location?' + queryParams.toString());
    const response = await api.get(`/complaint/location?${queryParams}`);
    console.log('API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('API Error Details:', error.response?.data);
    throw error;
  }
},
  // In /src/services/complaints.js
async getComplaintsByWard(wardId, params = {}) {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('ward_id', wardId);
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const response = await api.get(`/complaint/location?${queryParams}`);
    
    // Handle response format
    if (response.data.success) {
      return {
        success: true,
        complaints: response.data.complaints || [],
        message: response.data.message
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching complaints by ward:', error);
    throw error;
  }
},

  async deleteComplaint(id) {
    const response = await api.delete(`/complaint/${id}`);
    return response.data;
  },

 async updateStatus(id, status) {
  const response = await api.patch(`/complaint/update-status/${Number(id)}`, { status });
  return response.data;
},


async rateComplaint(id, rating, feedback) {
  try {
    const response = await api.patch(`/complaint/rate/${id}`, {
      rating,
      feedback: feedback || null
    });
    
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        complaint: response.data.complaint
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error rating complaint:', error);
    throw error;
  }
},

  async getStats() {
    try {
      // Get user complaints to calculate stats
      const response = await this.getUserComplaints();
      
      // Handle different response formats
      let complaints = [];
      if (response.success) {
        complaints = response.complaints || [];
      } else if (Array.isArray(response)) {
        complaints = response;
      }
      
      const stats = {
        total: complaints.length,
        registered: complaints.filter(c => c.status === 'registered').length,
        inProgress: complaints.filter(c => 
          ['under_review', 'assigned', 'in_progress'].includes(c.status)
        ).length,
        resolved: complaints.filter(c => c.status === 'resolved').length
      };

      return { success: true, stats };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { 
        success: true, 
        stats: { total: 0, registered: 0, inProgress: 0, resolved: 0 } 
      };
    }
  },

  async supportComplaint(complaintId, confirmDuplicate = false) {
    const response = await api.post('/complaint/file', {
      confirmDuplicate,
      existingComplainId: complaintId
    });
    return response.data;
  }
};