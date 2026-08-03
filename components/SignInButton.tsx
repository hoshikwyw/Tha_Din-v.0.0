"use client";

import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

const SignInButton = () => {
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        // The OAuth redirect can take a moment; without feedback the button
        // looked dead and invited repeat clicks.
        setIsPending(true);
        signIn("github", { callbackUrl: "/" });
      }}
      className="inline-flex items-center gap-2 rounded-lg border border-black
                 bg-black text-white px-4 py-2 font-semibold text-sm
                 transition-opacity duration-150
                 hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Github className="size-4 sm:size-5" aria-hidden="true" />
      {isPending ? "Signing in…" : "Login"}
    </button>
  );
};

export default SignInButton;
