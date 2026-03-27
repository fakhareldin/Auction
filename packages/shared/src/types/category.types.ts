export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  icon?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export interface CategoryWithCount extends Category {
  listingsCount: number;
}
