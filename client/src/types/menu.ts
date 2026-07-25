export type MenuItem = {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  tags: string[];
};

export type MenuCategory = {
  id: string;
  name: string;
  sortOrder: number;
  items?: MenuItem[];
};

export type MenuResponse = {
  categories: MenuCategory[];
  items: MenuItem[];
};

export type FeaturedResponse = {
  items: MenuItem[];
};

export type CategoryInput = {
  name: string;
  sortOrder?: number;
};

export type ItemInput = {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  tags?: string[];
};
