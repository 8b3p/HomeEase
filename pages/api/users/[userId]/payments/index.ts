import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/PrismaClient";
import { corsMW, authMW } from "@/utils/middleware";
import { Session } from "next-auth";
import { Status } from "@prisma/client";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
  if (req.method === "GET") {
    try {
      const userId = req.query.userId as string;
      const status = req.query.status as Status | undefined;
      const payments = await prisma.payment.findMany({
        where: {
          OR: [
            { recipientId: session.user.id, payerId: userId, },
            { payerId: session.user.id, recipientId: userId, },
          ],
          status: status,
        },
      });
      return res.status(200).json({ payments });
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
