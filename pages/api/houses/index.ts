import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/PrismaClient";
import { corsMW, authMW } from "@/utils/middleware";
import { Session } from "next-auth";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
  if (req.method === "POST") {
    const name = <string>req.body.name;
    //check if user belongs to a house
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        House: true,
      },
    });
    if (user?.House)
      return res
        .status(409)
        .json({ message: "User already belongs to a house" });
    //create a house and add the user to it
    // create a random invitaionCode
    const invitationCode = Math.random().toString(36).substring(7);
    const house = await prisma.house.create({
      data: {
        name,
        invitationCode,
        users: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return res
      .status(201)
      .json({ message: "House created successfully", house });
  } else {
    // Handle any other HTTP method
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default corsMW(authMW(handler));
