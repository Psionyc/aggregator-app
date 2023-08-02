import Image from 'next/image'
import logo from '@/assets/main.svg'

export default function Home() {
  return (
    <div className="w-[100vw] h-[100vh] grid place-items-center">
      <div className="flex flex-col items-center">
        <Image src={logo} alt="logo"></Image>
        <p className="font-bold text-[64px]">The Aggregators</p>
      </div>
    </div>
  )
}
