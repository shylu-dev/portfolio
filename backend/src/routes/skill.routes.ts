import { Router } from 'express';
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  toggleFeaturedSkill
} from '../controllers/skill.controller';
import { adminAuth } from '../middlewares/auth';

const router = Router();

// Public routes
router.get('/', getSkills);

// Admin routes
router.post('/', adminAuth, addSkill);
router.put('/:id', adminAuth, updateSkill);
router.delete('/:id', adminAuth, deleteSkill);
router.patch('/:id/featured', adminAuth, toggleFeaturedSkill);

export default router;