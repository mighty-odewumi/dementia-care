import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
// import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: "Dementia Care",
  description: "Dementia Care Platform",
};
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
        <header>
            
          </header>
          {/* <ThemeProvider> */}
            {children}
            <Toaster />
          {/* </ThemeProvider> */}
        </body>
      </html>
    </ClerkProvider>
  )
}