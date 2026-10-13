import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedDemoData(prisma: PrismaClient) {
  try {
    console.log('[Seed] Checking for demo admin user...');
    
    // Check if business exists
    let business = await prisma.business.findFirst({
      where: { name: 'HD Bakers' }
    });

    if (!business) {
      business = await prisma.business.create({
        data: {
          name: 'HD Bakers',
          type: 'Bakery & Cafe',
          location: 'Mumbai, India',
          phone: '+91 9876543210'
        }
      });
      console.log('[Seed] Created business: HD Bakers');
    }

    // Check if admin user exists
    let admin = await prisma.user.findUnique({
      where: { email: 'admin@hdbakers.com' }
    });

    const passwordHash = await bcrypt.hash('demo123', 10);

    if (!admin) {
      admin = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@hdbakers.com',
          passwordHash,
          role: 'ADMIN',
          businessId: business.id
        }
      });
      console.log('[Seed] Created admin: admin@hdbakers.com');
    }

    // Check if customer user exists
    const customer = await prisma.user.findUnique({
      where: { email: 'customer@hdbakers.com' }
    });

    if (!customer) {
      await prisma.user.create({
        data: {
          name: 'Demo Customer',
          email: 'customer@hdbakers.com',
          passwordHash,
          role: 'CUSTOMER',
          businessId: business.id
        }
      });
      console.log('[Seed] Created customer: customer@hdbakers.com');
    }

    // Check categories
    let dairy = await prisma.category.findFirst({
      where: { businessId: business.id, name: 'Dairy' }
    });
    if (!dairy) {
      dairy = await prisma.category.create({ data: { name: 'Dairy', businessId: business.id } });
    }

    let bakery = await prisma.category.findFirst({
      where: { businessId: business.id, name: 'Bakery' }
    });
    if (!bakery) {
      bakery = await prisma.category.create({ data: { name: 'Bakery', businessId: business.id } });
    }

    let meat = await prisma.category.findFirst({
      where: { businessId: business.id, name: 'Meat' }
    });
    if (!meat) {
      meat = await prisma.category.create({ data: { name: 'Meat', businessId: business.id } });
    }

    // Check storage locations
    let fridge = await prisma.storageLocation.findFirst({
      where: { businessId: business.id, name: 'Refrigerator 1' }
    });
    if (!fridge) {
      fridge = await prisma.storageLocation.create({
        data: {
          name: 'Refrigerator 1',
          type: 'Fridge',
          requiredMinTemperature: 2,
          requiredMaxTemperature: 5,
          currentTemperature: 4,
          businessId: business.id
        }
      });
    }

    let freezer = await prisma.storageLocation.findFirst({
      where: { businessId: business.id, name: 'Freezer 1' }
    });
    if (!freezer) {
      freezer = await prisma.storageLocation.create({
        data: {
          name: 'Freezer 1',
          type: 'Freezer',
          requiredMinTemperature: -18,
          requiredMaxTemperature: -15,
          currentTemperature: -14,
          businessId: business.id
        }
      });
    }

    // Check products
    const productCount = await prisma.product.count({
      where: { businessId: business.id }
    });

    if (productCount === 0) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const expired = new Date(today);
      expired.setDate(today.getDate() - 2);

      const safe = new Date(today);
      safe.setDate(today.getDate() + 15);

      const demoProducts = [
        {
          businessId: business.id,
          name: 'Amul Taaza Milk',
          categoryId: dairy.id,
          quantity: 12,
          unit: 'L',
          expiryDate: tomorrow,
          storageLocationId: fridge.id,
          riskLevel: 'HIGH'
        },
        {
          businessId: business.id,
          name: 'Whole Wheat Bread',
          categoryId: bakery.id,
          quantity: 4,
          unit: 'Loaves',
          expiryDate: expired,
          storageLocationId: fridge.id,
          riskLevel: 'CRITICAL'
        },
        {
          businessId: business.id,
          name: 'Chicken Breast',
          categoryId: meat.id,
          quantity: 15,
          unit: 'kg',
          expiryDate: tomorrow,
          storageLocationId: freezer.id,
          riskLevel: 'HIGH'
        },
        {
          businessId: business.id,
          name: 'Fresh Apples',
          categoryId: dairy.id,
          quantity: 20,
          unit: 'kg',
          expiryDate: safe,
          storageLocationId: fridge.id,
          riskLevel: 'LOW'
        }
      ];

      for (const prod of demoProducts) {
        await prisma.product.create({ data: prod });
      }
      console.log('[Seed] Created demo inventory products');
    }

    console.log('[Seed] Demo database seeding completed successfully.');
    return { success: true, adminEmail: 'admin@hdbakers.com' };
  } catch (error: any) {
    console.error('[Seed] Error during seeding:', error);
    return { success: false, error: error?.message };
  }
}
