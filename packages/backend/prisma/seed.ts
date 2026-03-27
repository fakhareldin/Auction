import { PrismaClient } from '@prisma/client';
import { INITIAL_CATEGORIES } from '@haraj/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing categories
  await prisma.category.deleteMany({});
  console.log('✅ Cleared existing categories');

  // Seed categories
  for (const mainCategory of INITIAL_CATEGORIES) {
    const { children, ...mainCategoryData } = mainCategory;

    const createdCategory = await prisma.category.create({
      data: {
        ...mainCategoryData,
        isActive: true,
      },
    });

    console.log(`✅ Created main category: ${createdCategory.nameEn}`);

    // Create subcategories
    if (children && children.length > 0) {
      for (const child of children) {
        const createdChild = await prisma.category.create({
          data: {
            ...child,
            parentId: createdCategory.id,
            isActive: true,
          },
        });

        console.log(`  └─ Created subcategory: ${createdChild.nameEn}`);
      }
    }
  }

  const categoryCount = await prisma.category.count();
  console.log(`\n🎉 Seeding completed! Created ${categoryCount} categories.`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
