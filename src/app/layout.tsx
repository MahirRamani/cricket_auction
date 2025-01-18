import AuthSessionProvider from '@/context/AuthSessionProvider'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Cricket Player Rating and Auction',
  description: 'Rate cricket players and manage auctions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthSessionProvider>
        <body className={inter.className}>{children}</body>
      </AuthSessionProvider>
    </html>
  )
}

