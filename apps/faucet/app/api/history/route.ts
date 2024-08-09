import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

export async function GET(
  req: NextRequest,
  res: NextResponse<number | { error: string }>
) {
  try {
    const count = (await prisma.history.findMany({ skip: 0, take: 20 })).sort((a, b) => b.id-a.id);

    return NextResponse.json(count, { status: 200 });
  } catch (error) {
    console.error("Error fetching history :", error);
    NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  res: NextResponse<number | { error: string }>
) {
  try {
    const { address } = await req.json();
    const createdAt = new Date().getTime();

    await prisma.history.create({
      data: { address, createdAt },
    });

    return NextResponse.json({ address, createdAt }, { status: 200 });
  } catch (error) {
    console.error("Error creating history :", error);
    NextResponse.json({ error }, { status: 500 });
  }
}
