import { NextApiRequest, NextApiResponse } from "next";
import { authMW, isPartOfHouse } from '@/utils/middleware';
import prisma from '@/utils/PrismaClient';
import { Session } from "next-auth";
import { House, User } from "@prisma/client";

export interface ChorePostBody {
  choreId: string;
  userId: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  _session: Session,
  house: (House & { users: User[]; }),
) => {
  if (req.method === 'GET') {
    const choreAssignments = await prisma.choreAssignment.findMany({
      where: {
        houseId: house.id,
      }
    })
    res.status(200).json({ choreAssignments })
  } else if (req.method === "POST") {
    const { choreId, userId } = req.body as ChorePostBody;
    const chore = await prisma.chore.findMany({
      where: {
        AND: [
          { id: choreId },
          {
            OR: [
              { owner: house.id },
              { owner: null },
            ]
          }
        ]
      }
    })
    if (!chore) return res.status(404).json({ message: 'Chore not found' })

    const choreAssignment = await prisma.choreAssignment.create({
      data: {
        Chore: { connect: { id: choreId, } },
        User: { connect: { id: userId, } },
        House: { connect: { id: house.id, } },
        status: "Pending"
      }
    })
    res.status(200).json({ choreAssignment })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default authMW(isPartOfHouse(handler));
