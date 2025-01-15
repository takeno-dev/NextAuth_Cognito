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
          console.log(response);
          
          if (response.AuthenticationResult) {
            return {
              id: credentials?.email || "",
              email: credentials?.email,
              accessToken: response.AuthenticationResult.AccessToken,
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
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST }; 
