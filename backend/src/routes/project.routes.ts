import { Router } from 'express';
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  toggleFeaturedProject
} from '../controllers/project.controller';
import { adminAuth } from '../middlewares/auth';

const router = Router();

// Public routes
router.get('/', getProjects);

// Admin routes
router.post('/', adminAuth, addProject);
router.put('/:id', adminAuth, updateProject);
router.delete('/:id', adminAuth, deleteProject);
router.patch('/:id/featured', adminAuth, toggleFeaturedProject);

export default router;