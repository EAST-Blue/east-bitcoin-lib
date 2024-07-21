import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../db";

export async function GET(
  req: NextRequest,
  res: NextResponse<number | { error: string }>
) {
  try {
    const count = await prisma.account.findMany({ skip: 0, take: 100 });

    return NextResponse.json(count, { status: 200 });
  } catch (error) {
    console.error("Error fetching account count:", error);
    NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  res: NextResponse<number | { error: string }>
) {
  try {
    const { secret, p2wpkh, p2tr, path } = await req.json();
    await prisma.account.create({
      data: { secret, p2wpkh, p2tr, path: parseInt(path) },
    });

    return NextResponse.json({ secret, p2wpkh, p2tr, path }, { status: 200 });
  } catch (error) {
    console.error("Error creating account:", error);
    NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  res: NextResponse<number | { error: string }>
) {
  try {
    const { secret } = await req.json();
    await prisma.account.deleteMany({
      where: { secret },
    });

    return NextResponse.json({ secret }, { status: 200 });
  } catch (error) {
    console.error("Error deleting account:", error);
    NextResponse.json({ error }, { status: 500 });
  }
}
