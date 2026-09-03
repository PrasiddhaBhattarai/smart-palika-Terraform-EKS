// src/pages/ComplaintRatings.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { complaintService } from '../services/complaints';
import { userService } from '../services/users'; // You'll need to create this service
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { FiArrowLeft, FiStar, FiUser, FiMessageSquare, FiCalendar, FiMapPin } from 'react-icons/fi';


const ComplaintRatings = () => {
    const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const res = await complaintService.getComplaintById(id);
        if (res.success && res.complaint) setComplaint(res.complaint);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nepal-blue"></div>
        </div>
      </div>
    );
  }
  
  if (!complaint) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-nepal-blue mb-4">Complaint Not Found</h1>
          <p className="text-gray-600 mb-6">The complaint you're looking for doesn't exist or may have been removed.</p>
          <Link 
            to="/complaints" 
            className="inline-flex items-center bg-nepal-blue text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Complaints
          </Link>
        </div>
      </div>
    );
  }

  // Calculate average rating
  const ratings = complaint.ratings ? Object.values(complaint.ratings) : [];
  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1) 
    : 0;

  return (
    <motion.div 
      className="max-w-4xl mx-auto p-4 md:p-6 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="mb-8">
        <Link 
          to={`/complaints/${id}`} 
          className="inline-flex items-center text-nepal-blue hover:text-nepal-red mb-4 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Complaint Details
        </Link>
        
        <h1 className="text-2xl md:text-3xl font-bold text-nepal-blue mb-2">Ratings & Feedback</h1>
        <p className="text-gray-600">See how users rated the resolution of this complaint</p>
      </div>

      {/* Complaint Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <h2 className="text-lg font-semibold text-nepal-blue mb-3">Complaint Summary</h2>
        <p className="text-gray-700 mb-4">{complaint.description}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {complaint.ward_number && (
            <div className="flex items-center">
              <FiMapPin className="mr-1.5 text-nepal-blue" />
              <span>Ward {complaint.ward_number}</span>
            </div>
          )}
          {complaint.submitted_at && (
            <div className="flex items-center">
              <FiCalendar className="mr-1.5 text-nepal-blue" />
              <span>Submitted on {new Date(complaint.submitted_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ratings Overview */}
      <div className="bg-gradient-to-r from-nepal-blue to-nepal-red rounded-2xl p-6 text-white mb-8">
        <h2 className="text-xl font-semibold mb-4">Overall Rating</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-4xl font-bold mr-4">{averageRating}/5</div>
            <div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar 
                    key={star} 
                    className={`w-6 h-6 ${star <= averageRating ? 'fill-current text-amber-400' : 'text-amber-100'}`} 
                  />
                ))}
              </div>
              <p className="text-blue-100 mt-1">{ratings.length} rating{ratings.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="bg-white/20 p-3 rounded-xl">
            <FiMessageSquare className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Ratings List */}
      <div>
        <h2 className="text-xl font-semibold text-nepal-blue mb-4">User Feedback</h2>
        
        {complaint.ratings && Object.keys(complaint.ratings).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(complaint.ratings).map(([userId, rating]) => (
              <motion.div 
                key={userId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FiUser className="text-nepal-blue" />
                      </div>
                      <div>
                       <p className="font-medium text-gray-900">{complaint.userNames?.[userId] || `User ${userId.substring(0, 8)}...`}</p>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar 
                              key={star} 
                              className={`w-4 h-4 ${star <= rating ? 'fill-current text-amber-500' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="ml-2 text-sm font-medium text-amber-700">{rating}/5</span>
                        </div>
                      </div>
                    </div>
                    
                    {complaint.feedbacks?.[userId] && (
                      <div className="bg-blue-50 rounded-xl p-4 mt-3">
                        <div className="flex items-start">
                          <FiMessageSquare className="text-nepal-blue mt-0.5 mr-2 flex-shrink-0" />
                          <p className="text-gray-700 text-sm">{complaint.feedbacks[userId]}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 self-end">
                    Rated on {new Date().toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="bg-gray-100 p-4 rounded-full inline-flex mb-4">
              <FiStar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Ratings Yet</h3>
            <p className="text-gray-500">This complaint hasn't received any ratings yet.</p>
          </div>
        )}
      </div>

      <Toaster position="top-right" />
    </motion.div>
  );
};

export default ComplaintRatings;