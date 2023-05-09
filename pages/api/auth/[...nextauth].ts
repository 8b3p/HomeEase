import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import prisma from "utils/PrismaClient";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { verifyPassword } from "@/utils/passwordCrypt";
import { getSafeUser } from "@/utils/safeUser";
import { User } from "@prisma/client";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      type: "credentials",
      name: "Credentials",
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied using prisma
        if (!credentials || !credentials.email || !credentials.password)
          throw new Error("No credentials supplied");
        let user;
        try {
          user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });
        } catch (error: any) {
          console.dir(error);
          throw new Error(error.message);
        }

        if (!user) {
          // If you return null then an error will be displayed advising the user to check their details.
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          throw new Error("Wrong email or password");
        } else {
          // Any object returned will be saved in `user` property of the JWT
          let passwordVerified = verifyPassword({
            password: credentials.password,
            hashedPassword: user.password,
            salt: user.salt,
          });
          if (passwordVerified) {
            return getSafeUser(user) as User;
          } else throw new Error("Wrong email or password");
          ;
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
  callbacks: {
    signIn: async ({ user, account, profile, email, credentials }) => {
      let User = user as User;
      if (account?.type !== "credentials") return true;
      if (!User.emailVerified)
        throw new Error("Email not verified. click to send verification link");
      return true;
    },
    async session({ session, token, user }) {
      //make first letter capital of firstname and lastname
      session.user = {
        ...user,
        email: token.email,
        name: `${token.firstName} ${token.lastName}`,
        id: <string>token.id,
      };
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        const newUser = getSafeUser(user as User);
        newUser.firstName =
          newUser.firstName.charAt(0).toUpperCase() +
          newUser.firstName.slice(1);
        newUser.lastName =
          newUser.lastName.charAt(0).toUpperCase() + newUser.lastName.slice(1);
        return {
          ...token,
          ...newUser,
        };
      }
      return token;
    },
  },
});
