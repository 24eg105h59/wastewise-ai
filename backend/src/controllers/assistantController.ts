import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { aiService, ChatMessage, BusinessContext } from '../services/AIService';

const prisma = new PrismaClient();

export const chatWithAssistant = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Fetch live business and user context from database
    const businessId = req.user.businessId;
    const [business, dbUser] = await Promise.all([
      prisma.business.findUnique({ where: { id: businessId } }),
      prisma.user.findUnique({ where: { id: req.user.userId } })
    ]);

    const products = await prisma.product.findMany({
      where: { businessId },
      include: { category: true, storageLocation: true },
      orderBy: { expiryDate: 'asc' }
    });

    const tasks = await prisma.task.findMany({
      where: { businessId, status: { in: ['PENDING', 'IN_PROGRESS'] } },
      take: 6,
      orderBy: { createdAt: 'desc' }
    });

    const wasteRecords = await prisma.wasteRecord.findMany({
      where: { businessId },
      take: 20
    });

    const now = new Date();
    const getDaysDiff = (dateStr: any) => {
      if (!dateStr) return 999;
      const d = new Date(dateStr);
      return Math.ceil((d.getTime() - now.getTime()) / (1000 * 3600 * 24));
    };

    const expiringSoon = products.filter(p => {
      const diff = getDaysDiff(p.expiryDate);
      return diff >= 0 && diff <= 3;
    }).map(p => `${p.name} (${p.quantity} ${p.unit || 'units'}, exp: ${p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : 'soon'})`);

    const expired = products.filter(p => {
      const diff = getDaysDiff(p.expiryDate);
      return diff < 0;
    }).map(p => `${p.name} (expired ${Math.abs(getDaysDiff(p.expiryDate))} days ago)`);

    const activeSummary = products.map(p => 
      `${p.name} [${p.category?.name || 'General'}] - ${p.quantity} ${p.unit || 'units'} in ${p.storageLocation?.name || 'storage'}`
    );

    const pendingTaskSummaries = tasks.map(t => 
      `[${t.priority}] ${t.title}${t.assignedTo ? ` (Assigned: ${t.assignedTo})` : ''}`
    );

    const totalWasteLoss = wasteRecords.reduce((sum, r) => sum + (parseFloat(r.estimatedValue as any) || 0), 0);

    const businessContext: BusinessContext = {
      businessName: business?.name || 'HD Bakers',
      userName: dbUser?.name || (req.user.role === 'ADMIN' ? 'Admin' : 'Kitchen Staff'),
      userRole: req.user.role || 'Staff',
      totalProducts: products.length,
      expiringSoonProducts: expiringSoon,
      expiredProducts: expired,
      activeProductsSummary: activeSummary,
      pendingTasks: pendingTaskSummaries,
      totalWasteLoss
    };

    const reply = await aiService.generateChatReply(messages as ChatMessage[], businessContext);

    res.json({
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[AssistantController] Error handling chat:', error);
    res.status(500).json({ 
      error: 'Failed to generate assistant response',
      details: error?.message 
    });
  }
};
