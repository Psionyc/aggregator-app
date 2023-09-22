
import { Toaster } from "@/components/ui/toaster"
import { Poppins } from 'next/font/google'
import Providers from "./providers"

const font = Poppins({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800"] })

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {

    console.log(font.className)
    return (

        <html lang="en" className={font.className}>
            <body suppressHydrationWarning className={font.className}>
                <Providers font={font}>
                    {children}
                </Providers>

                <Toaster />
            </body>
        </html>



    )
}


