// // src/routes/admin.routes.ts
// import express from 'express';
// import bcrypt from 'bcryptjs';
// import { PrismaClient } from '@prisma/client';
// import { adminAuth } from '../middlewares/auth';
// import { z } from 'zod';

// const router = express.Router();
// const prisma = new PrismaClient();

// // Validation schema for password change
// const changePasswordSchema = z.object({
//   currentPassword: z.string().min(1, 'Current password is required'),
//   newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
// });

// // Initialize admin user if not exists
// const initializeAdmin = async () => {
//   try {
//     const existingAdmin = await prisma.adminAuth.findFirst();
    
//     if (!existingAdmin) {
//       const initialPassword = process.env.INITIAL_ADMIN_PASSWORD || '150703';
//       const hashedPassword = await bcrypt.hash(initialPassword, 10);
      
//       await prisma.adminAuth.create({
//         data: {
//           username: 'admin',
//           password: hashedPassword,
//         },
//       });
      
//       console.log('Admin user initialized with default password');
//     }
//   } catch (error) {
//     console.error('Error initializing admin user:', error);
//   }
// };

// // Initialize admin on startup
// initializeAdmin();

// // Change password endpoint
// router.post('/change-password', adminAuth, async (req, res) => {
//   try {
//     // Validate request body
//     const validation = changePasswordSchema.safeParse(req.body);
//     if (!validation.success) {
//       return res.status(400).json({
//         message: 'Validation failed',
//         errors: validation.error.errors,
//       });
//     }

//     const { currentPassword, newPassword } = validation.data;

//     // Get the current admin user
//     const admin = await prisma.adminAuth.findFirst();
//     if (!admin) {
//       return res.status(404).json({
//         message: 'Admin user not found',
//       });
//     }

//     // Check if current password is correct
//     const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
//     if (!isCurrentPasswordValid) {
//       return res.status(401).json({
//         message: 'Current password is incorrect',
//       });
//     }

//     // Check if new password is different from current
//     const isSamePassword = await bcrypt.compare(newPassword, admin.password);
//     if (isSamePassword) {
//       return res.status(400).json({
//         message: 'New password must be different from current password',
//       });
//     }

//     // Hash the new password
//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);

//     // Update the password in database
//     await prisma.adminAuth.update({
//       where: { id: admin.id },
//       data: {
//         password: hashedNewPassword,
//         updatedAt: new Date(),
//       },
//     });

//     res.json({
//       message: 'Password changed successfully',
//     });
//   } catch (error) {
//     console.error('Error changing password:', error);
//     res.status(500).json({
//       message: 'Internal server error',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
//     });
//   }
// });

// // Get admin info (optional endpoint for future use)
// router.get('/info', adminAuth, async (req, res) => {
//   try {
//     const admin = await prisma.adminAuth.findFirst({
//       select: {
//         id: true,
//         username: true,
//         lastLogin: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     if (!admin) {
//       return res.status(404).json({
//         message: 'Admin user not found',
//       });
//     }

//     res.json(admin);
//   } catch (error) {
//     console.error('Error fetching admin info:', error);
//     res.status(500).json({
//       message: 'Internal server error',
//     });
//   }
// });

// export default router;

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
        errors: validation.error.errors.map(err => ({
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
  } catch (error) {
    console.error('❌ Error in change-password endpoint:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
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
  } catch (error) {
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
  } catch (error) {
    console.error('Admin health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Database connection failed'
    });
  }
});

export default router;