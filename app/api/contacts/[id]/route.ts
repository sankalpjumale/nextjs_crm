import z from "zod";




const updateContactSchema = z.object({
    name:z.string().min(1).optional(),
    email:z.string().email().optional().or(z.literal("")),
    phone:z.string().optional(),
    company:z.string().optional(),
    status:z.enum(["lead", "active", "inactive"]).optional()
})

