import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import z from "zod";


const updateContactSchema = z.object({
    name:z.string().min(1).optional(),
    email:z.string().email().optional().or(z.literal("")),
    phone:z.string().optional(),
    company:z.string().optional(),
    status:z.enum(["lead", "active", "inactive"]).optional()
})

//update contact
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    try {
        const {id} = await params    
    
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized"},
                {status: 401}
            )
        }
    
        const existing = await prisma.contact.findUnique({ where: { id } })
        if (!existing) {
            return NextResponse.json(
                { success: false, error: "Contact not found" },
                {status: 404}
            )
        }
        if (existing.userId !== userId) {
            return NextResponse.json(
                { success: false, error: "Not authorized" },
                {status: 403}
            )
        }
    
        const body = await request.json()
        const result = updateContactSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error.issues[0].message },
                {status: 400}
            )
        }
    
        const contact = await prisma.contact.update({
            where: { id },
            data: result.data
        })
    
        return NextResponse.json(
            {success: true, contact}
        )
    } catch (error) {
        console.error("Error Updating contact: ", error)
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            {status: 500}
        )
    }
}

//delete contact
export async function DELETE(
    request: Request,
    {params} : {params: Promise<{id: string}>}
) {

    try {
        const {id} = await params
    
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Not authorized" },
                {status: 401}
            )
        }
    
        const existing = await prisma.contact.findUnique({ where: { id } })
        if (!existing) {
            return NextResponse.json(
                { success: false, error: "Contact not found" },
                {status: 404}
            )
        }
        if (existing.userId !== userId) {
            return NextResponse.json(
                { success: false, error: "Not authorized" },
                {status: 403}
            )
        }
    
        await prisma.contact.delete({ where: { id } })
        
        return NextResponse.json(
            {success: true}
        )
    } catch (error) {
        console.error("Error Deleting Contact: ", error)
        return NextResponse.json(
            { success: false, error: "Error Deleting Contact" },
            {status: 500}
        )
    }
}