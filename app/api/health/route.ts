import { NextResponse } from "next/server";
import {prisma} from "@/server/db"

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await prisma.$queryRaw`SELECt 1`
    return NextResponse.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error", error);

    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        timestamp: new Date().toISOString()
      },
      {status: 503}
    )
  }
}
