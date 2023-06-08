import { NextApiRequest, NextApiResponse } from "next";
import { authMW, corsMW, isPartOfHouse } from "@/utils/middleware";
import prisma from "@/utils/PrismaClient";
import { Session } from "next-auth";
import { Chore, House, User } from "@prisma/client";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  _session: Session,
  house: House & { users: User[], chores: Chore[] }
) => {
  if (req.method === "GET") {
    const chores = await prisma.chore.findMany({
      where: {
        OR: [
          { owner: house.id },
          { owner: null },
        ]
      },
    })
    house.chores = chores;
    res.status(200).json({ house });
  } else if (req.method === "PATCH" || req.method === "PUT") {
    // handle put request
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    const updatedHouse = await prisma.house.update({
      where: { id: house?.id },
      data: { name },
    });
    res.status(200).json({ house: updatedHouse });
  } else if (req.method === "DELETE") {
    // handle delete request
    await prisma.house.delete({ where: { id: house?.id } });
    res.status(200).json({ message: "House deleted" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default corsMW(corsMW(authMW(isPartOfHouse(handler))));
