import z from "zod"

export const createContactSchema = z.object({
    name: z.string().min(1, "name is required").max(100, "name is too long"),
    email: z.string().email("Invalid email").max(255).optional().or(z.literal("")),
    phone: z.string().max(20, "Phone number is too long").optional(),
    company: z.string().max(100, "Company name is too long").optional()
})

//inferred TS type for react hook form
export type CreateContactInput = z.infer<typeof createContactSchema>