import { errorResponse } from "@/types/errorResponse";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "utils/PrismaClient";
import { corsMW } from "utils/middleware";

export type checkIfUserExistsResponse = boolean | { message: string };

export default corsMW(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<checkIfUserExistsResponse>
) {
  if (req.method === "POST") {
    try {
      const response = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });
      if (response) {
        res.status(200).json(true);
      }
      res.status(200).json(false);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
});
