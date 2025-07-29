import { Router } from 'express';
import {
  submitContactForm,
  getMessages,
  toggleReadMessage,
  deleteMessage,
  replyToMessage
} from '../controllers/contact.controller';
import { adminAuth } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/submit', submitContactForm);

// Admin routes
router.get('/', adminAuth, getMessages);
router.patch('/:id/read', adminAuth, toggleReadMessage);
router.delete('/:id', adminAuth, deleteMessage);
router.post('/:id/reply', adminAuth, replyToMessage); 

export default router;