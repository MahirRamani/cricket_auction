import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        mobileNumber: { label: "mobileNumber", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any): Promise<any> {

        console.log("in provider");
        

        await dbConnect()


        console.log("credentials", credentials);
        

        try {
          const user = await User.findOne({
            mobileNumber: credentials?.mobileNumber,
          })


          console.log("user", user);
          

          if (!user) {
            throw new Error("No user found with this mobile number")
          }

          if (user.hasVoted) {
            throw new Error("Please verify your mobile number")
          }

          const isPasswordCorrect = credentials?.password === user.password
          if (isPasswordCorrect) {
            return user
          }
          else {
            throw new Error("Incorrect Password")
          }

        } catch (err: any) {
          throw new Error(err)
        }

      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString()
        // token.isVarified = user.isVerified
        token.mobileNumber = user.mobileNumber
        token.isCricketSelected = user.isCricketSelected
        // token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id
        // session.user.isVerified = token.isVarified
        session.user.mobileNumber = token.mobileNumber
        session.user.isCricketSelected = token.isCricketSelected
        // session.user.role = token.role
      }
      return session
    },

  },

  pages: {
    signIn: '/login',
    signOut: '/logout',
    // signIn: '../../../../login/page.tsx',
    // signIn: '../../../page.tsx',
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

}
