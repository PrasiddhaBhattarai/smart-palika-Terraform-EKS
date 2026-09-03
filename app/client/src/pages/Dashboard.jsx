import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/complaints';
import { 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiClock, 
  FiPlus,
  FiTrendingUp,
  FiMapPin,
  FiUser
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    registered: 0,
    inProgress: 0,
    resolved: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent complaints
      const complaintsResponse = await complaintService.getUserComplaints({ page: 1, limit: 5 });
      
      // Handle different response formats from backend
      let complaints = [];
      if (complaintsResponse.success) {
        complaints = complaintsResponse.complaints || [];
      } else if (Array.isArray(complaintsResponse)) {
        complaints = complaintsResponse;
      }
      
      setRecentComplaints(complaints);
      
      // Calculate stats from complaints
      const calculatedStats = {
        total: complaints.length,
        registered: complaints.filter(c => c.status === 'registered').length,
        inProgress: complaints.filter(c => 
          ['under_review', 'assigned', 'in_progress'].includes(c.status)
        ).length,
        resolved: complaints.filter(c => c.status === 'resolved').length
      };
      
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty state on error
      setStats({ total: 0, registered: 0, inProgress: 0, resolved: 0 });
      setRecentComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <FiCheckCircle className="text-green-500" />;
      case 'in_progress':
      case 'under_review':
      case 'assigned':
        return <FiClock className="text-yellow-500" />;
      default:
        return <FiAlertTriangle className="text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nepal-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-nepal-blue to-nepal-red rounded-2xl p-8 text-white mb-8"
      >
        <h1 className="text-3xl font-bold mb-2 text-white">
          Welcome back, {user?.role}!
        </h1>
        <p className="text-blue-100">
          {user?.role === 'ward_admin' || user?.role === 'municipality_admin' 
            ? 'Manage complaints and serve your community'
            : 'Track your complaints and help improve your community'
          }
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FiAlertTriangle className="text-nepal-blue w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-gray-600">Total Complaints</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <FiClock className="text-yellow-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.registered}</p>
              <p className="text-gray-600">Registered</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FiCheckCircle className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              <p className="text-gray-600">Resolved</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <FiTrendingUp className="text-red-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              <p className="text-gray-600">In Progress</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-nepal-blue mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/submit-complaint"
              className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-300"
            >
              <FiPlus className="text-nepal-blue mr-3" />
              <span>File New Complaint</span>
            </Link>
            <Link
              to="/complaints"
              className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition duration-300"
            >
              <FiAlertTriangle className="text-green-600 mr-3" />
              <span>View My Complaints</span>
            </Link>
            {user?.role?.includes('admin') && (
              <Link
                to="/admin"
                className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition duration-300"
              >
                <FiUser className="text-purple-600 mr-3" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-nepal-blue mb-4">Recent Complaints</h2>
          {recentComplaints.length === 0 ? (
            <div className="text-center py-8">
              <FiAlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No complaints yet</p>
              <Link
                to="/submit-complaint"
                className="text-nepal-red hover:text-red-700 mt-2 inline-block"
              >
                File your first complaint
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    {getStatusIcon(complaint.status)}
                    <div className="ml-3">
                      <p className="font-medium text-sm truncate max-w-xs">
                        {complaint.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(complaint.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
          {recentComplaints.length > 0 && (
            <Link
              to="/complaints"
              className="block text-center mt-4 text-nepal-red hover:text-red-700 text-sm"
            >
              View all complaints
            </Link>
          )}
        </motion.div>
      </div>

      {/* Community Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-nepal-blue mb-4">Community Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <FiMapPin className="w-8 h-8 text-nepal-blue mx-auto mb-2" />
            <p className="text-2xl font-bold">32</p>
            <p className="text-gray-600">Wards Covered</p>
          </div>
          <div className="text-center">
            <FiUser className="w-8 h-8 text-nepal-red mx-auto mb-2" />
            <p className="text-2xl font-bold">100+</p>
            <p className="text-gray-600">Citizens Served</p>
          </div>
          <div className="text-center">
            <FiCheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">92%</p>
            <p className="text-gray-600">Resolution Rate</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;