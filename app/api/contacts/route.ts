import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'
import { z } from "zod";

//validation schema for creating a new contact
const createContactSchema = z.object({
    name:z.string().min(1, "name is required"),
    email:z.string().email().optional().or(z.literal("")),
    phone:z.string().optional(),
    company:z.string().optional()
})

//list all contacts for login-in users
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