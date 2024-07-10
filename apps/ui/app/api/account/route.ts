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
    const { mnemonic, p2wpkh, p2tr } = await req.json();
    await prisma.account.create({
      data: { mnemonic, p2wpkh, p2tr },
    });

    return NextResponse.json({ mnemonic, p2wpkh, p2tr }, { status: 200 });
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
    const { mnemonic } = await req.json();
    await prisma.account.delete({
      where: { mnemonic },
    });

    return NextResponse.json({ mnemonic }, { status: 200 });
  } catch (error) {
    console.error("Error deleting account:", error);
    NextResponse.json({ error }, { status: 500 });
  }
}
