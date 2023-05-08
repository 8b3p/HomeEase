import { NextApiRequest, NextApiResponse } from "next";
import { authMW, isPartOfHouse } from '@/utils/middleware';
import prisma from '@/utils/PrismaClient';
import { Session } from "next-auth";
import { House, User } from "@prisma/client";



const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  _session: Session,
  house: (House & { users: User[]; }) | null,
) => {
  if (req.method === 'GET') {
    res.status(200).json({ house })
  } else if (req.method === "PATCH" || req.method === "PUT") {
    // handle put request
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' })
    const updatedHouse = await prisma.house.update({ where: { id: house.id }, data: { name } })
    res.status(200).json({ house: updatedHouse })
  }
}

export default authMW(isPartOfHouse(handler));
