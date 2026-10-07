import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database for Hackathon Demo Mode...');

  // 1. Create Business
  const business = await prisma.business.create({
    data: {
      name: 'HD Bakers',
      type: 'Bakery & Cafe',
      location: 'Mumbai, India',
      phone: '+91 9876543210'
    }
  });

  // 2. Create Users
  const passwordHash = await bcrypt.hash('demo123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@hdbakers.com',
      passwordHash,
      role: 'ADMIN',
      businessId: business.id
    }
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Demo Customer',
      email: 'customer@hdbakers.com',
      passwordHash,
      role: 'CUSTOMER',
      businessId: business.id
    }
  });

  // 3. Create Categories
  const dairyCategory = await prisma.category.create({ data: { name: 'Dairy', businessId: business.id } });
  const bakeryCategory = await prisma.category.create({ data: { name: 'Bakery', businessId: business.id } });
  const meatCategory = await prisma.category.create({ data: { name: 'Meat', businessId: business.id } });

  // 4. Create Storage Locations
  const fridge = await prisma.storageLocation.create({
    data: {
      name: 'Refrigerator 1',
      type: 'Fridge',
      requiredMinTemperature: 2,
      requiredMaxTemperature: 5,
      currentTemperature: 4,
      businessId: business.id
    }
  });

  const freezer = await prisma.storageLocation.create({
    data: {
      name: 'Freezer 1',
      type: 'Freezer',
      requiredMinTemperature: -18,
      requiredMaxTemperature: -15,
      currentTemperature: -14, // Slightly high to trigger alert
      businessId: business.id
    }
  });

  // 5. Create Products
  const today = new Date();
  
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  const expired = new Date();
  expired.setDate(today.getDate() - 2);
  
  const safe = new Date();
  safe.setDate(today.getDate() + 15);

  const productsToCreate = [
      {
        businessId: business.id,
        name: 'Amul Taaza Milk',
        categoryId: dairyCategory.id,
        quantity: 12,
        unit: 'L',
        expiryDate: tomorrow,
        storageLocationId: fridge.id,
        riskLevel: 'HIGH'
      },
      {
        businessId: business.id,
        name: 'Whole Wheat Bread',
        categoryId: bakeryCategory.id,
        quantity: 4,
        unit: 'Loaves',
        expiryDate: expired,
        storageLocationId: fridge.id,
        riskLevel: 'CRITICAL'
      },
      {
        businessId: business.id,
        name: 'Chicken Breast',
        categoryId: meatCategory.id,
        quantity: 15,
        unit: 'kg',
        expiryDate: tomorrow,
        storageLocationId: freezer.id,
        riskLevel: 'HIGH'
      },
      {
        businessId: business.id,
        name: 'Fresh Apples',
        categoryId: dairyCategory.id,
        quantity: 20,
        unit: 'kg',
        expiryDate: safe,
        storageLocationId: fridge.id,
        riskLevel: 'LOW'
      }
    ];
    
    for (const product of productsToCreate) {
      await prisma.product.create({ data: product });
    }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
