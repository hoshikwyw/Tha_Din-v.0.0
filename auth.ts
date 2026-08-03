import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

/** Always read fresh — a stale CDN hit here would duplicate author documents. */
const freshClient = client.withConfig({ useCdn: false });

/** `author.id` is a number in the Sanity schema; GitHub hands it to us loosely typed. */
const toGithubId = (id: unknown): number | null => {
  const parsed = Number(id);
  return Number.isFinite(parsed) ? parsed : null;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, profile }) {
      // `profile` is absent for some flows (e.g. session refresh). Destructuring
      // it directly used to throw and surface as a 500 on the callback route.
      const githubId = toGithubId(profile?.id);
      if (githubId === null) return false;

      try {
        const existingUser = await freshClient.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: githubId,
        });

        if (!existingUser) {
          await writeClient.create({
            _type: "author",
            id: githubId,
            name: user?.name ?? profile?.name ?? "Anonymous",
            username: (profile?.login as string) ?? "",
            email: user?.email ?? "",
            image: user?.image ?? "",
            bio: (profile?.bio as string) ?? "",
          });
        }

        return true;
      } catch (error) {
        // Refuse the sign-in rather than issuing a session with no author
        // record — that would produce news documents with a dangling author ref.
        console.error("[auth] failed to sync author document", error);
        return false;
      }
    },

    async jwt({ token, account, profile }) {
      if (!account || !profile) return token;

      const githubId = toGithubId(profile.id);
      if (githubId === null) return token;

      try {
        const author = await freshClient.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: githubId,
        });
        token.id = author?._id;
      } catch (error) {
        console.error("[auth] failed to resolve author id", error);
      }

      return token;
    },

    async session({ session, token }) {
      session.id = token.id as string;
      return session;
    },
  },
});
