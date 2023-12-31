'use client'


import Image from 'next/image'
import logo from '@/assets/main.svg'
import hero from "@/assets/images/ipad.webp"
import back_image from "@/assets/icons/back_image.svg"
import { Button } from '@/components/shadcn-ui/button'
import { useWindowScroll, useWindowSize } from "@reactuses/core"
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function Home() {

  let [isMounted, setIsMounted] = useState(false)
  const [y, setY] = useState(0)


  if (typeof window !== "undefined") {
    const { y: _Y } = useWindowScroll();

    useEffect(() => {
      setY(_Y)
    }, [_Y])
  }





  return (


    <main className="w-[100vw]  px-[16px] md:px-[80px] lg:px-[100px] xl:[200px] text-white">

      <Image src={back_image} alt="back image" className={`fixed z-[-1] hidden md:block top-0 left-0 transition-all ease-linear opacity-40 md:opacity-100 scale-150 sm:scale-100`} style={{
        top: -y
      }} />

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-4 items-center md:hidden">
          <Image src={hero} alt="hero" className='w-full mt-8 md:t-0 max-w-[480px] md:max-w-[512px]' />
        </div>

        <div className="flex flex-col gap-4 mt-[50px] md:mt-[100px] justify-center items-center md:items-start sm:justify-start">
          <p className="text-[48px] text-center sm:text-start md:text-[48px] xl:text-[60px] font-[900] tracking-tighter space-y-[-5px]">Powerful <span className="text-[#68E4FF]">DeFi</span> <br />Tool Box</p>
          <p className="text-[16px] lg:text-[20px] font-medium text-center md:text-start">
            TheAggregator represents a robust DeFi toolbox, introducing centralized financial proficiency to the decentralized finance realm within the Base Network.
          </p>
          <div className="flex flex-row gap-4">
            <Link href={"/dapp"}><Button className="bg-[#68E4FF] text-black">Launch Dapp</Button></Link>
            <Button variant={"outline"} className="">Docs</Button>
          </div>
        </div>
        <div className="md:flex flex-col gap-4 items-center justify-center hidden">
          <Image src={hero} alt="hero" className='w-full mt-8 md:t-0 max-w-[480px] md:max-w-[512px] ' />
        </div>
      </div>

      <section className="mt-[64px] md:mt-[100px]">
        <div className="flex flex-col">
          <p className="font-bold text-[#68E4FF] text-4xl w-full text-center">What we offer</p>
          <p className="font-medium text-white text-md w-full text-center mt-4">TheAggregator is the most powerful DeFi Tool box on Base Network</p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center mt-4 font-semibold px-4 md:px-0">
            <div className="flex p-4 md:p-8 border-[2px] border-[#68E4FF] rounded-[12px] text-[18px] md:text-[24px] justify-center text-center">ORDERBOOK TRADE</div>
            <div className="flex p-4 md:p-8  border-[2px] border-[#68E4FF] rounded-[12px] text-[18px] md:text-[24px] justify-center text-center">SWAP AGGREGATOR</div>
            <div className="flex p-4 md:p-8  border-[2px] border-[#68E4FF] rounded-[12px] text-[18px] md:text-[24px] justify-center text-center">PORTFOLIO
              MANAGEMENT</div>
            <div className="flex p-4 md:p-8 border-[2px] border-[#68E4FF] rounded-[12px] text-[18px] md:text-[24px] justify-center text-center">PERPETUAL TRADING</div>
          </div>
        </div>
      </section>

      <section className="mt-[64px] md:mt-[100px]">
        <div className="flex flex-col items-center ">
          <p className="font-bold text-[#68E4FF] text-4xl w-full text-center">Features</p>
          <p className="font-medium text-white text-md w-full text-center mt-4">Our top-notch features</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3   gap-8 justify-between mt-8">
            <div className="flex flex-col gap-2 items-center  md:items-start">
              <p className="text-[24px] text-white font-semibold text-center md:text-start">Improved Trading
                Liquidity</p>
              <p className="text-[14px] text-white max-w-[360px] text-center md:text-start">Improved liquidity is achieved through
                the pooling of resources from multiple
                decentralized exchanges by theaggregator,
                resulting in a larger trading pool and
                delivering enhanced trading options and
                prices for our users.</p>
            </div>
            <div className="flex flex-col items-center  md:items-start">
              <p className="text-[24px] text-white font-semibold text-center md:text-start">Best Price
                Execution</p>
              <p className="text-[14px] text-white max-w-[360px] text-center md:text-start">As part of our sophisticated approach,
                theaggregator carefully assesses prices from various #DEXs and skillfully routes trades to the exchange with the best rates. This ensures our users secure the optimal price, enhancing their trading experience.</p>
            </div>
            <div className="flex flex-col items-center  md:items-start">
              <p className="text-[24px] text-white font-semibold text-center md:text-start">Convenience</p>
              <p className="text-[14px] text-white max-w-[360px] text-center md:text-start">TheAggregator offers a unified interface designed to facilitate seamless trading experiences. Through this platform, users can effectively execute trades across diverse Decentralized Exchanges (#DEXs), eliminating the necessity of managing numerous accounts or navigating multiple trading platforms.</p>
            </div>
          </div>
        </div>
      </section>



    </main>
  )
}
