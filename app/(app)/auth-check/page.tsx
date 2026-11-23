// import { requireUserId } from "@/server/auth/require-user";
// import { createCurrentUserClient } from "@/server/supabase/current-user-client";

// export default async function AuthCheckPage() {
//     const clerkUserId = await requireUserId()
//     const supabase = createCurrentUserClient()
//     const { data: databaseUserId, error } = await supabase.rpc("requesting_user_id")
    
//     return (
//         <pre className="p-6 text-sm">
//             {JSON.stringify({clerkUserId, databaseUserId, error}, null, 2)}
//         </pre>
//     )
// }




import { getClerkAccessToken } from "@/server/auth/access-token"

function decode(part: string) {
    return JSON.parse(Buffer.from(part, "base64url").toString("utf8"))
}

export default async function AuthCheckPage() {
    const token = await getClerkAccessToken()
    if (!token) return <pre className="p-6 text-sm">No token</pre>
    
    const [header, payload] = token.split(".")
    const h = decode(header ?? "")
    const p = decode(payload ?? "")

    return (
        <pre className="p-6 text-sm">
            {JSON.stringify(
                { alg: h.alg, kid: h.kid, iss: p.iss, role: p.role, sub: p.sub },
                null,
                2
            )}
        </pre>
    )
}