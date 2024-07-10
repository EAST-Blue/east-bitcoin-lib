import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../db";

export async function GET(
  req: NextRequest,
  res: NextResponse<number | { error: string }>
) {
  try {
    const { searchParams } = new URL(req.url);
    const uri = searchParams.get("uri");
    const address = searchParams.get("address");

    const response = await fetch(`${uri}/address/${address}`, {
      cache: "no-cache",
    });
    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching account count:", error);
    NextResponse.json({ error }, { status: 500 });
  }
}
