import { NextApiRequest, NextApiResponse } from "next";
import { authMW, corsMW, isPartOfHouse } from "@/utils/middleware";
import prisma from "@/utils/PrismaClient";
import { Session } from "next-auth";
import { Status, House, User } from "@prisma/client";
import isValidObjectId from "@/utils/isValidObjectId";

export interface ChoreAssignmentIdPutBody {
  status?: Status;
  dueDate?: Date;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
  _house: House & { users: User[] }
) => {
  const choreAssignmentId = req.query.choreAssignmentId as string;
  if (!isValidObjectId(choreAssignmentId))
    return res.status(400).json({ message: "Invalid choreAssignment id" });

  const choreAssignment = await prisma.choreAssignment.findUnique({
    where: { id: choreAssignmentId },
    include: {
      Chore: true,
      User: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  });
  if (!choreAssignment)
    return res.status(404).json({ message: "choreAssignment not found" });

  if (req.method === "GET") {
    return res.status(200).json({ choreAssignment });
  }

  if (choreAssignment.userId !== session.user.id)
    return res
      .status(403)
      .json({ message: "Only assignees can edit their own chore assignments" });

  if (req.method === "DELETE") {
    await prisma.choreAssignment.update({
      where: {
        id: choreAssignmentId,
      },
      data: {
        status: Status.Cancelled,
      },
    });
    return res
      .status(200)
      .json({ message: "Cancelled chore assignment successfully" });
  } else if (req.method === "PATCH" || req.method === "PUT") {
    const { status, dueDate } = req.body as ChoreAssignmentIdPutBody;
    const updatedChore = await prisma.choreAssignment.update({
      where: {
        id: choreAssignmentId,
      },
      data: {
        status,
        dueDate,
      },
      include: {
        Chore: true,
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
      }
    });
    return res.status(200).json({ choreAssignment: updatedChore });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default corsMW(corsMW(authMW(isPartOfHouse(handler))));
