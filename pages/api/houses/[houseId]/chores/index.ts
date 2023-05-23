import { NextApiRequest, NextApiResponse } from "next";
import { authMW, corsMW, isPartOfHouse } from "@/utils/middleware";
import prisma from "@/utils/PrismaClient";
import { Session } from "next-auth";
import { ChoreType, House, User } from "@prisma/client";

export interface ChorePostBody {
  title: string;
  description: string;
  type: ChoreType;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  _session: Session,
  house: House & { users: User[] }
) => {
  if (req.method === "GET") {
    const chores = await prisma.chore.findMany({
      where: { OR: [{ owner: house.id }, { owner: null }] },
    });
    res.status(200).json({ chores });
  } else if (req.method === "POST") {
    const { title, description, type } = req.body;
    //TODO check if inputs missing
    const chore = await prisma.chore.create({
      data: {
        title,
        description,
        type,
        Owner: { connect: { id: house.id } },
      },
    });
    res.status(200).json({ chore });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default corsMW(authMW(isPartOfHouse(handler)));
