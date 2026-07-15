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
    try {
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
    } catch (error) {
        console.error("Error fetching contacts: ", error)
        return NextResponse.json(
            { success: false, error: "InternalServer Error" },
            {status: 500}
        )
    }
}

//create a new contact
export async function POST(request: Request) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                {status: 401}
            )
        }
    
        const body = await request.json()
    
        //validate input
        const result = createContactSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error.issues[0].message },
                {status: 400}
            )
        }
    
        const contact = await prisma.contact.create({
            data: {
                ...result.data,
                userId
            }
        })
    
        return NextResponse.json(
            { success: true, contact },
            {status: 201}
        )
    } catch (error) {
        console.error("Error creating contact: ", error)
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            {status: 500}
       ) 
    }
}