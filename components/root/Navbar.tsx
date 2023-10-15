'use client';

import logo from "@/assets/main.svg"
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";


const Navbar = () => {

    const router = useRouter();
    return (
        <div className="w-full  h-[70px] items-center flex px-[20px] md:px-[80px] lg:px-[100px] xl:[200px]  justify-between  text-white">
            <Link href={"/"}><div className="LEFT flex items-center gap-2">
                
                <Image src={logo} height={24} width={24} alt="Logo" />
                <p className="text-[12px] md:text-[18px] font-semibold">THE AGGREGATOR</p>
            </div>
            </Link>
            <div className="MIDDLE hidden sm:flex items-center gap-4">
                <Link href={"/dapp/order"}>Trade</Link>
                <Link href={"/"}>Docs</Link>
                <Link href={"/"}>About</Link>
                <Link href={"/"}>Blog</Link>
            </div>
            <div className="RIGHT">
                <Link href={"/dapp"}><Button className="bg-[#68E4FF] text-black text-[12px] md:text-[16px]">Launch Dapp</Button></Link>
            </div>
        </div>
    );
}

export default Navbar;