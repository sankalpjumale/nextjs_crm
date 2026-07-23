import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function SignOutPage() {

    const { signOut } = useClerk()
    // const router = useRouter() 
    //because use afterSignOuturl="/" globally on Clerkprovider

    useEffect(() => {
        // signOut(() => router.push('/'))
        signOut()
    },
        // [signOut, router]
        [signOut]
    )

  return null
}

export default SignOutPage