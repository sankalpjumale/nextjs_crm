import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'



export async function GET() {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({success: false, error: "Unauthorized"}, {status: 401})
    }
    const contacts = await prisma.contact.findMany({
        where: { userId },
        orderBy: {createdAt: "desc"}
    })
    return NextResponse.json({
        success: true, contacts
    })
}