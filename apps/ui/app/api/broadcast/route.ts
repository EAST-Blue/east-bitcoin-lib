import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  res: NextResponse<number | { error: string }>
) {
  try {
    const { uri, hex } = await req.json();

    const response = await fetch(`${uri}/tx`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: hex,
    });
    const data = await response.text();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error creating account:", error);
    NextResponse.json({ error }, { status: 500 });
  }
}
