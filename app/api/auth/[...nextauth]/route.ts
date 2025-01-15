import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

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
            return {
              id: credentials?.email || "",
              email: credentials?.email,
              idToken: response.AuthenticationResult.IdToken,
              _tokenInfo: response.AuthenticationResult,
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
    async jwt({ token, user, account, trigger }) {
      console.log('JWT Callback:', { token, user, account, trigger });
      
      if (user) {
        token.idToken = user.idToken;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log('Session Callback:', { session, token, user });
      
      return {
        ...session,
        idToken: token.idToken,
        user: {
          ...session.user,
          email: token.email,
        }
      };
    }
  },
  debug: true,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
});

export { handler as GET, handler as POST }; 
