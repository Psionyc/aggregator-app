import Image from "next/image"
import logo from "@/assets/main.svg"
import Link from "next/link";

const Footer = () => {
    return (<div className="flex px-[20px] md:px-[80px] lg:px-[100px] xl:[200px]  mt-24 py-4 text-white">
        <div className="flex justify-between w-full">

            <div className="LEFT items-center gap-2 hidden sm:flex">
                <Image src={logo} height={24} width={24} alt="Logo" />
                <p className="font-semibold">THE AGGREGATOR</p>
            </div>
            <div className="flex-col flex">
                <p className="font-semibold">Services</p>
                <Link href={"/"}>Trade</Link>
                <Link href={"/"}>Manage Portfolio</Link>
            </div>
            <Image src={logo} height={24} width={24} alt="Logo" className="sm:hidden"/>
            <div className="flex-col hidden sm:flex">
                <p className="font-semibold">Resources</p>
                <Link href={"/"}>About</Link>
                <Link href={"/"}>Docs</Link>
                <Link href={"/"}>Blog</Link>
            </div>
            <div className="flex-col flex">
                <p className="font-semibold">Community</p>
                <a target="_blank" href={"https://twitter.com/theaggregator_/"}>Twitter</a>
                <Link href={"/"}>Discord</Link>
            </div>
        </div>
    </div>);
}

export default Footer;