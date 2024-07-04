import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../db";

export async function GET(
  req: NextRequest,
  res: NextResponse<number | { error: string }>
) {
  try {
    const data = await prisma.transaction.findMany({ skip: 0, take: 100 });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  res: NextResponse<number | { error: string }>
) {
  try {
    const { address, network, hex, txid, amount } = await req.json();

    const res = await prisma.transaction.create({
      data: {
        address,
        network,
        hex,
        txid,
        amount,
        createdAt: new Date().getTime(),
      },
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    NextResponse.json({ error }, { status: 500 });
  }
}
