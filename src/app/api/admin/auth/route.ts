import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { action, password } = await req.json();

    if (action === "login") {
      if (password === process.env.ADMIN_PASSWORD) {
        const response = NextResponse.json({ success: true });
        response.cookies.set("admin_token", password, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        return response;
      }
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    if (action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.delete("admin_token");
      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
