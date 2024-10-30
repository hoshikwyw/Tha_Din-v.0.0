import { auth, signIn , signOut } from '@/auth'
import Link from 'next/link'
import React from 'react'

const Navbar = async () => {
    const session = await auth()

  return (
    <header className=' px-5 py-3 bg-white shadow-sm font-work-sans'>
        <nav className=' flex justify-between items-center'>
            <Link href="/">
                <h1 className=' text-2xl font-bold text-blue-950'>Tha Din</h1>
            </Link>

            <div className="flex items-center gap-5 text-black">
                {session && session?.user ? (
                    <>
                        <Link href="/startup/create">
                            <span>Create</span>
                        </Link>
                        <button onClick={signOut}>
                            <span>Logout</span>
                        </button>
                        <Link href={`/user/${session?.id}`}>
                            <span>{session?.user?.name}</span>
                        </Link>
                    </>
                ) : (
                    <button onClick={signIn('github')}>
                        <span>Login</span>
                    </button>
                )}
            </div>
        </nav>
    </header>
  )
}

export default Navbar