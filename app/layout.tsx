
import { Toaster } from "@/components/ui/toaster"
import { Montserrat, Poppins } from 'next/font/google'
import Providers from "./providers"

const font = Montserrat({ 
    variable: "--font-poppins",
    subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800"] })

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {

   
    return (

        <html lang="en" className={font.variable}>
            <body suppressHydrationWarning className={font.className}>
                <Providers font={font}>
                    {children}
                </Providers>

                <Toaster />
            </body>
        </html>



    )
}


