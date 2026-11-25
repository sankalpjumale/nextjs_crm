import { z } from "zod"

const clerkId = z.string().min(1)
const text = z.string().nullish(); //string | null | undefined

export const eventEnvelopeSchema = z.object({
    type: z.string().min(1),
    timestamp: z.number().int().positive(), //milliseconds
    data: z.unknown()
})

export const userEventDataSchema = z.object({
    id: clerkId,
    first_name: text,
    last_name: text,
    image_url: text,
    primary_email_address_id: text,
    email_addresses: z
        .array(z.object({ id: z.string(), email_address: z.string() }))
        .default([])
})

export const deletedEventDataSchema = z.object({ id: clerkId })

export const organizationEventDataSchema = z.object({
    id: clerkId,
    name: z.string(),
    slug: text,
    image_url: text
})

export const membershipEventDataSchema = z.object({
    id: clerkId,
    role: z.string().min(1),
    organization: z.object({ id: clerkId }),
    public_user_data: z.object({ user_id: clerkId})
})

export type UserEventData = z.output<typeof userEventDataSchema>
export type OrganizationEventData = z.output<typeof organizationEventDataSchema>
export type MembershipEventData = z.output<typeof membershipEventDataSchema>