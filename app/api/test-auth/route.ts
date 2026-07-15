import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"



export default async function GET() {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({error: "Not Authenticated"}, {status: 401})
    }
    return NextResponse.json({message: `Hello, your userId is ${userId}`})
}