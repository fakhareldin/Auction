import prisma from '../config/database';

export class CategoryService {
  async getAllCategories() {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    // Return only parent categories with their children
    return categories.filter((cat) => !cat.parentId);
  }

  async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
        parent: true,
      },
    });
  }
}

export default new CategoryService();
