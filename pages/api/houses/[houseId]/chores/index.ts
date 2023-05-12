import { NextApiRequest, NextApiResponse } from "next";
import { authMW, isPartOfHouse } from '@/utils/middleware';
import prisma from '@/utils/PrismaClient';
import { Session } from "next-auth";
import { House, User } from "@prisma/client";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  _session: Session,
  house: (House & { users: User[]; }),
) => {
  if (req.method === 'GET') {
    const chores = await prisma.chore.findMany({
      where: { OR: [{ owner: house.id, }, { owner: null, },] },
    })
    res.status(200).json({ chores })
  } else if (req.method === "POST") {
    const { title, description, type } = req.body;
    const chore = await prisma.chore.create({
      data: {
        title,
        description,
        type,
        Owner: { connect: { id: house.id } },
      },
    })
    res.status(200).json({ chore })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default authMW(isPartOfHouse(handler));
