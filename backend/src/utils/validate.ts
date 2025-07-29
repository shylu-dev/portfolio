import { z } from 'zod';

export const personalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  bio: z.string().min(1, 'Bio is required').max(1000, 'Bio is too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required').max(20, 'Phone is too long'),
  location: z.string().min(1, 'Location is required').max(100, 'Location is too long'),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
  image: z.string().min(1, 'Image/emoji is required').max(10, 'Image is too long'),
  techStack: z.array(z.string().min(1, 'Tech stack item cannot be empty')).min(1, 'At least one technology is required'),
  demoLink: z.string().url('Invalid demo URL').optional().or(z.literal('')),
  githubLink: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
});

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(50, 'Skill name is too long'),
  icon: z.string().min(1, 'Icon is required').max(100, 'Icon class is too long'),
  featured: z.boolean().default(false),
});

export const contactMessageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email format'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message is too long'),
});

export const toggleFeaturedSchema = z.object({
  featured: z.boolean(),
});

export const toggleReadSchema = z.object({
  read: z.boolean(),
});

export const resumeLinkSchema = z.object({
  resumeUrl: z.string()
    .url('Invalid URL format')
    .min(1, 'Resume URL is required')
    .max(500, 'URL is too long')
    .refine(
      (url) => {
        // Allow common resume hosting platforms
        const allowedDomains = [
          'drive.google.com',
          'dropbox.com',
          'onedrive.live.com',
          'docs.google.com',
          'github.com',
          'gitlab.com',
          'bitbucket.org',
          'amazonaws.com',
          'cloudinary.com',
          'res.cloudinary.com'
        ];
        
        try {
          const urlObj = new URL(url);
          return allowedDomains.some(domain => 
            urlObj.hostname.includes(domain) || 
            urlObj.hostname.endsWith(domain)
          );
        } catch {
          return false;
        }
      },
      {
        message: 'Please use a link from supported platforms (Google Drive, Dropbox, OneDrive, GitHub, etc.)'
      }
    )
});

// Schema for file upload validation (used in controller)
export const resumeFileSchema = z.object({
  mimetype: z.enum([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ], {
    errorMap: () => ({ message: 'Only PDF and Word documents are allowed' })
  }),
  size: z.number()
    .max(5 * 1024 * 1024, 'File size must be less than 5MB')
    .min(1, 'File cannot be empty'),
  originalname: z.string()
    .min(1, 'Filename is required')
    .max(255, 'Filename is too long')
    .refine(
      (name) => {
        // Check for valid file extensions
        const validExtensions = ['.pdf', '.doc', '.docx'];
        return validExtensions.some(ext => 
          name.toLowerCase().endsWith(ext)
        );
      },
      {
        message: 'File must have a valid extension (.pdf, .doc, .docx)'
      }
    )
});

// Schema for resume reply/email functionality (if you implement it later)
export const resumeReplySchema = z.object({
  replyMessage: z.string()
    .min(1, 'Reply message is required')
    .max(2000, 'Reply message is too long'),
  subject: z.string()
    .min(1, 'Subject is required')
    .max(200, 'Subject is too long')
    .default('Re: Resume Review')
});