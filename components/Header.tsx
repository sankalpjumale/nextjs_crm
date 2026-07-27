import { SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

function Header() {
    return (
        <header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur'>
            <div className='mx-auto flex h-16 max-w-6xl items-center justify-center px-6'>
                <Link href="/" className='text-lg font-bold'>
                    CRM
                    <span className='text-primary'>Pro</span>
                </Link>
                <nav className='hidden items-center gap-8 text-sm text-muted-foregroundsm:flex'>
                    <Link href="/features">Features</Link>
                    <Link href="/pricing">Pricing</Link>
                    <Link href="/contact">Contact</Link>
                </nav>
                <div className='flex items-center gap-3'>
                    <SignInButton mode="modal">
                        <Button variant="ghost">Sign In</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <Button>Sign Up</Button>
                    </SignUpButton>
                </div>
            </div>    
        </header>
  )
}

export default Header