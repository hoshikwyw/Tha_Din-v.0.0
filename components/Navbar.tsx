import { auth, signIn , signOut } from '@/auth'
import { BadgePlus, LogOut } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Navbar = async () => {
    const session = await auth()
    // console.log(session?.user?.email,">>>>>>>>");
    const isAdmin = session?.user?.email === process.env.ADMIN_GMAIL
    

  return (
    <header className=' px-5 py-3 bg-white shadow-sm font-work-sans'>
        <nav className=' flex justify-between items-center'>
            <Link href="/">
                <h1 className=' text-2xl font-bold text-blue-950'>Tha Din</h1>
            </Link>

            <div className="flex items-center gap-5 text-black">
                {session && session?.user ? (
                    <>  
                    {isAdmin && (
                        <Link href="/news/create">
                            <span className=' max-sm:hidden'>Create</span>
                            <BadgePlus className=' size-6 text-red-500 sm:hidden xs:hidden md:block' />
                        </Link>
                    )}
                        <form action={async() => {
                            "use server";
                            await signOut({redirectTo: '/'})
                        }}>
                            <button type='submit'>
                                <span className=' max-sm:hidden'>Logout</span>
                                <LogOut className=' size-6 md:block sm:hidden  xs:hidden text-red-500' />
                            </button>
                        </form>
                        <Link href={`/user/${session?.id}`}>
                            <Avatar className=' size-10'>
                                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                                <AvatarFallback>AV</AvatarFallback>
                            </Avatar>
                        </Link>
                    </>
                ) : (
                    <form action={async() => {
                            "use server";
                            await signIn('github')
                        }}>
                        <button type='submit'>Login</button>
                    </form>
                )}
            </div>
        </nav>
    </header>
  )
}

export default Navbar