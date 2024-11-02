import { NextApiRequest, NextApiResponse } from "next";
import { authMW, corsMW, isPartOfHouse } from "@utils/middleware";
import prisma from "@utils/PrismaClient";
import { Session } from "next-auth";
import { House, Status, User } from "@prisma/client";
import isValidObjectId from "@utils/isValidObjectId";

export interface MarkAllPostBody {
  status?: Status;
  firstUserId: string;
  secondUserId: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
  house: House & { users: User[] }
) => {
  if (req.method === "POST") {
    const {
      firstUserId,
      secondUserId,
      status = Status.Completed,
    } = (await JSON.parse(req.body)) as MarkAllPostBody;
    if (!isValidObjectId(firstUserId) || !isValidObjectId(secondUserId))
      return res.status(400).json({ message: "Invalid user id" });
    if (session.user.id !== firstUserId && session.user.id !== secondUserId)
      return res
        .status(403)
        .json({
          message: "Only payers and recipients can edit their payments",
        });
    // update all payments that include these two users, and set status to the status provided
    const update = await prisma.payment.updateMany({
      where: {
        houseId: house.id,
        OR: [
          { payerId: secondUserId, recipientId: firstUserId },
          { payerId: firstUserId, recipientId: secondUserId },
        ],
      },
      data: { status },
    });
    res.status(200).json({ ...update, message: "Payments updated" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default corsMW(authMW(isPartOfHouse(handler)));
