import Cors from "cors";
import { NextApiResponse, NextApiRequest } from "next";

// Initialize the cors middleware
const cors = Cors({
  methods: ["GET", "POST"],
});

// Define the middleware function
function middleware(handler: any) {
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

export default middleware;
