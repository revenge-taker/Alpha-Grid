import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

export default router;
