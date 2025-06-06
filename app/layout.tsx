import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import AuthContext from "./context/AuthContext"

import { auth } from "@/auth";
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AthloBase - All Your Clubs. One Platform.",
  description: "Streamline training, events, and members with a tool built for modern sports communities.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

    const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>

      <AuthContext session={session}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
              <Toaster richColors theme="dark" />
              {children}
          </ThemeProvider>
      </AuthContext>


      </body>
    </html>
  )
}
