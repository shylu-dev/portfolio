import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Token-based auth middleware (for API requests)
export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ message: 'Invalid admin token' });
  }

  next();
};

// Password-based authentication (for login)
export const authenticateAdmin = async (password: string): Promise<boolean> => {
  try {
    const admin = await prisma.adminAuth.findFirst();
    
    if (!admin) {
      // If no admin exists, check against env variable for initial setup
      const initialPassword = process.env.INITIAL_ADMIN_PASSWORD || '150703';
      if (password === initialPassword) {
        // Create admin user in database with this password
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.adminAuth.create({
          data: {
            username: 'admin',
            password: hashedPassword,
          },
        });
        console.log('✅ Admin user created during authentication');
        return true;
      }
      return false;
    }

    // Compare with hashed password in database
    return await bcrypt.compare(password, admin.password);
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
};

// Initialize admin user with hashed password
export const initializeAdminUser = async (): Promise<void> => {
  try {
    const existingAdmin = await prisma.adminAuth.findFirst();
    
    if (!existingAdmin) {
      const initialPassword = process.env.INITIAL_ADMIN_PASSWORD || '150703';
      const hashedPassword = await bcrypt.hash(initialPassword, 10);
      
      await prisma.adminAuth.create({
        data: {
          username: 'admin',
          password: hashedPassword,
        },
      });
      
      console.log('✅ Admin user initialized with hashed password');
      console.log(`📝 Initial password: ${initialPassword} (please change this after first login)`);
    } else {
      console.log('✅ Admin user already exists in database');
    }
  } catch (error) {
    console.error('❌ Error initializing admin user:', error);
  }
};

// Validate current password (helper function)
export const validateCurrentPassword = async (currentPassword: string): Promise<boolean> => {
  try {
    const admin = await prisma.adminAuth.findFirst();
    if (!admin) {
      // If no admin exists, check against the initial password
      const initialPassword = process.env.INITIAL_ADMIN_PASSWORD;
      return currentPassword === initialPassword;
    }
    return await bcrypt.compare(currentPassword, admin.password);
  } catch (error) {
    console.error('Password validation error:', error);
    return false;
  }
};

// Change password function
export const changeAdminPassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('🔍 Starting password change process...');
    
    let admin = await prisma.adminAuth.findFirst();
    
    if (!admin) {
      console.log('🔍 No admin found in database, checking initial password...');
      // If no admin exists, check against env variable for initial setup
      const initialPassword = process.env.INITIAL_ADMIN_PASSWORD || '150703';
      
      if (currentPassword !== initialPassword) {
        console.log('❌ Current password does not match initial password');
        return { success: false, message: 'Current password is incorrect' };
      }
      
      console.log('✅ Initial password verified, creating admin user...');
      // Create admin user in database with the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      admin = await prisma.adminAuth.create({
        data: {
          username: 'admin',
          password: hashedNewPassword,
        },
      });
      
      console.log('✅ Admin user created with new password');
      return { success: true, message: 'Password set successfully' };
    }

    console.log('🔍 Admin exists, verifying current password...');
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      console.log('❌ Current password verification failed');
      return { success: false, message: 'Current password is incorrect' };
    }

    console.log('✅ Current password verified');

    // Check if new password is different
    const isSamePassword = await bcrypt.compare(newPassword, admin.password);
    if (isSamePassword) {
      console.log('❌ New password is same as current password');
      return { success: false, message: 'New password must be different from current password' };
    }

    console.log('🔄 Updating password...');
    // Hash and update new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.adminAuth.update({
      where: { id: admin.id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    });

    console.log('✅ Password updated successfully');
    return { success: true, message: 'Password changed successfully' };
  } catch (error) {
    console.error('❌ Error changing password:', error);
    return { success: false, message: 'Failed to change password' };
  }
};

export { prisma };