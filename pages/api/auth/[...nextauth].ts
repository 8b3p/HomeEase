import NextrAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import prisma from "utils/PrismaClient";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { verifyPassword } from "@/utils/passwordCrypt";
import { getSafeUser } from "@/utils/safeUser";

export default NextrAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied using prisma
        if (!credentials || !credentials.username || !credentials.password)
          throw new Error("No credentials supplied");

        let user;
        try {
          prisma.$connect();
          user = await prisma.user.findUnique({
            where: {
              name: credentials.username,
            },
          });
          prisma.$disconnect();
        } catch (error: any) {
          console.dir(error);
          throw new Error(error.message);
        }

        if (!user) {
          // If you return null then an error will be displayed advising the user to check their details.
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          throw new Error("No user found");
        } else {
          // Any object returned will be saved in `user` property of the JWT
          let passwordVerified = verifyPassword({
            password: credentials.password,
            hashedPassword: user.password,
            salt: user.salt,
          });
          if (passwordVerified) {
            return getSafeUser(user);
          } else throw new Error("Wrong password");
        }
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
});
