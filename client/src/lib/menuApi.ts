import { api } from "./api";
import type {
  CategoryInput,
  FeaturedResponse,
  ItemInput,
  MenuCategory,
  MenuItem,
  MenuResponse,
} from "../types/menu";

export function fetchMenu() {
  return api<MenuResponse>("/menu");
}

export function fetchFeatured() {
  return api<FeaturedResponse>("/menu/featured");
}

export function createCategory(data: CategoryInput) {
  return api<{ category: MenuCategory }>("/menu/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCategory(id: string, data: Partial<CategoryInput>) {
  return api<{ category: MenuCategory }>(`/menu/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCategory(id: string) {
  return api<{ message: string }>(`/menu/categories/${id}`, {
    method: "DELETE",
  });
}

export function createItem(data: ItemInput) {
  return api<{ item: MenuItem }>("/menu/items", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateItem(id: string, data: Partial<ItemInput>) {
  return api<{ item: MenuItem }>(`/menu/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteItem(id: string) {
  return api<{ message: string }>(`/menu/items/${id}`, {
    method: "DELETE",
  });
}
