import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Redis } from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
});

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Cognito",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const command = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: process.env.COGNITO_CLIENT_ID!,
            AuthParameters: {
              USERNAME: credentials?.email || "",
              PASSWORD: credentials?.password || "",
            },
          });

          const response = await client.send(command);
          
          if (response.AuthenticationResult?.IdToken) {
            // Redisにトークンを保存
            const sessionId = crypto.randomUUID();
            await redis.setex(
              `session:${sessionId}`,
              30 * 24 * 60 * 60, // 30日
              JSON.stringify({
                idToken: response.AuthenticationResult.IdToken,
                email: credentials?.email
              })
            );

            return {
              id: sessionId,
              email: credentials?.email,
            };
          }
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        const sessionData = await redis.get(`session:${token.sub}`);
        if (sessionData) {
          const { idToken, email } = JSON.parse(sessionData);
          session.idToken = idToken;
          session.user = { email };
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
});

export { handler as GET, handler as POST }; 
