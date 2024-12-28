'use client'
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function SignIn() {
  return (
    <SignInButton mode="modal">
      <Button>
        Sign In
      </Button>
    </SignInButton>
  );
}