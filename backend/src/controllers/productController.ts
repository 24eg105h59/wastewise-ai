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

    const {
      name,
      brand,
      category,
      categoryId,
      categoryName,
      quantity,
      unit,
      price,
      expiryDate,
      manufacturingDate,
      riskLevel,
      storageLocationId,
      storageLocationName
    } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Product name is required' });
    }

    let finalCategoryId = categoryId || null;
    const catName = categoryName || category;
    if (!finalCategoryId && catName) {
      let existingCat = await prisma.category.findFirst({
        where: { businessId: req.user.businessId, name: catName }
      });
      if (!existingCat) {
        existingCat = await prisma.category.create({
          data: { businessId: req.user.businessId, name: catName }
        });
      }
      finalCategoryId = existingCat.id;
    }

    let finalStorageId = storageLocationId || null;
    const storeName = storageLocationName;
    if (!finalStorageId && storeName) {
      let existingStorage = await prisma.storageLocation.findFirst({
        where: { businessId: req.user.businessId, name: storeName }
      });
      if (!existingStorage) {
        existingStorage = await prisma.storageLocation.create({
          data: {
            businessId: req.user.businessId,
            name: storeName,
            type: storeName.toLowerCase().includes('freezer') ? 'Freezer' : storeName.toLowerCase().includes('fridge') ? 'Fridge' : 'Shelf'
          }
        });
      }
      finalStorageId = existingStorage.id;
    }

    const parsedQty = parseFloat(quantity) || 1;
    const parsedPrice = price !== undefined && price !== '' ? parseFloat(price) : 150;

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        brand: brand ? String(brand).trim() : 'Unknown',
        categoryId: finalCategoryId,
        quantity: parsedQty,
        unit: unit || 'units',
        price: parsedPrice,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        manufacturingDate: manufacturingDate ? new Date(manufacturingDate) : null,
        riskLevel: riskLevel || 'LOW',
        storageLocationId: finalStorageId,
        businessId: req.user.businessId
      },
      include: {
        category: true,
        storageLocation: true
      }
    });

    res.status(201).json(product);
  } catch (error: any) {
    console.error('Failed to create product:', error);
    res.status(500).json({ error: error?.message || 'Failed to create product' });
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
