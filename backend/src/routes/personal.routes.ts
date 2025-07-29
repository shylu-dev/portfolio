import { Router } from 'express';
import multer from 'multer';
import {
  getPersonalInfo,
  updatePersonalInfo,
  uploadResume,
  addResumeLink,
  deleteResume
} from '../controllers/personal.controller';
import { adminAuth } from '../middlewares/auth';

const router = Router();

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  }
});

// Public routes
router.get('/', getPersonalInfo);

// Admin routes
router.put('/', adminAuth, updatePersonalInfo);

// Resume management routes
router.post('/resume/upload', adminAuth, upload.single('resume'), uploadResume);
router.post('/resume/link', adminAuth, addResumeLink);
router.delete('/resume', adminAuth, deleteResume);

export default router;