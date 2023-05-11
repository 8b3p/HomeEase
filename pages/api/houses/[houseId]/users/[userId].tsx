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
  if (req.method === "DELETE") {
    // handle delete request
    const { userId } = req.query;
    const { id: houseId } = house;
    if (house.users.length === 1) {
      await prisma.house.delete({ where: { id: houseId } });
      return res.status(200).json({ message: 'User removed from house' })
    }
    await prisma.house.update({
      where: { id: houseId },
      data: {
        users: { disconnect: { id: userId as string, }, },
      }
    })
    res.status(200).json({ message: 'User removed from house' })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default authMW(isPartOfHouse(handler));
