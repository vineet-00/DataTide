import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Workflows",
  description: "Workflows app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " min-h-screen"}>
        <ClerkProvider
          afterSignOutUrl="/sign-in" 
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm shadow-none",
            },
          }}
        >
          <AppProviders>
            {children}
          </AppProviders>
          <Toaster richColors />
        </ClerkProvider>
      </body>
    </html>
  );
}
