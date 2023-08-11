import DappCard from "@/components/dapp/DappCard";
import Image from 'next/image'
import backImage from "@/assets/icons/back_image.svg"

function Dapp() {
    return (

        <main>
            <Image src={backImage} alt="back image" className={`fixed z-[-1] top-0 left-0 transition-all ease-linear opacity-40 md:opacity-100 scale-150 sm:scale-100`} style={{

            }} />
            <h2 className="text-white text-[48px] xl:text-[60px] font-[900]  mb-4 md:mb-8 text-center md:text-start mt-4 mb:mt-4">Our <span className="text-primary">Powerful DeFi</span> Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 md:gap-8">
                <DappCard description={`Our state-of-the-art platform hosts a Limit Orderbook Exchange 
                that provides traders with an unparalleled level of trading precision
                . Users can place meticulously organized orders, 
                thereby optimizing their trading strategies. 
                This feature is designed to cater to both experienced traders who demand advanced order 
                options and newcomers looking for a user-friendly experience`} />
                <DappCard title="Dex Aggregator" description={`The heart of "TheAggregator" lies in its Dex Aggregator, which pools liquidity from a diverse range of decentralized exchanges. By aggregating liquidity, we empower traders with enhanced access to assets and the potential for more favorable trading outcomes. This approach reflects our commitment to democratizing the trading experience and leveling the playing field for all traders`} />
                <DappCard title="Portfolio Management" description={`Our integrated Portfolio Manager is a game-changer for individuals 
                seeking efficient management of diversified assets. 
                Through a unified platform, users can oversee and manage 
                a wide array of assets, streamlining decision-making and offering 
                insights for strategic portfolio adjustments. 
                This tool underscores our commitment to empowering users 
                with robust and user-friendly financial management solutions`} />
                <DappCard title="Perpetual Trading" description={`
                With "TheAggregator," traders can embark on new horizons by engaging in perpetual contracts. This revolutionary feature
                 introduces a dynamic element to trading, 
                enabling users to hold positions without an expiration date. 
                The perpetual trading capabilities are a testament to our dedication to fostering 
                innovation and diversification in trading strategies`} />
                
            </div>
        </main>
    );
}

export default Dapp;