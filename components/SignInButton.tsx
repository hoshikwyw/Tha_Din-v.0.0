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
      className="inline-flex items-center gap-2 rounded-full border-2 border-border
                 bg-black text-white px-4 sm:px-5 py-2 font-semibold text-sm sm:text-base
                 shadow-100 transition-all duration-150 ease-snap
                 hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px]
                 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <Github className="size-4 sm:size-5" aria-hidden="true" />
      {isPending ? "Signing in…" : "Login"}
    </button>
  );
};

export default SignInButton;
