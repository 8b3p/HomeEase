import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@utils/PrismaClient";
import { corsMW, authMW } from "@utils/middleware";
import { Session } from "next-auth";
import { hashPassword } from "@utils/passwordCrypt";

export interface UserPutRequestBody {
  name?: {
    firstname: string;
    lastname: string;
  };
  password?: {
    oldPassword?: string;
    newPassword: string;
  };
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
  if (req.method === "GET") {
    try {
      const userId = req.query.userId as string;
      if (userId !== session.user.id)
        return res.status(401).json({ message: "Unauthorized" });
      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });
      if (!user) return res.status(404).json({ message: "User not found" });
      const { password, salt, ...safeUser } = user;
      return res.status(200).json({ user: safeUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  } else if (req.method === "PUT" || req.method === "PATCH") {
    const userId = req.query.userId as string;
    if (userId !== session.user.id)
      return res.status(401).json({ message: "Unauthorized" });
    const { name, password } = req.body as UserPutRequestBody;
    if (!name && !password)
      return res.status(400).json({ message: "Bad Request" });
    try {
      /*
       let oldHashedPassword, newHashedPassword, newSalt;
      if (password) {
        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!password.oldPassword || !password.newPassword) return res.status(400).json({ message: "Bad Request" });
        const { hashedPassword: a, salt: b } = hashPassword(password.newPassword); newHashedPassword = a; newSalt = b
        const { hashedPassword: c } = hashPassword(password.oldPassword, user?.salt); oldHashedPassword = c;
        if (oldHashedPassword !== user?.password) return res.status(401).json({ message: "Wrong password" })
      }
      */

      let newHashedPassword, newSalt;
      if (password) {
        const { hashedPassword: a, salt: b } = hashPassword(
          password.newPassword
        );
        newHashedPassword = a;
        newSalt = b;
      }

      const user = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          firstName: name?.firstname,
          lastName: name?.lastname,
          password: newHashedPassword,
          salt: newSalt,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          houseId: true,
          email: true,
        },
      });
      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    // Handle any other HTTP method
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default corsMW(authMW(handler));
