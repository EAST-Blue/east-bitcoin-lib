import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../db";
import { isValidHttpUrl } from "../../utils/isValidHttpUrl";

export async function GET(
  req: NextRequest,
  res: NextResponse<number | { error: string }>
) {
  try {
    const network = await prisma.network.findFirst();

    return NextResponse.json(network, { status: 200 });
  } catch (error) {
    console.error("Error fetching network:", error);
    NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  res: NextResponse<number | { error: string }>
) {
  try {
    const { network, uri, explorer, regbox } = await req.json();
    if (!isValidHttpUrl(uri)) {
      NextResponse.json({ error: "URI Invalid" }, { status: 500 });
    }
    if (!isValidHttpUrl(explorer)) {
      NextResponse.json({ error: "Explorer URL Invalid" }, { status: 500 });
    }

    await prisma.network.upsert({
      where: { id: 1 },
      update: { network, uri, explorer, regbox },
      create: { network, uri, explorer, regbox },
    });

    return NextResponse.json({ network, uri, explorer }, { status: 200 });
  } catch (error) {
    console.error("Error creating account:", error);
    NextResponse.json({ error }, { status: 500 });
  }
}
