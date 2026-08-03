// This import is what makes this file a *module*. Without it TypeScript treats
// the file as a global script, and `declare module "next-auth"` REPLACES the
// real next-auth types instead of merging with them — which silently strips
// every export (NextAuth, handlers, auth, ...) from the module.
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    /** Sanity `author._id` of the signed-in user. */
    id: string;
  }
}

// `JWT` is declared by `next-auth/jwt`, not `next-auth` — augmenting it on the
// latter had no effect.
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
