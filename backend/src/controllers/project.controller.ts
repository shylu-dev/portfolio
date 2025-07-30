import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { projectSchema, toggleFeaturedSchema } from '../utils/validate';
import { ZodError } from 'zod';

const prisma = new PrismaClient();

export const getProjects = async (_: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      message: 'Failed to fetch projects', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const addProject = async (req: Request, res: Response) => {
  try {
    // Schema handles transformation of optional fields to empty strings
    const validatedData = projectSchema.parse(req.body);
    const project = await prisma.project.create({ 
      data: validatedData 
    });
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.issues 
      });
    }
    console.error('Error creating project:', error);
    res.status(500).json({ 
      message: 'Failed to create project', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    // Schema handles transformation of optional fields to empty strings
    const validatedData = projectSchema.partial().parse(req.body);
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: validatedData,
    });
    res.json(project);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.issues 
      });
    }
    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ message: 'Project not found' });
    }
    console.error('Error updating project:', error);
    res.status(500).json({ 
      message: 'Failed to update project', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    await prisma.project.delete({ 
      where: { id: req.params.id } 
    });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ message: 'Project not found' });
    }
    console.error('Error deleting project:', error);
    res.status(500).json({ 
      message: 'Failed to delete project', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const toggleFeaturedProject = async (req: Request, res: Response) => {
  try {
    const { featured } = toggleFeaturedSchema.parse(req.body);
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { featured },
    });
    res.json(project);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.issues 
      });
    }
    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ message: 'Project not found' });
    }
    console.error('Error updating featured status:', error);
    res.status(500).json({ 
      message: 'Failed to update featured status', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};