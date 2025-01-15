import { getToken, decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // セッショントークンを取得
    const sessionToken = req.cookies.get("next-auth.session-token")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "No session token found" }, { status: 401 });
    }

    // トークンをデコード
    const decodedToken = await decode({
      token: sessionToken,
      secret: process.env.NEXTAUTH_SECRET!
    });

    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({
        decodedToken,
        rawSessionToken: sessionToken,
      });
    }

    return NextResponse.json({ message: "Development mode only" });
  } catch (error) {
    console.error("Token decode error:", error);
    return NextResponse.json({ error: "Failed to decode token" }, { status: 500 });
  }
} 
