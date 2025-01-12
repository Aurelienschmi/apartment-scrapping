import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  console.log("Logout endpoint called");

  try {
    // Clear the session cookie
    const cookie = serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: -1, // Expire the cookie immediately
      path: "/",
    });

    console.log("Token cookie cleared");

    return new NextResponse(
      JSON.stringify({ message: "Logged out successfully" }),
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error clearing token cookie:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}