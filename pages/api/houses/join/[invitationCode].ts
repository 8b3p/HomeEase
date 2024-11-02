import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@utils/PrismaClient";
import { corsMW, authMW } from "@utils/middleware";
import { Session } from "next-auth";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
  if (req.method === "POST") {
    const { invitationCode } = req.query;
    const house = await prisma.house.findUnique({
      where: { invitationCode: invitationCode as string },
      include: {
        users: true,
      },
    });

    if (!house)
      return res
        .status(404)
        .json({ message: "The invitation code is invalid" });

    if (house.users.find(user => user.id === session.user.id)) {
      return res.status(400).json({ message: "You are already in this house" });
    }

    const newHouse = await prisma.house.update({
      where: { id: house.id },
      data: {
        users: {
          connect: {
            id: session.user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        invitationCode: true,
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            houseId: true,
          },
        },
      },
    });

    res
      .status(200)
      .json({ house: newHouse, message: "User joined house successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default corsMW(authMW(handler));
