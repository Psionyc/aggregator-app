"use client"

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/main.svg"
import { Button } from "@/components/ui/button";
//@ts-ignore
import { ConnectKitButton } from 'connectkit';

function Navbar() {
    return (
        <div className="w-full  h-[70px] items-center flex px-[20px] md:px-[80px] lg:px-[100px] xl:[200px]  justify-between  text-white">
            <Link href={"/dapp/"}>
                <div className="LEFT flex items-center gap-2">
                    <Image src={logo} height={24} width={24} alt="Logo" />
                    <p className="text-[12px] md:text-[14px] font-semibold">THE AGGREGATOR</p>
                </div>
            </Link>
            {/* <div className="MIDDLE hidden sm:flex items-center gap-4">
                <Link href={"/"}>Trade</Link>
                <Link href={"/"}>Docs</Link>
                <Link href={"/"}>About</Link>
                <Link href={"/"}>Blog</Link>
            </div> */}
            <div className="RIGHT">
                <ConnectKitButton customTheme={{
                    "--ck-connectbutton-border-radius": "8px",
                    "--ck-connectbutton-background": "rgba(51,65,85, 1)",
                    "--ck-connectbutton-hover-background": "rgba(51,65,85, 0.5)",
                    "--ck-connectbutton-active-background": "rgba(51,65,85, 0.5)"
                }} />
            </div>
        </div>
    );
}

export default Navbar;