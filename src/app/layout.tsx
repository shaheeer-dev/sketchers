'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Provider } from 'react-redux'
import { store } from '@/store'
import Navbar from '@/components/navbar/Navbar'
import { ThemeProvider } from '@/components/navbar/Theme/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <ThemeProvider defaultTheme="system">
            <Navbar />
            {children}
            <div id="modal"></div>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  )
}
