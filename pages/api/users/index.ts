// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { authMW, corsMW } from "@/utils/middleware";
import { hashPassword } from "@/utils/passwordCrypt";
import prisma from "@/utils/PrismaClient";
import type { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

interface UserPutRequestBody {
  name?: {
    firstname: string,
    lastname: string
  }
  password?: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
  if (req.method === "PUT" || req.method === "PATCH") {
    const userId = req.query.userId as string;
    if (userId !== session.user.id) return res.status(401).json({ message: "Unauthorized" });
    const { name, password } = req.body as UserPutRequestBody;
    if (!name && !password) return res.status(400).json({ message: "Bad Request" });
    try {
      let hashedPassword, salt;
      if (password) { const { hashedPassword: a, salt: b } = hashPassword(password); hashedPassword = a; salt = b }
      const user = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          firstName: name?.firstname,
          lastName: name?.lastname,
          password: hashedPassword,
          salt: salt
        }
      })
      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    // Handle any other HTTP method
    res
      .status(405)
      .json({ message: "Method not allowed" });
  }
}

export default corsMW(authMW(handler));
