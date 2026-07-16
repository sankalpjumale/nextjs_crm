"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function ContactsError({
    error,
    reset
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Contacts page crashed: ', error)
    }, [error])

    return (
        <div className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong loading your contacts.</h2>
            <p className="text-gray-500 mb-4">This has been logged. Please try again.</p>
            <Button onClick={() => reset()} className="bg-blue-600 text-white px-4 py-2 rounded">Try Again</Button>
        </div>
    )
}