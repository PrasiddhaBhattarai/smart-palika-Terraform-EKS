// src/pages/ComplaintDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { complaintService } from '../services/complaints';
import ComplaintCard from '../components/complaints/ComplaintCard';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';


const ComplaintDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wards, setWards] = useState([]);

  useEffect(() => {
  const fetchWards = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/ward');
      const data = await res.json();
      setWards(data);
    } catch (err) {
      console.error('Failed to fetch wards:', err);
    }
  };

  fetchWards();
}, []);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const res = await complaintService.getComplaintById(id);
        if (res.success && res.complaint) setComplaint(res.complaint);
      } catch (err) {
        console.error('Error fetching complaint:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

const handleDelete = async (id) => {
  // show a toast with confirm/cancel buttons
  toast(
    (t) => (
      <div className="flex flex-col">
        <p className="mb-2">Are you sure you want to delete this complaint?</p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={async () => {
              toast.dismiss(t.id); // dismiss confirmation toast
              try {
                const response = await complaintService.deleteComplaint(id);
                if (response.success) {
                  setComplaint(null); // or navigate away
                  toast.success('Complaint deleted successfully');
                } else {
                  toast.error(response.message || 'Failed to delete complaint');
                }
              } catch (err) {
                console.error(err);
                toast.error('Error deleting complaint');
              }
            }}
          >
            Yes
          </button>
        </div>
      </div>
    ),
    { duration: Infinity } // keep open until user clicks
  );
};


 const VALID_STATUS = ['registered','under_review','assigned','in_progress','resolved'];

const handleStatusUpdate = async (id, newStatus) => {
  const statusClean = newStatus.trim().toLowerCase();
  if (!VALID_STATUS.includes(statusClean)) {
    toast.error('Invalid status selected');
    return;
  }

  try {
    const response = await complaintService.updateStatus(id, statusClean);
    if (response.success) {
      toast.success('Status updated successfully');
      setComplaint({ ...complaint, status: statusClean });
    } else {
      toast.error(response.message || 'Failed to update status');
    }
  } catch (err) {
    console.error(err);
    toast.error('Error updating status');
  }
};


  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!complaint) return <p className="text-center mt-10">Complaint not found.</p>;

  return (
    <motion.div className="max-w-3xl mx-auto p-4 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ComplaintCard 
  complaint={complaint}
  wards={wards}
  showUserActions={!user.role.includes('admin')}
  showAdminActions={user.role.includes('admin')}
  onStatusUpdate={handleStatusUpdate}
  onDelete={handleDelete}


/>

      <Toaster position="top-right" />
    </motion.div>
  );
};

export default ComplaintDetails;
