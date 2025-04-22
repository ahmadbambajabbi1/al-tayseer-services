import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDB from "./db"
import User from "@/models/user"
import bcrypt from "bcryptjs"

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
          throw new Error("Invalid credentials")
        }

        await connectDB()

        const user = await User.findOne({ phoneNumber: credentials.phoneNumber }).select("+password")

        if (!user) {
          throw new Error("User not found")
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user._id.toString(),
          name: user.fullName,
          email: user.email,
          role: user.role,
          onboardingCompleted: user.onboardingCompleted,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && account.provider === "google") {
        await connectDB()

        // For Google auth, use the Google ID as the user ID
        const googleId = account.providerAccountId

        // Check if user exists with this Google ID
        let dbUser = await User.findOne({ googleId })

        if (!dbUser && token.email) {
          // Check if user exists with this email
          dbUser = await User.findOne({ email: token.email })

          if (dbUser) {
            // Update existing user with Google ID
            dbUser.googleId = googleId
            await dbUser.save()
          } else {
            // Create new user with Google ID as the primary ID
            dbUser = await User.create({
              fullName: token.name,
              email: token.email,
              googleId,
              onboardingCompleted: false,
            })
          }
        }

        if (dbUser) {
          // For Google auth, use the Google ID as the user ID
          token.id = googleId
          token.role = dbUser.role
          token.onboardingCompleted = dbUser.onboardingCompleted
        }
      }

      if (user) {
        token.id = user.id
        token.role = user.role
        token.onboardingCompleted = user.onboardingCompleted
      }

      // After setting token.id, token.role in the jwt callback
      if (token) {
        // Always fetch the latest user data to ensure we have current onboarding status
        try {
          await connectDB()

          // Determine which field to query based on ID format
          const query =
            /^\d+$/.test(token.id) && String(token.id).length > 20 ? { googleId: token.id } : { _id: token.id }

          const latestUser = await User.findOne(query)

          if (latestUser) {
            token.onboardingCompleted = latestUser.onboardingCompleted
          }
        } catch (error) {
          console.error("Error fetching latest user data:", error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.onboardingCompleted = token.onboardingCompleted as boolean
      }
      return session
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
}
