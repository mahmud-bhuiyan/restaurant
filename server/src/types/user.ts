export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  address: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = Omit<IUser, "passwordHash">;

export function toSafeUser(user: IUser): SafeUser {
  const { passwordHash: _, ...safe } = user;
  return {
    ...safe,
    id: user._id.toString(),
  } as SafeUser & { id: string };
}
