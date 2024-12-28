import { SignIn } from '@/components/auth/SignInButton'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { useToast } from '@/hooks/use-toast'

export default async function Home() {
  const { userId } = await auth()

  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>

      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        
        <Card className="w-full max-w-md p-6">
          <h1 className="text-3xl font-bold mb-6">Dementia Care Platform</h1>
          <div className="space-y-4">
            {userId ? (
              <Button asChild className="w-full">
                <Link href="/record">Enter Platform</Link>
              </Button>
            ) : (
              <SignIn />
            )}
          </div>
        </Card>
      </main>
    </>
  )
}