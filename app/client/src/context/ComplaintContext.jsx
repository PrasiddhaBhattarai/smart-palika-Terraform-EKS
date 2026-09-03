import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ComplaintContext = createContext();

export const useComplaint = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaint must be used within a ComplaintProvider');
  }
  return context;
};

export const ComplaintProvider = ({ children }) => {
  const [currentComplaint, setCurrentComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ New function to rate a complaint
  const rateComplaint = async (complaintId, rating, feedback) => {
    try {
      setLoading(true);
   const res = await axios.patch(
  `/api/complaint/rate/${complaintId}`,  // 👈 fixed
  { rating, feedback },
  { withCredentials: true }
);


      // Update local state so UI updates immediately
      setComplaints(prev =>
        prev.map(c =>
          c.id === complaintId
            ? { ...c, rating: res.data.rating || rating }
            : c
        )
      );

      return res.data;
    } catch (err) {
      console.error('Failed to rate complaint', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentComplaint,
    setCurrentComplaint,
    complaints,
    setComplaints,
    loading,
    setLoading,
    rateComplaint, // 🔹 add it here
  };

  return (
    <ComplaintContext.Provider value={value}>
      {children}
    </ComplaintContext.Provider>
  );
};
