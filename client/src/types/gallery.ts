export type GalleryImage = {
  id: string;
  imageUrl: string;
  caption: string;
  sortOrder: number;
  createdAt?: string;
};

export type GalleryImageInput = {
  imageUrl: string;
  caption?: string;
  sortOrder?: number;
};
