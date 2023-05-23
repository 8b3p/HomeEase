import { NextApiRequest, NextApiResponse } from "next";
import { authMW, corsMW, isPartOfHouse } from "@/utils/middleware";
import prisma from "@/utils/PrismaClient";
import { Session } from "next-auth";
import { House, Status, User } from "@prisma/client";
import isValidObjectId from "@/utils/isValidObjectId";

export interface PaymentPostBody {
  amount: number;
  dueDate?: Date;
  status: Status;
  payerId: string;
  recipientId: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  _session: Session,
  house: House & { users: User[] }
) => {
  if (req.method === "GET") {
    const payments = await prisma.payment.findMany({
      where: {
        houseId: house.id,
      },
    });
    res.status(200).json({ payments });
  } else if (req.method === "POST") {
    const { amount, dueDate, payerId, recipientId } =
      req.body as PaymentPostBody;
    if (!isValidObjectId(payerId) || !isValidObjectId(recipientId))
      return res.status(400).json({ message: "Invalid user id" });

    const payment = await prisma.payment.create({
      data: {
        amount: amount,
        dueDate: dueDate,
        status: Status.Pending,
        House: {
          connect: {
            id: house.id,
          },
        },
        Recipient: {
          connect: {
            id: recipientId,
          },
        },
        Payer: {
          connect: {
            id: payerId,
          },
        },
      },
    });
    res.status(200).json({ payment });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default corsMW(authMW(isPartOfHouse(handler)));
