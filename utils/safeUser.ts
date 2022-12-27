import { User } from "@prisma/client";

export type safeUser = Omit<User, "password" | "salt">;

export function getSafeUser(user: User) {
  const { password, salt, createdAt, updatedAt, houseId, id, ...safeUser } =
    user;
  return safeUser;
}
