import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/complaints';
import { FiUsers, FiAlertTriangle, FiCheckCircle, FiClock, FiBarChart2 } from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wards, setWards] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchAdminData();
  }, []);

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

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // For ward_admin, fetch complaints for their specific ward
      // For municipality_admin, fetch all complaints in their municipality
      let response;
      
      if (user.role === 'ward_admin' && user.ward_id) {
        response = await complaintService.getComplaintsByLocation({
          ward_id: user.ward_id,
          limit: 10
        });
        console.log('Ward ID:', user.ward_id);
      } else if (user.role === 'municipality_admin') {
        // For municipality admin, we need to get palika_id from user or use a default
        // This might need adjustment based on your user data structure
        response = await complaintService.getComplaintsByLocation({
          // You might need to add palika_id to user object or get it from somewhere
          limit: 10
        });
      } else {
        // Fallback: get user's own complaints
        response = await complaintService.getUserComplaints({ limit: 10 });
      }
      
      if (response.success) {
        const complaints = response.complaints || [];
        setRecentComplaints(complaints);
        
        // Calculate stats
        setStats({
          totalComplaints: complaints.length,
          pending: complaints.filter(c => c.status === 'registered').length,
          inProgress: complaints.filter(c => 
            ['under_review', 'assigned', 'in_progress'].includes(c.status)
          ).length,
          resolved: complaints.filter(c => c.status === 'resolved').length
        });
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      // Fallback to user complaints if location-based query fails
      try {
        const fallbackResponse = await complaintService.getUserComplaints({ limit: 10 });
        if (fallbackResponse.success) {
          const complaints = fallbackResponse.complaints || [];
          setRecentComplaints(complaints);
          setStats({
            totalComplaints: complaints.length,
            pending: complaints.filter(c => c.status === 'registered').length,
            inProgress: complaints.filter(c => 
              ['under_review', 'assigned', 'in_progress'].includes(c.status)
            ).length,
            resolved: complaints.filter(c => c.status === 'resolved').length
          });
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

const handleStatusUpdate = async (complaintId, newStatus) => {
  try {
    const response = await complaintService.updateStatus(complaintId, newStatus);
    if (response.success) {
      toast.success('Status updated successfully'); // <-- changed
      fetchAdminData(); // Refresh data
    } else {
      toast.error(response.message); // <-- changed
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update status'); // <-- changed
  }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nepal-blue"></div>
      </div>
    );
  }
  const adminWard = wards.find(w => Number(w.id) === Number(user?.ward_id));
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold text-nepal-blue mb-8">Admin Dashboard</h1>
      
      {/* Admin Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-nepal-blue mb-2">Admin Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="font-medium capitalize">{user.role?.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          {user.ward_id && (
            <div>
              <p className="text-sm text-gray-600">Ward</p>
              <p className="font-medium">
  {adminWard?.name || `Ward ${user.ward_id}`}
</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FiAlertTriangle className="text-nepal-blue w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</p>
              <p className="text-gray-600">Total Complaints</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <FiClock className="text-yellow-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <FiBarChart2 className="text-orange-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              <p className="text-gray-600">In Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FiCheckCircle className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              <p className="text-gray-600">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-nepal-blue mb-6">
          {user.role === 'ward_admin' ? 'Complaints in Your Ward' : 'Recent Complaints'}
        </h2>
        
        {recentComplaints.length === 0 ? (
          <div className="text-center py-8">
            <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No complaints found</p>
            <p className="text-sm text-gray-500 mt-1">
              {user.role === 'ward_admin' 
                ? 'No complaints have been filed in your ward yet.'
                : 'No complaints found in your jurisdiction.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentComplaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {complaint.description}
                      </div>
                      {complaint.tags && complaint.tags.length > 0 && (
                        <div className="text-sm text-gray-500 mt-1">
                          Tags: {complaint.tags.join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={complaint.status}
                        onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="registered">Registered</option>
                        <option value="under_review">Under Review</option>
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(complaint.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => {window.location.href = `/complaints/${complaint.id}`}}
                        className="text-nepal-blue hover:text-blue-800 text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;