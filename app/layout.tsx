
import { Toaster } from "@/components/ui/toaster"
import { Poppins } from 'next/font/google'
import Providers from "./providers"

const font = Poppins({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800"] })

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (

        <html lang="en">
            <body suppressHydrationWarning className={font.className}>
                <Providers>
                    {children}
                </Providers>

                <Toaster />
            </body>
        </html>



    )
}


