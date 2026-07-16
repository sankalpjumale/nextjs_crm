import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import z from "zod"


const updateStageSchema = z.object({
    stage: z.enum(["new", "contacted", "proposal", "won", "lost"])
})

export async function PATCH(
    request: Request,
    {params}: {params: Promise<{id: string}>}
) {
    try {

        const {id} = await params

        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                {status: 401}
            )
        }

        const body = await request.json()
        const result = updateStageSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: "Invalid stage" },
                {status: 400}
            )
        }

        const existing = await prisma.deal.findUnique({
            where: { id }
        })
        if (!existing || existing.userId !== userId) {
            return NextResponse.json(
                { success: false, error: "Not Authorized" },
                {status: 403}
            )
        }

        const deal = await prisma.deal.update({
            where: { id },
            data: {stage: result.data.stage}
        })

        return NextResponse.json(
            {success: true, deal}
        )
    } catch (error) {
        console.error("Error updating deals: ", error)
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            {status: 500}
        )
    }
}