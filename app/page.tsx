'use client'


import Image from 'next/image'
import logo from '@/assets/main.svg'
import hero from "@/assets/images/ipad.png"
import back_image from "@/assets/icons/back_image.svg"
import { Button } from '@/components/ui/button'
import { useWindowScroll, useWindowSize } from "@reactuses/core"
import { useEffect, useRef, useState } from 'react'

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


    <main className="w-full  px-[10px] md:px-[80px] lg:px-[100px] xl:[200px] text-white">

      {/* <div  className="overlay z-10 bg-black w-full h-full fixed top-0 left-0 flex items-center justify-center  lg:hidden">
            <p className="font-bold text-center text-[24px]">This Device Is Currently Unsupported</p>
            
      </div> */}

      <Image src={back_image} alt="back image" className={`fixed z-[-1] top-0 left-0 transition-all ease-linear opacity-40 md:opacity-100 scale-150 sm:scale-100`} style={{
        top: -y
      }} />

      <div className="grid grid-cols-1 md:grid-cols-2">

        <div className="flex flex-col gap-4 mt-[50px] md:mt-[100px] justify-center items-center md:items-start sm:justify-start">
          <p className="text-[48px] text-center sm:text-start sm:text-[60px] xl:text-[60px] font-[900] tracking-tighter space-y-[-5px]">Powerful <span className="text-[#68E4FF]">Dex</span> <br /> Aggregator</p>
          <p className="text-[16px] md:text-[20px] font-medium text-center md:text-start">
            That offers seamless DeFi experience to
            traders and builders, Securing Best Prices
            for You Eternally!
          </p>
          <div className="flex flex-row gap-4">
            <Button className="bg-[#68E4FF] text-black">Launch Dapp</Button>
            <Button variant={"outline"} className="">Docs</Button>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center ">
          <Image src={hero} alt="hero" className='w-full mt-8 md:t-0 max-w-[480px] md:max-w-[512px' />
        </div>
      </div>

      <section className="mt-[100px]">
        <div className="flex flex-col">
          <p className="font-bold text-[#68E4FF] text-4xl w-full text-center">What we offer</p>
          <p className="font-medium text-white text-md w-full text-center mt-4">Theaggregator is the most powerful DEX aggregator on Base Network</p>
          <div className="flex flex-col md:flex-row gap-8 justify-center mt-4 font-semibold">
            <div className="flex p-8 border-[2px] border-[#68E4FF] rounded-[12px] text-[18px] md:text-[24px] justify-center text-center">SWAP AGGREGATOR</div>
            <div className="flex p-8 border-[2px] border-[#68E4FF] rounded-[12px] text-[18px] md:text-[24px] justify-center text-center">PORTFOLIO
              MANAGEMENT</div>
          </div>
        </div>
      </section>

      <section className="mt-[100px]">
        <div className="flex flex-col items-center md:items-start">
          <p className="font-bold text-[#68E4FF] text-4xl w-full text-center">Features</p>
          <p className="font-medium text-white text-md w-full text-center mt-4">Theaggregator is the most powerful DEX aggregator on Base Network</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-8  gap-8 justify-between mt-8">
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
              <p className="text-[14px] text-white max-w-[360px] text-center md:text-start">Theaggregator provide a single
                interface for trading, enabling
                users to execute trades across
                different #DEXs without the
                need to handle multiple accounts
                or platforms.</p>
            </div>
          </div>
        </div>
      </section>



    </main>
  )
}
