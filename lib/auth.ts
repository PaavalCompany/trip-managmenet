import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const validUsername = process.env.LOGIN_USERNAME
        const validPassword = process.env.LOGIN_PASSWORD

        if (
          credentials.username === validUsername &&
          credentials.password === validPassword
        ) {
          return {
            id: "1",
            name: "Admin",
            email: "admin@tripmanagement.com",
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token }) {
      return token
    },
    async session({ session }) {
      return session
    },
  },
} 