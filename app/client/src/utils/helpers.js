// src/utils/helpers.js
// src/utils/helpers.js
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-NP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // use 24-hour format; set to true for 12-hour format
  });
};

export const formatDateOnly = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusBadge = (status) => {
  const statusConfig = {
    registered: { label: 'Registered', color: 'bg-blue-100 text-blue-800' },
    under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800' },
    assigned: { label: 'Assigned', color: 'bg-purple-100 text-purple-800' },
    in_progress: { label: 'In Progress', color: 'bg-orange-100 text-orange-800' },
    resolved: { label: 'Resolved', color: 'bg-green-100 text-green-800' }
  }
  
  return statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/
  return re.test(password)
}