"use client"
import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs"

function SignOutButton() {
  return (
    <ClerkSignOutButton>
        <button>Sign out</button>      
    </ClerkSignOutButton>
  )
}

export default SignOutButton