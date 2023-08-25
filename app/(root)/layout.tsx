import Navbar from '@/components/root/Navbar'
import '../globals.css'
import Footer from '@/components/root/Footer'



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
