// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { authMW, corsMW, isPartOfHouse } from "@/utils/middleware";
import { House, User } from "@prisma/client";
import { Session } from "next-auth";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  _session: Session,
  house: (House & { users: User[] }) | null
) => {
  if (req.method === "GET") {
    // Process a POST request
    const users = house?.users.map(user => {
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    });
    return res.status(200).json({ users });
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default corsMW(authMW(isPartOfHouse(handler)));
