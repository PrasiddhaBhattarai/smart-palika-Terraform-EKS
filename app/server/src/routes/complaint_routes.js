//server/src/routes/complaint_routes.js
import express from "express";
import { authMiddleware } from "../middlewares/auth_middleware.js";
import { isRoleAdmin } from "../middlewares/admin_middleware.js";
import {isRoleUser} from "../middlewares/user_middleware.js"
import { checkSimilarComplaints } from "../middlewares/check_similar_complaints.js";
import { restoreDraftIfNeeded } from "../middlewares/restore_Complaint_draft.js";
import upload from "../middlewares/multer_upload.js";
import { compressImage } from "../middlewares/compress_image.js";
import { query as db } from '../config/db.js'; 
// import { getComplaintStats } from "../controllers/complaint_stats_controller.js";
import {
    file_complaint,
    delete_complaint,
    update_status,
    escalate_to_municipality,
    rate_complaint
    // support_complaint //yo thapeko aaja
} from "../controllers/complaint_file_controller.js"
import {
    get_single_complaint_by_user,
    get_complaints_by_user,
    get_complaints_by_location,
    get_single_complaint_by_id
} from "../controllers/complaint_view_controller.js";


const router = express.Router();

router.post(
    "/file",
    authMiddleware,
    isRoleUser,
    upload.single('image'),
    compressImage,
    checkSimilarComplaints,
    restoreDraftIfNeeded,
    file_complaint
);

router.delete("/:id", authMiddleware, isRoleUser, delete_complaint);

router.patch("/update-status/:id", authMiddleware, isRoleAdmin, update_status);

router.post("/escalate/:id", authMiddleware, isRoleAdmin, escalate_to_municipality);


router.patch("/rate/:id", authMiddleware, isRoleUser, rate_complaint);

// for view_complaints

// Get a single complaint filed by the currently logged-in user
router.get('/user/:id', authMiddleware, get_single_complaint_by_user);

// Get multiple complaints filed by user (admin can pass ?id=USER_ID)
// Example: /api/complaint/user?page=1&limit=5&order=asc&status=resolved
router.get('/user', authMiddleware, get_complaints_by_user);

// Get complaints by location (ward or palika)
// Example: /api/complaint/location?ward_id=2&status=pending&tags=road,electricity&order=desc&page=1&limit=5
router.get('/location', authMiddleware, get_complaints_by_location);

// Get complaint by ID (admin sees all fields, user doesn't see user_ids)
router.get('/:id', authMiddleware, get_single_complaint_by_id);
// In complaint_routes.js

router.get('/:id/average-rating', authMiddleware, async (req, res) => {
  const complaintId = req.params.id;

  try {
    const result = await db(
      `SELECT AVG(rating) as average_rating, COUNT(rating) as total_ratings 
       FROM complaint_supporters 
       WHERE complaint_id = $1 AND rating IS NOT NULL`,
      [complaintId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: 'No ratings found' });
    }

    res.json({ 
      success: true, 
      average_rating: parseFloat(result.rows[0].average_rating || 0).toFixed(2), 
      total_ratings: result.rows[0].total_ratings 
    });
  } catch (err) {
    console.error('Average rating fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// router.get('/stats', authMiddleware, async (req, res) => {
//   try {
//     const result = await query('SELECT status FROM complaints');
//     const complaints = result.rows;

//     const stats = {
//       total: complaints.length,
//       registered: complaints.filter(c => c.status === 'registered').length,
//       inProgress: complaints.filter(c => ['under_review','assigned','in_progress'].includes(c.status)).length,
//       resolved: complaints.filter(c => c.status === 'resolved').length
//     };

//     res.json({ success: true, stats });
//   } catch (err) {
//     console.error('Error fetching stats:', err);
//     res.status(500).json({ success: false, message: 'Server error', stats: { total: 0, registered: 0, inProgress: 0, resolved: 0 } });
//   }
// });

// router.post('/support/:id', authMiddleware, isRoleUser, support_complaint);



export default router;