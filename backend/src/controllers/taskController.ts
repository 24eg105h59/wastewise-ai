import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const tasks = await prisma.task.findMany({
      where: { businessId: req.user.businessId },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { title, description, assignedTo, priority, dueDate } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedTo: assignedTo || null,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        businessId: req.user.businessId,
        status: 'PENDING'
      },
      include: { user: true }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id as string;
    const { status } = req.body;

    // Auto-delete if completed
    if (status === 'COMPLETED') {
      await prisma.task.delete({
        where: { id, businessId: req.user.businessId }
      });
      return res.json({ success: true, deleted: true });
    }

    const task = await prisma.task.update({
      where: { id, businessId: req.user.businessId },
      data: { status }
    });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id as string;

    await prisma.task.delete({
      where: { id, businessId: req.user.businessId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
