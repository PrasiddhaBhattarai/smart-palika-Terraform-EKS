// src/components/complaints/RatingModal.jsx
import React, { useState } from 'react'
import { FiStar, FiX, FiMessageSquare } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useComplaint } from '../../context/ComplaintContext'

const RatingModal = ({ complaint, onClose, onRate }) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { rateComplaint } = useComplaint()

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)
    try {
      await rateComplaint(complaint.id, rating, feedback)
      onRate()
      onClose()
    } catch (error) {
      console.error('Failed to submit rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-nepal-blue to-nepal-red p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">Rate Resolution Quality</h3>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <p className="text-blue-100 text-sm">
              Share your experience with this complaint resolution
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div>
              <p className="text-gray-700 mb-4 text-center">
                How satisfied are you with how your complaint was resolved?
              </p>
              
              {/* Star Rating */}
              <div className="flex justify-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`p-1.5 transform transition-all duration-200 ${
                      (hoverRating || rating) >= star
                        ? 'scale-110 text-amber-500'
                        : 'text-gray-300'
                    }`}
                  >
                    <FiStar 
                      className={`w-10 h-10 ${(hoverRating || rating) >= star ? 'fill-current' : ''}`} 
                    />
                  </button>
                ))}
              </div>

              {/* Rating Labels */}
              <div className="text-center">
                <p className="text-sm font-medium text-nepal-blue mb-1">
                  {rating === 0 && 'Select your rating'}
                  {rating === 1 && 'Poor - Very dissatisfied'}
                  {rating === 2 && 'Fair - Needs improvement'}
                  {rating === 3 && 'Good - As expected'}
                  {rating === 4 && 'Very Good - Exceeded expectations'}
                  {rating === 5 && 'Excellent - Outstanding service'}
                </p>
                <p className="text-xs text-gray-500">
                  {rating > 0 ? 'Click again to remove rating' : 'Click a star to rate'}
                </p>
              </div>
            </div>

            {/* Feedback */}
            <div>
              <div className="flex items-center mb-3">
                <FiMessageSquare className="text-nepal-blue mr-2" />
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                  Additional Feedback (Optional)
                </label>
              </div>
              <textarea
                id="feedback"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="form-textarea"
                placeholder="What did the municipality do well? How could they improve?..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Your feedback helps improve services for everyone
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-2">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors duration-300 border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="flex-1 bg-nepal-red hover:bg-red-700 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : 'Submit Rating'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default RatingModal