import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/PrismaClient'
import Cors from "cors";
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import isValidObjectId from './utils/isValidObjectId';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await getSession({ req: request as any })
  console.log(session)
  if (request.nextUrl.pathname.includes('/api/houses/')) {
    // isPartOfHouse
    // get /api/houses/[houseId]
    const houseId = request.nextUrl.pathname.split('/')[3]
    console.log(houseId)
    if (!isValidObjectId(houseId)) return NextResponse.json({ error: "Invalid house id" }, { status: 400 })
    // const house = await prisma.house.findUnique({
    //   where: {
    //     id: houseId,
    //   },
    //   include: {
    //     users: true,
    //   }
    // });
    // console.log(house)
    // if (house === null) return NextResponse.json({ error: "House not found" }, { status: 404 })
    // if (!house.users.find(user => user.id === session.user.id)) {
    //   return res.status(403).json({ error: "You are not a member of this house" })
    // }
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.includes('/api')) {
    console.log('hey1')
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
};

// Initialize the cors middleware
const cors = Cors({
  methods: ["GET", "POST"],
});

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
    return handler(req, res);
  };
}
