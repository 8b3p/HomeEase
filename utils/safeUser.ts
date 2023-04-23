import { User } from "@prisma/client";

export type safeUser = Omit<User, "password" | "salt" | "updatedAt">;

export function getSafeUser(user: User) {
  const { password, salt, updatedAt, ...safeUser } =
    user;
  return safeUser;
}
