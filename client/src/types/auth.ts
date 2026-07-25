export type UserRole = "CUSTOMER" | "ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  createdAt: string;
};

export type AuthResponse = {
  user: User;
};
