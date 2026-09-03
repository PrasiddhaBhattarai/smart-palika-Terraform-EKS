import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/complaints';
import { FiSearch, FiFilter, FiPlus, FiEye, FiTrash2 } from 'react-icons/fi';
// import { Toaster, toast } from 'react-hot-toast';
import { toast } from 'react-hot-toast';


const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 10
  });
  const { user } = useAuth();

 useEffect(() => {
  const timer = setTimeout(() => {
    fetchComplaints();
  }, 300); // 300ms delay

  return () => clearTimeout(timer);
}, [filters.status, filters.page, filters.search]);


  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintService.getUserComplaints(filters);
      
      if (response.success) {
        setComplaints(response.complaints || []);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

 const handleDelete = (id) => {
  toast((t) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <span>Are you sure you want to delete this complaint?</span>
      <div className="flex gap-2 mt-2 sm:mt-0">
        <button
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          onClick={async () => {
            try {
              const response = await complaintService.deleteComplaint(id);
              if (response.success) {
                setComplaints(prev => prev.filter(c => c.id !== id));
                toast.success('Complaint deleted successfully');
              } else {
                toast.error('Failed to delete complaint');
              }
            } catch (err) {
              toast.error('Error deleting complaint');
            }
            toast.dismiss(t.id);
          }}
        >
          Yes
        </button>
        <button
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          onClick={() => toast.dismiss(t.id)}
        >
          No
        </button>
      </div>
    </div>
  ), {
    duration: 8000,
  });
};


  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      default: return 'bg-red-100 text-red-800';
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
      {/* <Toaster position="top-right" /> */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-nepal-blue">My Complaints</h1>
        <Link
          to="/submit-complaint"
          className="bg-nepal-red text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center"
        >
          <FiPlus className="mr-2" />
          New Complaint
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue"
            >
              <option value="">All Status</option>
              <option value="registered">Registered</option>
              <option value="under_review">Under Review</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue"
              />
            </div>
          </div> */}
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {complaints.length === 0 ? (
          <div className="text-center py-12">
            <FiFilter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-600 mb-4">
              {filters.status ? `No ${filters.status} complaints found.` : 'You haven\'t filed any complaints yet.'}
            </p>
            <Link
              to="/submit-complaint"
              className="bg-nepal-red text-white px-6 py-2 rounded-lg hover:bg-red-700 inline-flex items-center"
            >
              <FiPlus className="mr-2" />
              File Your First Complaint
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {complaint.description.length > 60
                          ? `${complaint.description.substring(0, 60)}...`
                          : complaint.description
                        }
                      </div>
                      <div className="text-sm text-gray-500">
                        {complaint.tags?.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(complaint.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/complaints/${complaint.id}`}
                          className="text-nepal-blue hover:text-blue-800"
                        >
                          <FiEye className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(complaint.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
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

export default Complaints;