import logo from "@/assets/main.svg"
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
    return (
        <div className="w-full  h-[70px] items-center flex px-[200px] justify-between  text-white">
            <div className="LEFT flex items-center gap-2">
                <Image src={logo} height={24} width={24} alt="Logo" />
                <p>THE AGGREGATOR</p>
            </div>
            <div className="MIDDLE flex items-center gap-4">
                <Link href={"/"}>Trade</Link>
                <Link href={"/"}>Docs</Link>
                <Link href={"/"}>About</Link>
                <Link href={"/"}>Blog</Link>
            </div>
            <div className="RIGHT">
                <Button className="bg-[#68E4FF] text-black">Launch Dapp</Button>
            </div>
        </div>
    );
}

export default Navbar;