import express from 'express';
import { PrismaClient } from '@prisma/client';
import { adminAuth, initializeAdminUser, changeAdminPassword } from '../middlewares/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schema for password change
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
});

// Initialize admin user on startup
initializeAdminUser();

// Change password endpoint
router.post('/change-password', adminAuth, async (req, res) => {
  try {
    // Validate request body
    const validation = changePasswordSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    const { currentPassword, newPassword } = validation.data;

    // Use the helper function from auth.ts
    const result = await changeAdminPassword(currentPassword, newPassword);
    
    if (!result.success) {
      return res.status(400).json({
        message: result.message
      });
    }

    // Log successful password change
    console.log('✅ Admin password changed successfully at', new Date().toISOString());

    res.json({
      message: result.message
    });
  } catch (error: unknown) {
    console.error('❌ Error in change-password endpoint:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : 'Something went wrong',
    });
  }
});

// Get admin info endpoint
router.get('/info', adminAuth, async (req, res) => {
  try {
    const admin = await prisma.adminAuth.findFirst({
      select: {
        id: true,
        username: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      return res.status(404).json({
        message: 'Admin user not found',
      });
    }

    res.json(admin);
  } catch (error: unknown) {
    console.error('Error fetching admin info:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Health check for admin system
router.get('/health', adminAuth, async (req, res) => {
  try {
    const adminCount = await prisma.adminAuth.count();
    res.json({
      status: 'healthy',
      adminUsersCount: adminCount,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    console.error('Admin health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Database connection failed'
    });
  }
});

export default router;