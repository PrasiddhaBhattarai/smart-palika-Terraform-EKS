import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/complaints';
import { FiUpload, FiMapPin, FiTag, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    description: '',
    latitude: '',
    longitude: '',
    tags: [],
    photo: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [similarComplaints, setSimilarComplaints] = useState(null);
  const [draftKey, setDraftKey] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const complaintCategories = {
    "Roads & Transport": ["potholes", "illegal parking", "accident"],
    "Sanitation": ["garbage", "open drains", "bad smell"],
    "Water Supply": ["no water", "contaminated water"],
    "Power": ["streetlight out", "power cuts"],
    "Health": ["dead animals"],
    "Environment": ["pollution", "noise complaints"]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagSelect = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          toast.success('Location obtained successfully!');
        },
        (error) => {
          toast.error('Could not get your location. Please enter manually.');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await complaintService.fileComplaint(formData);

      if (response.success) {
        toast.success('Complaint filed successfully!');
        navigate('/complaints');
      } else if (response.similar) {
        console.log("Similar complaints:", response.similar);

        setSimilarComplaints(response.similar);
        setDraftKey(response.draftKey);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimilarComplaintAction = async (confirmDuplicate, existingComplainId) => {
    setIsLoading(true);
    try {
      const response = await complaintService.supportComplaint(existingComplainId, confirmDuplicate);

      if (response.success) {

        if (confirmDuplicate) {
          toast.success('You supported an existing complaint!');
        } else {
          toast.success('Complaint filed successfully!');
        }
        navigate('/complaints');
      }
    } catch (error) {
      toast.error('Failed to process complaint');
    } finally {
      setIsLoading(false);
    }
  };
  // In client/src/pages/SubmitComplaint.jsx
  const handleFileNewComplaint = async () => {
    if (!formData.description || !formData.latitude || !formData.longitude || !formData.photo || formData.tags.length === 0) {
      toast.error('Please fill all required fields!');
      return;
    }

    setIsLoading(true);
    try {
      // Add fileNewAnyway flag to bypass similar complaints check
      const complaintData = {
        ...formData,
        fileNewAnyway: true
      };

      const response = await complaintService.fileComplaint(complaintData);
      if (response.success) {
        toast.success('Complaint filed successfully!');
        navigate('/complaints');
      } else {
        toast.error('Failed to file new complaint');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to file new complaint');
    } finally {
      setIsLoading(false);
    }
  };

  // dsfsdfsd



  if (similarComplaints) {

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <FiAlertCircle className="text-yellow-500 w-8 h-8 mr-3" />
            <h1 className="text-2xl font-bold text-nepal-blue">Similar Complaints Found</h1>
          </div>

          <p className="text-gray-600 mb-6">
            We found similar complaints in your area. Would you like to support an existing complaint or file a new one?
          </p>

          <div className="space-y-4 mb-6">
            {similarComplaints.map((complaint) => (
              <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                <p className="font-semibold">{complaint.description}</p>

                {complaint.url && (
                  <img
                    src={complaint.url}
                    alt="Complaint evidence"
                    className="w-full h-48 object-cover rounded-lg mt-3"
                  />
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                  {complaint.tags.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleSimilarComplaintAction(true, complaint.id)}
                  className="mt-3 bg-nepal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                >
                  Support This Complaint
                </button>
              </div>

            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleFileNewComplaint} // use the new function
              className="bg-nepal-red text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              File New Complaint Anyway
            </button>
            {/* gerg */}

            <button
              onClick={() => navigate('/complaints')}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-nepal-blue mb-6">File New Complaint</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaint Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent"
              placeholder="Describe the issue in detail..."
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent"
                  placeholder="27.719445"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent"
                  placeholder="85.316908"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={getCurrentLocation}
              className="mt-2 flex items-center text-nepal-blue hover:text-blue-800"
            >
              <FiMapPin className="mr-1" />
              Use my current location
            </button>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories *
            </label>
            <div className="space-y-3">
              {Object.entries(complaintCategories).map(([category, tags]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagSelect(tag)}
                        className={`px-3 py-1 rounded-full text-sm ${formData.tags.includes(tag)
                          ? 'bg-nepal-blue text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
                required
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  {formData.photo ? formData.photo.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
              </label>
            </div>
            {formData.photo && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(formData.photo)}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || formData.tags.length === 0}
            className="w-full bg-nepal-red text-white py-3 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;