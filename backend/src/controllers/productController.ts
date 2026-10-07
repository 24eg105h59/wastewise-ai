import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const products = await prisma.product.findMany({
      where: { businessId: req.user.businessId },
      include: {
        category: true,
        storageLocation: true
      },
      orderBy: { expiryDate: 'asc' }
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get products' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { name, brand, categoryId, quantity, unit, expiryDate, riskLevel, storageLocationId } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        brand,
        categoryId,
        quantity,
        unit,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        riskLevel: riskLevel || 'LOW',
        storageLocationId,
        businessId: req.user.businessId
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id as string;
    const { expiryDate, quantity, riskLevel, name } = req.body;

    const dataToUpdate: any = {};
    if (expiryDate !== undefined) dataToUpdate.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (quantity !== undefined) dataToUpdate.quantity = quantity;
    if (riskLevel !== undefined) dataToUpdate.riskLevel = riskLevel;
    if (name !== undefined) dataToUpdate.name = name;

    const product = await prisma.product.update({
      where: { id, businessId: req.user.businessId as string },
      data: dataToUpdate
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id as string;

    await prisma.product.delete({
      where: { id, businessId: req.user.businessId as string }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
