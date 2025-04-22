import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phoneNumber || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectDB();

        const user = await User.findOne({
          phoneNumber: credentials.phoneNumber,
        }).select("+password");

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          name: user.fullName,
          email: user.email,
          role: user.role,
          onboardingCompleted: user.onboardingCompleted,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && account.provider === "google") {
        await connectDB();
        const googleId = account.providerAccountId;

        let dbUser = await User.findOne({ googleId });

        if (!dbUser && token.email) {
          dbUser = await User.findOne({ email: token.email });

          if (dbUser) {
            dbUser.googleId = googleId;
            await dbUser.save();
          } else {
            dbUser = await User.create({
              fullName: token.name,
              email: token.email,
              googleId,
              onboardingCompleted: false,
            });
          }
        }

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.googleId = googleId;
          token.role = dbUser.role;
          token.onboardingCompleted = dbUser.onboardingCompleted;

          return token;
        }
      }

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.onboardingCompleted = user.onboardingCompleted;
      }

      if (token.id && /^[0-9a-fA-F]{24}$/.test(token.id)) {
        try {
          await connectDB();

          const latestUser = await User.findById(token.id);

          if (latestUser) {
            token.onboardingCompleted = latestUser.onboardingCompleted;
            if (latestUser.googleId) {
              token.googleId = latestUser.googleId;
            }
          }
        } catch (error) {
          console.error("Error fetching latest user data:");
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;

        if (token.googleId) {
          session.user.googleId = token.googleId as string;
        }

        session.user.role = token.role as string;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
