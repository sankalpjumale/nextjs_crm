import { Button } from "@/components/ui/button"
import { CreateContactInput, createContactSchema } from "@/lib/validation/contact"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"


type ContactFormProps = {
    onContactAdded: (contact: any) => void
}

export default function ContactForm({onContactAdded}: ContactFormProps) {
    const {
        register,       //connect each input to form
        handleSubmit,   //wrap submit function with validation
        reset,  //clear form after success
        formState: { errors, isSubmitting },    //errors per field and loading state
    } = useForm<CreateContactInput>({
        resolver: zodResolver(createContactSchema)  //same schema for backend
    })

    async function onSubmit(data: CreateContactInput) {
        try {
            const res = await fetch("/api/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            const result = await res.json()
            if (!result.success) {
                toast.error(result.error || "Failed to add contact")
                return
            }

            onContactAdded(result.contact)
            toast.success(`${result.contact.name} added successfully!`)
            reset() //clear all fields back to empty
        } catch (error) {
            toast.error("Network error. Please try again.")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mb-6 border p-4 rounded">
            <h2 className="font-semibold">Add New Contact</h2>

            <div>
                <input
                    type="text"
                    placeholder="Name *"
                    {...register("name")}
                    className="border p-2 w-full rounded"
                />
                {errors.name?.message && (
                    <p className="text-red-600 text-sm mt-1">{ errors.name.message }</p>
                )}
            </div>

            <div>
                <input
                    type="email"
                    placeholder="Email *"
                    {...register("email")}
                    className="border p-2 w-full rounded"
                />
                {errors.email?.message && (
                    <p className="text-red-600 text-sm mt-1">{ errors.email.message }</p>
                )}
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Phone *"
                    {...register("phone")}
                    className="border p-2 w-full rounded"
                />
                {errors.phone?.message && (
                    <p className="text-red-600 text-sm mt-1">{ errors.phone.message }</p>
                )}
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Company *"
                    {...register("company")}
                    className="border p-2 w-full rounded"
                />
                {errors.company?.message && (
                    <p className="text-red-600 text-sm mt-1">{ errors.company.message }</p>
                )}
            </div>

            {/* <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                { isSubmitting ? "Adding..." : "Add Contact"}
            </button> */}

            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Adding..." : "Add Contact"}
            </Button>

        </form>
    )
}