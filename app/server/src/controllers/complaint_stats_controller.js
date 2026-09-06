import { query } from '../config/db.js';

export const getComplaintStats = async (req, res) => {
  try {
    const result = await query(`SELECT * FROM complaints`);
    const complaints = result.rows || [];

    const stats = {
      total: complaints.length,
      registered: complaints.filter(c => c.status === 'registered').length,
      inProgress: complaints.filter(c => 
        ['under_review', 'assigned', 'in_progress'].includes(c.status)
      ).length,
      resolved: complaints.filter(c => c.status === 'resolved').length
    };

    res.json({ success: true, stats });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({
      success: false,
      stats: { total: 0, registered: 0, inProgress: 0, resolved: 0 }
    });
  }
};
