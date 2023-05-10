import Cors from "cors";
import { NextApiResponse, NextApiRequest } from "next";
import { Session } from "next-auth";
import prisma from "@/utils/PrismaClient";
import { getSession } from "next-auth/react";
import isValidObjectId from "./isValidObjectId";

// Initialize the cors middleware
const cors = Cors({
  methods: ["GET", "POST"],
});

// middleware to enable CORS for Next.js API routes
export function corsMW(handler: any) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      cors(req, res, (err: Error) => {
        if (err) {
          return reject(err);
        }
        return resolve(handler(req, res));
      });
    });
}

// middleware to check if user is authenticated
export function authMW(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: "Not authorized" });
    }
    return handler(req, res, session);
  };
}

export function isPartOfHouse(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const houseId = <string>req.query.houseId;
    if (!isValidObjectId(houseId)) return res.status(400).json({ error: "Invalid house id" });
    const house = await prisma.house.findUnique({
      where: {
        id: houseId,
      },
      include: {
        users: true,
      }
    });
    if (house === null) return res.status(404).json({ error: "House not found" });
    if (!house.users.find(user => user.id === session.user.id)) {
      return res.status(403).json({ error: "You are not a member of this house" })
    }
    return handler(req, res, session, house);
  };
}
