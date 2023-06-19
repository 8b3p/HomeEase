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
          email: (req.body.email as string).trim().toLowerCase()
        },
      });
      if (response) {
        return res.status(200).json(true);
      }
      return res.status(200).json(false);
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
});
