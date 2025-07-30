import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { personalInfoSchema, resumeLinkSchema, resumeFileSchema } from '../utils/validate';
import { ZodError } from 'zod';

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getPersonalInfo = async (_: Request, res: Response) => {
  try {
    const info = await prisma.personalInfo.findFirst();
    res.json(info);
  } catch (error) {
    console.error('Error fetching personal info:', error);
    res.status(500).json({ message: 'Failed to fetch personal info' });
  }
};

export const updatePersonalInfo = async (req: Request, res: Response) => {
  try {
    // Validate input data - schema now handles transformation to strings
    const validatedData = personalInfoSchema.parse(req.body);

    const info = await prisma.personalInfo.upsert({
      where: { id: 1 },
      update: validatedData,
      create: { id: 1, ...validatedData },
    });
    res.json(info);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.issues // Use 'issues' instead of 'errors'
      });
    }
    console.error('Error updating personal info:', error);
    res.status(500).json({ message: 'Failed to update personal info' });
  }
};

export const uploadResume = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Validate file using schema
    const validatedFile = resumeFileSchema.parse({
      mimetype: file.mimetype,
      size: file.size,
      originalname: file.originalname
    });

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw', // For non-image files
          folder: 'portfolio/resume',
          public_id: `resume_${Date.now()}`,
          use_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    const uploadResult = result as any;
    
    // Update database
    const updatedInfo = await prisma.personalInfo.upsert({
      where: { id: 1 },
      update: {
        resumeUrl: uploadResult.secure_url,
        resumeType: 'file',
        resumeName: validatedFile.originalname,
        resumeSize: `${(validatedFile.size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date(),
      },
      create: {
        id: 1,
        resumeUrl: uploadResult.secure_url,
        resumeType: 'file',
        resumeName: validatedFile.originalname,
        resumeSize: `${(validatedFile.size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date(),
        // Default required fields
        name: '',
        title: '',
        bio: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: '',
      },
    });

    res.json({
      message: 'Resume uploaded successfully',
      resumeUrl: uploadResult.secure_url,
      resumeInfo: {
        fileName: validatedFile.originalname,
        fileSize: `${(validatedFile.size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date().toISOString(),
        resumeType: 'file'
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'File validation failed',
        errors: error.issues // Use 'issues' instead of 'errors'
      });
    }
    console.error('Resume upload error:', error);
    res.status(500).json({ 
      message: 'Failed to upload resume', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const addResumeLink = async (req: Request, res: Response) => {
  try {
    // Validate input data
    const { resumeUrl } = resumeLinkSchema.parse(req.body);

    // Update database
    const updatedInfo = await prisma.personalInfo.upsert({
      where: { id: 1 },
      update: {
        resumeUrl,
        resumeType: 'link',
        resumeName: 'Resume (Link)',
        resumeSize: null,
        uploadDate: new Date(),
      },
      create: {
        id: 1,
        resumeUrl,
        resumeType: 'link',
        resumeName: 'Resume (Link)',
        uploadDate: new Date(),
        // Default required fields
        name: '',
        title: '',
        bio: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: '',
      },
    });

    res.json({
      message: 'Resume link added successfully',
      resumeUrl,
      resumeInfo: {
        fileName: 'Resume (Link)',
        uploadDate: new Date().toISOString(),
        resumeType: 'link'
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Link validation failed',
        errors: error.issues // Use 'issues' instead of 'errors'
      });
    }
    console.error('Resume link error:', error);
    res.status(500).json({ message: 'Failed to add resume link' });
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  try {
    const personalInfo = await prisma.personalInfo.findFirst();
    
    if (personalInfo?.resumeUrl && personalInfo.resumeType === 'file') {
      try {
        // Extract public_id from Cloudinary URL to delete the file
        const urlParts = personalInfo.resumeUrl.split('/');
        const publicIdWithExtension = urlParts.slice(-2).join('/');
        const publicId = publicIdWithExtension.split('.')[0];
        
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      } catch (cloudinaryError) {
        console.error('Error deleting file from Cloudinary:', cloudinaryError);
        // Continue with database update even if Cloudinary deletion fails
      }
    }

    // Update database to remove resume info
    await prisma.personalInfo.update({
      where: { id: 1 },
      data: {
        resumeUrl: null,
        resumeType: null,
        resumeName: null,
        resumeSize: null,
        uploadDate: null,
      },
    });

    res.json({ message: 'Resume removed successfully' });
  } catch (error) {
    console.error('Resume deletion error:', error);
    res.status(500).json({ message: 'Failed to remove resume' });
  }
};