import { errorResponse } from "@/types/errorResponse";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "utils/PrismaClient";

export type checkIfUserExistsResponse = boolean | errorResponse;

export default async function handler(
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
      res.status(201).json(response !== null);
    } catch (e: any) {
      res.status(500).json({ error: e, errorMessage: e.message });
    }
  } else {
    res.status(405).json({ error: null, errorMessage: "Method not allowed" });
  }
}
