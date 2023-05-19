import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/utils/PrismaClient';
import { authMW } from '@/utils/middleware';
import { Session } from "next-auth";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  if (req.method === 'GET') {
    try {
      const userId = req.query.userId as string;
      if (userId !== session.user.id) return res.status(401).json({ message: "Unauthorized" })
      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });
      if (!user) return res.status(404).json({ message: "User not found" })
      const { password, salt, ...safeUser } = user
      return res.status(200).json({ user: safeUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    // Handle any other HTTP method
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default authMW(handler);
