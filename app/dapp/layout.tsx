
import '@/app/globals.css'
import Navbar from '@/components/dapp/Navbar'
import Footer from '@/components/root/Footer'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'


const font = Poppins({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800"] })

export const metadata: Metadata = {
    title: 'Dapp',
    description: 'Aggregator Dapp Space',

}

export default function DappLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={font.className}>
                <Navbar />

                <div className="flex px-[20px] md:px-[80px] lg:px-[100px] xl:[200px]">{children}</div>
                <Footer />
            </body>
        </html>
    )
}
