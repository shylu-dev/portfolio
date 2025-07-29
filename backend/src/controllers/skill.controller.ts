// src/controllers/skill.controller.ts
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getSkills = async (_: Request, res: Response) => {
  const skills = await prisma.skill.findMany();
  res.json(skills);
};

export const addSkill = async (req: Request, res: Response) => {
  try {
    const skill = await prisma.skill.create({ data: req.body });
    res.status(201).json(skill);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create skill', error: err });
  }
};

export const updateSkill = async (req: Request, res: Response) => {
  try {
    const skill = await prisma.skill.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(skill);
  } catch (err) {
    res.status(404).json({ message: 'Skill not found', error: err });
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    await prisma.skill.delete({ where: { id: req.params.id } });
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    res.status(404).json({ message: 'Skill not found', error: err });
  }
};

export const toggleFeaturedSkill = async (req: Request, res: Response) => {
  try {
    const skill = await prisma.skill.update({
      where: { id: req.params.id },
      data: { featured: req.body.featured },
    });
    res.json(skill);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update featured flag', error: err });
  }
};