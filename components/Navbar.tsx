import { signOut } from '@/auth'
import { getSessionWithRole } from '@/lib/admin'
import { BadgePlus, LayoutList, LogOut } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import SignInButton from './SignInButton'

/**
 * Small screens get icon-only controls, `sm` and up get text labels.
 *
 * The previous rules were `max-sm:hidden` on the label and
 * `sm:block xs:block md:hidden` on the icon, which overlapped: between 640px
 * and 768px *both* rendered. A single `sm:` boundary per element keeps exactly
 * one visible at every width.
 *
 * The icons carry `aria-label` because `hidden` is `display: none`, so the text
 * label is removed from the accessibility tree — without it these controls
 * would be unnamed buttons for screen reader and voice-control users.
 */
const Navbar = async () => {
  const { session, isAdmin } = await getSessionWithRole()

  return (
    <header className="px-4 sm:px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="max-w-7xl mx-auto flex justify-between items-center gap-3">
        <Link href="/" className="shrink-0">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-950">Tha Din</h1>
        </Link>

        <div className="flex items-center gap-4 sm:gap-5 text-black">
          {session?.user ? (
            <>
              {isAdmin && (
                <>
                  <Link href="/news/create" aria-label="Create news">
                    <span className="hidden sm:inline">Create</span>
                    <BadgePlus className="size-6 text-red-500 sm:hidden" />
                  </Link>

                  {/* Reachable from the nav now — /categories previously had no
                      link anywhere and could only be found by typing the URL. */}
                  <Link href="/categories" aria-label="Manage categories">
                    <span className="hidden sm:inline">Categories</span>
                    <LayoutList className="size-6 text-red-500 sm:hidden" />
                  </Link>
                </>
              )}

              <form
                action={async () => {
                  'use server'
                  await signOut({ redirectTo: '/' })
                }}
              >
                <button type="submit" aria-label="Log out" className="flex items-center">
                  <span className="hidden sm:inline">Logout</span>
                  <LogOut className="size-6 text-red-500 sm:hidden" />
                </button>
              </form>

              <Link href={`/user/${session.id}`} aria-label="Your profile">
                <Avatar className="size-9 sm:size-10">
                  {/* Empty alt: the link already has an accessible name, so
                      repeating it here would double-announce. */}
                  <AvatarImage src={session.user.image || ''} alt="" />
                  <AvatarFallback>
                    {session.user.name?.trim()?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
