"use client"

import Image from "next/image"
import logo from "@/assets/main.svg"
import Link from "next/link";
import { Divider } from "@nextui-org/react";
import { Separator } from "../shadcn-ui/separator";
import { SearchCode } from "lucide-react";

const Footer = () => {
    return (<div className="flex flex-col md:flex-row px-[20px] md:px-[80px] lg:px-[100px] xl:[200px]  mt-24 py-4 text-white items-center">
        <div className="flex gap-4 mb-4 items-center w-full justify-center sm:hidden">
            <Image src={logo} height={24} width={24} alt="Logo" />
            <p className="font-semibold">THE AGGREGATOR</p>
        </div>
        <div className="flex justify-between w-full flex-col md:flex-row gap-4">

            <div className="LEFT items-center gap-2 hidden sm:flex">
                <Image src={logo} height={24} width={24} alt="Logo" />
                <p className="font-semibold">THE AGGREGATOR</p>
            </div>
            <div className="flex-col flex items-center">
                <p className="font-semibold text-[18px] text-white/50 ">Services</p>
                <Link href={"/"}>Trade</Link>
                <Link href={"/"}>Manage Portfolio</Link>
            </div>
            <div className="flex-col hidden sm:flex items-center">
                <p className="font-semibold text-[18px] text-white/50">Resources</p>
                <Link href={"/"}>About</Link>
                <Link href={"/"}>Docs</Link>
                <Link href={"/"}>Blog</Link>
            </div>
            <div className="flex-col flex items-center">
                <p className="font-semibold text-[18px] text-white/50">Community</p>
                <a target="_blank" href={"https://twitter.com/theaggregator_/"}>Twitter</a>
                <Link href={"/"}>Discord</Link>
            </div>

            <p className="w-full text-center md:hidden">TheAggregator &copy; 2023</p>
        </div>
    </div>);
}

export default Footer;