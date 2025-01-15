import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { NextResponse } from "next/server";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    });

    await client.send(command);

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: error.message || "Registration failed" },
      { status: 400 }
    );
  }
} 
