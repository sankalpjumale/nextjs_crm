"use client"

import { table } from "console"
import { useEffect, useState } from "react"


type Contact = {
    id: string,
    name: string
    email: string | null
    phone: string | null
    company: string | null
    status: string
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadContacts() {
            setLoading(true)
            setError(null)

            try {
                const res = await fetch("/api/contacts")
                const data = await res.json()

                if (!data.success) {
                    setError(data.error || 'Failed to load contacts')
                }

                setContacts(data.contacts)
            } catch (err) {
                setError("Something went wrong. Please check your connections.")
            } finally {
                setLoading(false)
            }
        }
     }, [])
    
    if (loading) return <div className="p-6">Loading contacts...</div>
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Contacts</h1>

            {contacts.length === 0 ? (
                <p className="text-gray-500">No contacts yet. Add your first one!</p>
            ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2">Name</th>
                                <th className="text-left p-2">Email</th>
                                <th className="text-left p-2">Phone</th>
                                <th className="text-left p-2">Company</th>
                                <th className="text-left p-2">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {contacts.map((contact) => (
                                <tr key={contact.id} className="border-b">
                                    <td className="p-2">{contact.name}</td>
                                    <td className="p-2">{contact.email}</td>
                                    <td className="p-2">{contact.phone}</td>
                                    <td className="p-2">{contact.company}</td>
                                    <td className="p-2">{contact.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            )}
        </div>
    )
}