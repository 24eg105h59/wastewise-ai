import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getWasteRecords = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const records = await prisma.wasteRecord.findMany({
      where: { businessId: req.user.businessId },
      include: {
        product: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(records);
  } catch (error) {
    console.error('Error fetching waste records:', error);
    res.status(500).json({ error: 'Failed to fetch waste records' });
  }
};

export const createWasteRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { productId, productName, quantity, reason, estimatedValue, notes, removeProduct } = req.body;

    let targetProductId = productId;

    // If productId is not provided but productName is, find or create dummy product
    if (!targetProductId && productName) {
      const existing = await prisma.product.findFirst({
        where: { businessId: req.user.businessId, name: productName }
      });
      if (existing) {
        targetProductId = existing.id;
      } else {
        const newProd = await prisma.product.create({
          data: {
            businessId: req.user.businessId,
            name: productName,
            quantity: 0,
            riskLevel: 'CRITICAL',
            unit: 'units'
          }
        });
        targetProductId = newProd.id;
      }
    }

    if (!targetProductId) {
      return res.status(400).json({ error: 'Product is required to log waste' });
    }

    const qty = parseFloat(quantity) || 1;
    const estVal = estimatedValue !== undefined && estimatedValue !== '' 
      ? parseFloat(estimatedValue) 
      : (qty * 150);

    const wasteRecord = await prisma.wasteRecord.create({
      data: {
        businessId: req.user.businessId,
        productId: targetProductId,
        quantity: qty,
        reason: reason || 'Expired',
        estimatedValue: estVal,
        notes: notes || null
      },
      include: {
        product: {
          include: { category: true }
        }
      }
    });

    // If requested, decrement inventory or mark empty
    if (removeProduct !== false) {
      const product = await prisma.product.findUnique({
        where: { id: targetProductId, businessId: req.user.businessId }
      });
      if (product) {
        const remainingQty = Math.max(0, product.quantity - qty);
        await prisma.product.update({
          where: { id: targetProductId },
          data: {
            quantity: remainingQty,
            riskLevel: remainingQty === 0 ? 'CRITICAL' : product.riskLevel
          }
        });
      }
    }

    res.status(201).json(wasteRecord);
  } catch (error: any) {
    console.error('Error logging waste:', error);
    res.status(500).json({ error: error?.message || 'Failed to log waste' });
  }
};
