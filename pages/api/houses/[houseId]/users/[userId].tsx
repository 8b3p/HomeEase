import { NextApiRequest, NextApiResponse } from "next";
import { authMW, corsMW, isPartOfHouse } from "@/utils/middleware";
import prisma from "@/utils/PrismaClient";
import { Session } from "next-auth";
import { House, User } from "@prisma/client";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  _session: Session,
  house: House & { users: User[] }
) => {
  if (req.method === "DELETE") {
    // handle delete request
    const { userId } = req.query;
    const { id: houseId } = house;
    if (house.users.length === 1) {
      await Promise.all([
        prisma.choreAssignment.deleteMany({
          where: { userId: userId as string },
        }),
        prisma.payment.deleteMany({
          where: {
            OR: [
              { payerId: userId as string },
              { recipientId: userId as string },
            ],
          },
        }),
        prisma.house.delete({ where: { id: houseId } }),
      ]);
      return res.status(200).json({ message: "User removed from house" });
    }
    await Promise.all([
      prisma.choreAssignment.deleteMany({
        where: { userId: userId as string },
      }),
      prisma.payment.deleteMany({
        where: {
          OR: [
            { payerId: userId as string },
            { recipientId: userId as string },
          ],
        },
      }),
      prisma.house.update({
        where: { id: houseId },
        data: {
          users: { disconnect: { id: userId as string } },
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          houseId: null,
        },
      }),
    ]);
    res.status(200).json({ message: `User removed from ${house.name}` });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default corsMW(authMW(isPartOfHouse(handler)));
