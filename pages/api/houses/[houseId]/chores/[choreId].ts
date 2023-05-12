import { NextApiRequest, NextApiResponse } from "next";
import { authMW, isPartOfHouse } from '@/utils/middleware';
import prisma from '@/utils/PrismaClient';
import { Session } from "next-auth";
import { ChoreType, House, User } from "@prisma/client";
import isValidObjectId from "@/utils/isValidObjectId";

export interface ChoreIdPutBody {
  title: string;
  description: string;
  type: ChoreType;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  _session: Session,
  house: (House & { users: User[]; }),
) => {
  const choreId = req.query.choreId as string;
  if (!isValidObjectId(choreId)) return res.status(400).json({ message: 'Invalid chore id' })

  if (req.method === "DELETE") {
    const deletedChore = await prisma.chore.delete({
      where: {
        id: choreId
      }
    })
    return res.status(200).json({ chore: deletedChore })
  }

  const chore = await prisma.chore.findUnique({
    where: {
      id: choreId
    },
  })
  if (!chore) return res.status(404).json({ message: 'Chore not found' })
  if (chore.owner !== house.id) return res.status(403).json({ message: 'Forbidden' })

  if (req.method === 'GET') {
    return res.status(200).json({ chore })
  } else
    if (req.method === "PATCH" || req.method === "PUT") {
      const { title, description, type } = req.body as ChoreIdPutBody;
      const updatedChore = await prisma.chore.update({
        where: {
          id: choreId
        },
        data: {
          title,
          description,
          type
        }
      })
      return res.status(200).json({ chore: updatedChore })
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
}

export default authMW(isPartOfHouse(handler));
