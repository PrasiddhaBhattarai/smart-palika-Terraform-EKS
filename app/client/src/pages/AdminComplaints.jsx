import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/complaints';
import { 
  FiSearch, FiFilter, FiEye, FiTrash2, FiDownload, FiRefreshCw,
  FiUser, FiMapPin, FiHash
} from 'react-icons/fi';
import {useNavigate} from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';


const AdminComplaints = () => {
  
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('ward'); // 'user', 'ward', 'id', 'location'
  const [wards, setWards] = useState([]);
  const [filters, setFilters] = useState({
    userId: '',
    wardId: user?.role === 'ward_admin' ? user.ward_id : '',
    complaintId: '',
    status: '',
    tags: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 20,
    order: 'desc',
  });
  const [totalCount, setTotalCount] = useState(0);

  // Keep wardId for ward admins
  useEffect(() => {
    if (user?.role === 'ward_admin' && user.ward_id) {
      setFilters(prev => ({ ...prev, wardId: user.ward_id }));
      setSearchType('ward');
    }
  }, [user]);

  
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

  // Normalize API response
  const normalizeResponse = (response) => {
    if (!response.success) return [];
    if (response.complaints) return response.complaints;
    if (response.complaint) return response.complaint ? [response.complaint] : [];
    return [];
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      let response;

      switch (searchType) {
        case 'user':
          response = await complaintService.getUserComplaints({
            id: filters.userId,
            status: filters.status,
            page: filters.page,
            limit: filters.limit,
            order: filters.order,
          });
          break;

        case 'ward':
        case 'location':
          response = await complaintService.getComplaintsByLocation({
            ward_id: filters.wardId,
            status: filters.status,
            tags: filters.tags,
            startDate: filters.startDate,
            endDate: filters.endDate,
            page: filters.page,
            limit: filters.limit,
            order: filters.order,
          });
          break;

        case 'id':
          if (!filters.complaintId) {
            toast.error('Please enter a complaint ID');
            setLoading(false);
            return;
          }
          response = await complaintService.getComplaintById(filters.complaintId);
          break;

        default:
          response = await complaintService.getComplaintsByLocation({
            ward_id: filters.wardId,
            status: filters.status,
            page: filters.page,
            limit: filters.limit,
            order: filters.order,
          });
      }

      const data = normalizeResponse(response);
      setComplaints(data);
      setTotalCount(response.totalCount || data.length); // totalCount from backend if available

    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to fetch complaints. Check your filters.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setFilters(prev => ({
      userId: '',
      wardId: user.role === 'ward_admin' ? user.ward_id : '',
      complaintId: '',
      status: '',
      tags: '',
      startDate: '',
      endDate: '',
      page: 1,
      limit: 20,
      order: 'desc',
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      const response = await complaintService.deleteComplaint(id);
      if (response.success) {
        setComplaints(prev => prev.filter(c => c.id !== id));
        toast.success('Complaint deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete complaint');
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;
    try {
      const response = await complaintService.updateStatus(complaintId, newStatus);
      if (response.success) {
        setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, status: newStatus } : c));
      } else {
        toast.error(response.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const exportCSV = () => {
    if (!complaints.length) return;

    const csvContent = [
      ['ID', 'Description', 'Status', 'Ward', 'Tags', 'Submitted At', 'Resolved At'],
      ...complaints.map(c => [
        c.id,
        `"${(c.description || '').replace(/"/g, '""')}"`,
        c.status,
        c.ward_id,
        c.tags?.join(', ') || '',
        c.submitted_at,
        c.resolved_at || ''
      ])
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `complaints-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-nepal-blue">Complaints Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={exportCSV}
            disabled={!complaints.length}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            <FiDownload className="mr-2" /> Export CSV
          </button>
          <button
            onClick={fetchComplaints}
            className="bg-nepal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center"
          >
            <FiRefreshCw className="mr-2" /> Refresh
          </button>
        </div>
      </div>

      {/* Search Type Selector */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-nepal-blue mb-4">Search Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { type: 'ward', icon: <FiMapPin />, label: 'By Ward' },
            { type: 'user', icon: <FiUser />, label: 'By User' },
            { type: 'id', icon: <FiHash />, label: 'By ID' },
            // { type: 'location', icon: <FiSearch />, label: 'Advanced' },
          ].map(({ type, icon, label }) => (
            <button
              key={type}
              onClick={() => handleSearchTypeChange(type)}
              className={`p-3 rounded-lg border-2 flex flex-col items-center ${
                searchType === type ? 'border-nepal-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-nepal-blue mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {(searchType === 'ward' || searchType === 'location') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ward ID</label>
                <input
                  type="number"
                  value={filters.wardId}
                  onChange={(e) => handleFilterChange('wardId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue"
                  placeholder="Enter ward number"
                  min="1"
                  max="32"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={filters.tags}
                  onChange={(e) => handleFilterChange('tags', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue"
                  placeholder="garbage, potholes, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue"
                />
              </div>
            </>
          )}

          {searchType === 'user' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <input
                type="number"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue"
                placeholder="Enter user ID"
                min="1"
              />
            </div>
          )}

          {searchType === 'id' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Complaint ID</label>
              <input
                type="number"
                value={filters.complaintId}
                onChange={(e) => handleFilterChange('complaintId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue"
                placeholder="Enter complaint ID"
                min="1"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
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
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue"
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>

            <select
              value={filters.order}
              onChange={(e) => handleFilterChange('order', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          <button
            onClick={fetchComplaints}
            disabled={loading}
            className="bg-nepal-red text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
          >
            <FiSearch className="mr-2" /> {loading ? 'Searching...' : 'Search Complaints'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-2xl shadow-lg overflow-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nepal-blue mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading complaints...</p>
          </div>
        ) : !complaints.length ? (
          <div className="text-center py-12">
            <FiFilter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-600">
              {filters.status ? `No ${filters.status} complaints match your filters.` : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                {['ID','Description','Status','Ward','Tags','Date','Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complaints.map(c => (
                <tr key={c.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{c.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{c.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusUpdate(c.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="registered">Registered</option>
                      <option value="under_review">Under Review</option>
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  {/* <td className="px-6 py-4 text-sm text-gray-500">Ward {c.ward_id}</td> */}
                  <td className="px-6 py-4 text-sm text-gray-500">
  Ward {wards.find(w => Number(w.id) === Number(c.ward_id))?.name || c.ward_id}
</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {c.tags?.slice(0,3).map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{tag}</span>
                      ))}
                      {c.tags?.length > 3 && <span className="text-xs text-gray-500">+{c.tags.length - 3} more</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(c.submitted_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-medium flex space-x-2">
                    <button className="text-nepal-blue hover:text-blue-800" onClick={() => navigate(`/complaints/${c.id}`)} ><FiEye className="w-5 h-5"/></button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800"><FiTrash2 className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {complaints.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
            disabled={filters.page === 1}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >Previous</button>
          <span className="text-sm text-gray-600">
            Page {filters.page} of {Math.ceil(totalCount / filters.limit) || 1}
          </span>
          <button
            onClick={() => handleFilterChange('page', filters.page + 1)}
            disabled={filters.page * filters.limit >= totalCount}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
