import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { aiService } from '../services/AIService';

const prisma = new PrismaClient();

export const analyzeImage = async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    console.log("Analyze image called with URL length:", imageUrl.length);

    // Call AI Service
    const analysisResult = await aiService.analyzeFoodImage(imageUrl);

    // Save scan record
    const scan = await prisma.scan.create({
      data: {
        businessId: req.user.businessId,
        userId: req.user.userId,
        imageUrl,
        status: 'COMPLETED',
        analysisResult: JSON.stringify(analysisResult),
      }
    });

    res.json({
      scanId: scan.id,
      analysis: analysisResult
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
};

export const getAiHealth = async (req: Request, res: Response) => {
  try {
    const health = await aiService.checkHealth();
    res.json(health);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error?.message });
  }
};
