// src/utils/validators.js
export const complaintValidators = {
  description: (value) => {
    if (!value || value.trim().length < 10) {
      return 'Description must be at least 10 characters long'
    }
    if (value.length > 500) {
      return 'Description must be less than 500 characters'
    }
    return null
  },

  latitude: (value) => {
    if (!value) return 'Latitude is required'
    const num = parseFloat(value)
    if (isNaN(num) || num < -90 || num > 90) {
      return 'Latitude must be a valid number between -90 and 90'
    }
    return null
  },

  longitude: (value) => {
    if (!value) return 'Longitude is required'
    const num = parseFloat(value)
    if (isNaN(num) || num < -180 || num > 180) {
      return 'Longitude must be a valid number between -180 and 180'
    }
    return null
  },

  tags: (value) => {
    if (!value || value.length === 0) {
      return 'At least one tag is required'
    }
    if (value.length > 5) {
      return 'Maximum 5 tags allowed'
    }
    return null
  }
}