// src/utils/constants.js
export const COMPLAINT_CATEGORIES = {
  "Roads & Transport": [
    "potholes",
    "illegal parking",
    "accident"
  ],
  "Sanitation": [
    "garbage",
    "open drains",
    "bad smell"
  ],
  "Water Supply": [
    "no water",
    "contaminated water"
  ],
  "Power": [
    "streetlight out",
    "power cuts"
  ],
  "Health": [
    "dead animals"
  ],
  "Environment": [
    "pollution",
    "noise complaints"
  ]
}

export const COMPLAINT_STATUS = {
  registered: { label: 'Registered', color: 'bg-blue-100 text-blue-800' },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800' },
  assigned: { label: 'Assigned', color: 'bg-purple-100 text-purple-800' },
  in_progress: { label: 'In Progress', color: 'bg-orange-100 text-orange-800' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-800' }
}

export const WARDS = Array.from({ length: 32 }, (_, i) => ({
  value: i + 1,
  label: `Ward ${i + 1}`
}))