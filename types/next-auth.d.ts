import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    user?: {
      id?: string;
      email?: string;
      name?: string;
    };
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
  }
} 
