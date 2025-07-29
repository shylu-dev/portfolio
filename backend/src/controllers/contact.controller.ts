import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { sendEmail } from '../utils/email';

const prisma = new PrismaClient();

export const getMessages = async (_: Request, res: Response) => {
  try {
    const messages = await prisma.contactMessage.findMany({ 
      orderBy: { timestamp: 'desc' } 
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages', error });
  }
};

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString(),
        read: false,
      },
    });

    // Send notification email to admin (optional)
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await sendEmail(
          adminEmail,
          `New Contact Message: ${subject}`,
          `New message from ${name} (${email}):\n\n${message}`,
          `
            <h3>New Contact Message</h3>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        );
      }
    } catch (emailError) {
      console.warn('Failed to send admin notification email:', emailError);
    }

    res.status(201).json(contactMessage);
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Failed to submit contact form', error });
  }
};

export const toggleReadMessage = async (req: Request, res: Response) => {
  try {
    const { read } = req.body;
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { read },
    });
    res.json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(404).json({ message: 'Message not found', error });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    await prisma.contactMessage.delete({ 
      where: { id: req.params.id } 
    });
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(404).json({ message: 'Message not found', error });
  }
};

// New function to reply to messages via email
export const replyToMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { replyMessage, subject } = req.body;

    if (!replyMessage || !subject) {
      return res.status(400).json({ 
        message: 'Reply message and subject are required' 
      });
    }

    // Get the original message
    const originalMessage = await prisma.contactMessage.findUnique({
      where: { id }
    });

    if (!originalMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Send reply email
    const emailSent = await sendEmail(
      originalMessage.email,
      subject,
      replyMessage,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for reaching out!</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${replyMessage.replace(/\n/g, '<br>')}
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; font-size: 14px; color: #666;">
            <h4 style="margin: 0 0 10px 0; color: #333;">Your original message:</h4>
            <p><strong>Subject:</strong> ${originalMessage.subject}</p>
            <p><strong>Message:</strong> ${originalMessage.message}</p>
            <p><strong>Sent:</strong> ${new Date(originalMessage.timestamp).toLocaleString()}</p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
            <p>This email was sent in response to your message through our contact form.</p>
          </div>
        </div>
      `
    );

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send email reply' });
    }

    // Mark message as read
    await prisma.contactMessage.update({
      where: { id },
      data: { read: true }
    });

    res.json({ 
      message: 'Reply sent successfully',
      emailSent: true 
    });
  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).json({ message: 'Failed to send reply', error });
  }
};