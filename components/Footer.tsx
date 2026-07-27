import Link from 'next/link'

function Footer() {
  return (
    <footer className='border-t py-10'>
        <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row'>
            <p className='text-sm text-muted-foreground'>
                {new Date().getFullYear()} CRM Pro. All rights reserved.      
            </p>      
              <div className='flex gap-6 text-sm text-muted-foreground'>
                  <Link href="/privacy">Privacy</Link>
                  <Link href="/terms">Terms</Link>
                  <Link href="/support">Support</Link>
            </div>
        </div>      
    </footer>
  )
}

export default Footer