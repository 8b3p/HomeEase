// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/utils/PrismaClient'
import { safeUser } from "@/utils/safeUser";
import isValidObjectId from "@/utils/isValidObjectId";
import { authMW, isPartOfHouse } from "@/utils/middleware";
import { House, User } from "@prisma/client";
import { Session } from "next-auth";


const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
  house: (House & { users: User[]; }) | null,
) => {
  if (req.method === "GET") {
    // Process a POST request
    const users = house.map((user) => {
      return {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        firstName: user.firstName,
        lastName: user.lastName,
        houseId: user.houseId,
      } as safeUser;
    });
    return res.status(200).json({ users });
  } else {
    // Handle any other HTTP method
    res
      .status(405)
      .json({ error: undefined, errorMessage: "Method not allowed" });
  }
}

export default authMW(isPartOfHouse(handler))
