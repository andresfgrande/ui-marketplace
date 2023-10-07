
import './globals.css'
import './styles/header.css'
import './styles/footer.css'
import './styles/body.css'
import './styles/profile.css'
import './styles/menu.css'
import './styles/balance.css'
import './styles/catalog.css'
import './styles/formTransfer.css'
import './styles/login.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Loyalty Market',
  description: 'Marketplace',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className="body">
        {children}
      </body>
    </html>
  )
}
