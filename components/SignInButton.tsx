"use client";

import { signIn } from "next-auth/react";

const SignInButton = () => {
  return (
    <button type="button" onClick={() => signIn("github", { callbackUrl: "/" })}>
      Login
    </button>
  );
};

export default SignInButton;
