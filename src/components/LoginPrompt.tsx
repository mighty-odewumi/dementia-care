import { SignIn } from "@clerk/nextjs";

export function LoginPrompt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mt-8 mb-8 text-center">Welcome to MemorySafe</h1>
      <p className="text-xl mb-8">Please sign in to continue</p>
      {/* <SignedOut>
        <SignInButton />
      </SignedOut> */}
      <SignIn />
    </div>
  );
}
