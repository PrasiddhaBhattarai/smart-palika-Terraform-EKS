import React, { useState, useEffect } from 'react';
import { FiMapPin, FiMessageSquare, FiStar, FiEye, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDate,formatDateOnly, getStatusBadge } from '../../utils/helpers';
import RatingModal from './RatingModal';
import { useComplaint } from '../../context/ComplaintContext';

const ComplaintCard = ({
  complaint,
  wards = [],
  showAdminActions = false,
  showUserActions = false,
  onStatusUpdate,
  onDelete
}) => {
  const statusConfig = getStatusBadge(complaint.status);
  const { complaints, setComplaints } = useComplaint();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [avgRating, setAvgRating] = useState(complaint.rating || 0);

  const handleRated = async () => {
    try {
      const res = await fetch(`/api/complaint/${complaint.id}/average-rating`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        setAvgRating(parseFloat(data.average_rating));
        setComplaints(prev =>
          prev.map(c =>
            c.id === complaint.id ? { ...c, rating: data.average_rating } : c
          )
        );
      }
    } catch (err) {
      console.error('Failed to fetch average rating', err);
    }
  };

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const res = await fetch(`/api/complaint/${complaint.id}/average-rating`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) setAvgRating(parseFloat(data.average_rating));
      } catch (err) {
        console.error('Failed to fetch average rating', err);
      }
    };

    fetchAverageRating();
  }, [complaint.id]);

  const STATUS_OPTIONS = [
    { value: 'registered', label: 'Registered' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
  ];
const ward = wards.find(w => Number(w.id) === Number(complaint.ward_id));
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
      >
        {/* Header with status and date */}
        <div className="flex flex-wrap items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
            {complaint.escalated_to_municipality && (
              <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                Escalated
              </span>
            )}
          </div>
          <div className="flex items-center text-gray-500 text-sm mt-2 sm:mt-0">
            <FiCalendar className="w-4 h-4 mr-1.5" />
            <span>{formatDateOnly(complaint.submitted_at)}</span>
          </div>
        </div>
{/* {console.log(complaint)} */}
        {/* Content */}
        <div className="px-6 pb-6">
          {/* Description */}
          <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
            {complaint.description}
          </p>

          {/* Tags */}
          {complaint.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {complaint.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1.5 bg-blue-50 text-nepal-blue rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
              {complaint.tags.length > 3 && (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{complaint.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Image Preview */}
          {complaint.image_url && (
            <div className="mb-5 overflow-hidden rounded-xl border border-gray-200">
              <img 
                src={complaint.image_url} 
                alt="Complaint evidence" 
                className="w-full h-48 object-cover" 
              />
            </div>
          )}

          {/* Stats and View link */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
              <div className="flex items-center">
                <FiMapPin className="w-4 h-4 mr-1.5 text-nepal-blue" />
                <span> Ward {ward?.name || `Ward ${complaint.ward_id}`}</span>
              </div>
              <div className="flex items-center">
                <FiMessageSquare className="w-4 h-4 mr-1.5 text-nepal-blue" />
                {/* <span>{complaint.supporter_count || 1} supporters</span>
                 */}
                 <span>{complaint.userNames ? Object.keys(complaint.userNames).length : 1} supporters</span>
              </div>
              {avgRating > 0 && (
                <div className="flex items-center">
                  <div className="flex items-center bg-amber-50 px-2 py-1 rounded-full">
                    <FiStar className="w-4 h-4 mr-1 text-amber-500" />
                    <span className="text-amber-700 font-medium">
                      {typeof avgRating === 'number' ? avgRating.toFixed(1) : avgRating}/5
                    </span>
                  </div>
                </div>
              )}
            </div>

          <Link to={`/complaints/${complaint.id}/ratings`} className="flex items-center text-nepal-blue hover:text-blue-700 font-medium transition-colors text-sm">
  <FiEye className="w-4 h-4 mr-1.5" />
  View Ratings
</Link>
          </div>

          {/* Admin-only Actions */}
          {showAdminActions && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <select
                value={complaint.status}
                onChange={(e) => onStatusUpdate(complaint.id, e.target.value)}
                className="form-select text-sm py-2.5 w-full sm:w-auto"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* User-only Actions */}
          {showUserActions && (
            <>
              <div className="mt-5 pt-5 border-t border-gray-100">
                <button
                  onClick={() => onDelete(complaint.id)}
                  className="w-full py-3 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100 transition-colors font-medium"
                >
                  Delete Complaint
                </button>
              </div>

              {complaint.status === 'resolved' && (
                <div className="mt-5">
                  <button
                    onClick={() => setShowRatingModal(true)}
                    disabled={complaint.userRated}
                    className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
                      complaint.userRated
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-nepal-red text-white hover:bg-red-700 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {complaint.userRated
                      ? 'You have rated this resolution'
                      : 'Rate Resolution Quality'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          complaint={complaint}
          onClose={() => setShowRatingModal(false)}
          onRate={handleRated}
        />
      )}
    </>
  );
};

export default ComplaintCard;
