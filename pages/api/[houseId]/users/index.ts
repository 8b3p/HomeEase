// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/utils/PrismaClient'
import { useRouter } from "next/router";
import { safeUser } from "@/utils/safeUser";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request
    const houseId = <string>req.query.houseId;
    console.log(houseId)
    // get all users belonging to a house
    const houseWithUsers = await prisma.house.findUnique({
      where: {
        id: houseId,
      },
      select: {
        users: true,
      },
    });
    if (houseWithUsers === null) {
      return res.status(404).json({ error: "House not found" });
    }
    const users = houseWithUsers?.users.map((user) => {
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
