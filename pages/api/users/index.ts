// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { corsMW } from "@/utils/middleware";
import { hashPassword } from "@/utils/passwordCrypt";
import prisma from "@/utils/PrismaClient";
import { safeUser, getSafeUser } from "@/utils/safeUser";
import type { NextApiRequest, NextApiResponse } from "next";

export type registerResponse = safeUser | { message: string };

export default corsMW(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<registerResponse>
) {
  if (req.method === "POST") {
    // Process a POST request
    //create a user in the database
    try {
      const { hashedPassword, salt } = hashPassword(req.body.password);
      const response = await prisma.user.create({
        data: {
          firstName: req.body.username?.firstname,
          lastName: req.body.username?.lastname,
          email: req.body.email,
          password: hashedPassword,
          salt: salt,
        },
      });
      // return the user
      res.status(201).json(getSafeUser(response));
    } catch (e: any) {
      if (e.code === "P2002")
        res.status(409).json({ message: "User already exists" });
      else res.status(500).json({ message: e.message });
    }
  } else {
    // Handle any other HTTP method
    res
      .status(405)
      .json({ message: "Method not allowed" });
  }
})
