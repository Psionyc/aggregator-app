'use client';

import { OrderBookForm } from "@/components/dapp/order/OrderbookForms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ChevronDown, InfoIcon, PlusCircle } from "lucide-react";
import { erc20ABI, useAccount, useContractRead, useContractWrite, useContractEvent } from "wagmi";
import TokenDivider from "@/components/dapp/order/ui/TokenDivider";
import { Button } from "@/components/ui/button";
import { to18, toNormal } from "@/utils/decimals";
import { useEffect, useMemo, useState } from "react";
import OrderCard from "@/components/dapp/order/ui/OrderCard";
import TetrisOrderBook from "@/assets/contracts/TetrisOrderBook.json"
import OrderTable from "@/components/dapp/order/OrderTable";
import { toast } from "@/components/ui/use-toast";
import OrderChart from "@/components/dapp/order/OrderChart";
import OrderBookListItem from "@/components/dapp/order/ui/OrderBookList";

const OrderBook = () => {
    const { address } = useAccount();
    const [usdcAllowance_, setUsdcAllowance] = useState(1000);
    const [ethAllowance_, setEthAllowance] = useState(1000);

    //Reads//

    const { data: usdcBalance, isLoading: isLoadingUSDCBalance, isSuccess: usdcBalanceSuccess } = useContractRead({
        address: "0x1cb7AcEEcb808BE920CD9D27cecef62B21a45CA1",
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address!],
    })

    const { data: usdcAllowance, isLoading: isLoadingUSDCAllowance, isSuccess: usdcAllowanceSuccess, refetch: usdcAllowanceRefecth } = useContractRead({
        address: "0x1cb7AcEEcb808BE920CD9D27cecef62B21a45CA1",
        abi: erc20ABI,
        functionName: "allowance",
        args: [address!, "0xEb25C051616dEE1227B71aEd158E8948309ee630"],
    })

    const { data: ethBalance, isLoading: isLoadingETHBalance, isSuccess: ethBalanceSuccess } = useContractRead({
        address: "0xD2eC4f4EE95470CEB1fBE30cC2bd5D840E508387",
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address!],
    })

    const { data: ethAllowance, isLoading: isLoadingETHAllowance, isSuccess: ethAllowanceSuccess, refetch: ethAllowanceRefecth, } = useContractRead({
        address: "0xD2eC4f4EE95470CEB1fBE30cC2bd5D840E508387",
        abi: erc20ABI,
        functionName: "allowance",
        args: [address!, "0xEb25C051616dEE1227B71aEd158E8948309ee630"],
    })

    const { data: userOrdersList } = useContractRead({
        abi: TetrisOrderBook.abi,
        address: "0xEb25C051616dEE1227B71aEd158E8948309ee630",
        functionName: "getOrdersBy",
        args: [address]

    })

    useContractEvent({
        address: '0xEb25C051616dEE1227B71aEd158E8948309ee630',
        abi: TetrisOrderBook.abi,
        eventName: "OrderCreated",
        listener(log) {
            console.log(log)
            toast({
                title: "Order Created",
                description: log.toString(),
            })
        },
    })

    useEffect(() => {
        console.log(usdcAllowance)
        console.log(userOrdersList)
    }, [usdcAllowance, userOrdersList])

    //Writes//



    const { write: usdcAddAllowance } = useContractWrite({
        address: "0x1cb7AcEEcb808BE920CD9D27cecef62B21a45CA1",
        abi: erc20ABI,
        functionName: "approve",
        args: ["0xEb25C051616dEE1227B71aEd158E8948309ee630", to18(usdcAllowance_)],
        onSuccess() {
            usdcAllowanceRefecth?.()
        }
    })

    const { write: ethAddAllowance } = useContractWrite({
        address: "0xD2eC4f4EE95470CEB1fBE30cC2bd5D840E508387",
        abi: erc20ABI,
        functionName: "approve",
        args: ["0xEb25C051616dEE1227B71aEd158E8948309ee630", to18(ethAllowance_)],
        onSuccess() {
            ethAllowanceRefecth?.()
        }
    })

    function updateETHAllowance(value: number) {
        setEthAllowance(value)
        console.log(ethAllowance_)
        ethAddAllowance?.()
    }

    function updateUsdcAllowance(value: number) {
        setUsdcAllowance(value)
        usdcAddAllowance?.()
    }

    const computedUsdcAllowance = useMemo(() => toNormal(usdcAllowance!).toString(), [usdcAllowance])
    const computedETHAllowance = useMemo(() => toNormal(ethAllowance!).toString(), [ethAllowance])



    return (<main className=" w-full h-full">
        {/* <div className="flex gap-2">
            <div className=" bg-red-500 h-full w-[20%] flex flex-col gap-2">
                    <div className="bg-black/20 h-[200px] w-full" />
                    <div className="bg-black/50 h-[200px] w-full" />
            </div>
            <div className=" bg-green-500 h-[100%] w-[60%]"></div>
            <div className=" bg-blue-500 h-[100%] w-[20%]"></div>

        </div> */}

        <div suppressHydrationWarning className="grid grid-cols-12 gap-2">
            <div className="col-span-3 flex flex-col">
                <div className="orderbookSection flex flex-col gap-2 border-primary border-[1px] p-4 bg-primary/20">
                    <p className="text-primary">Orderbook</p>

                    <div className="grid grid-cols-2 text-white text-sm">
                        <div className="main flex items-center flex-col">
                            <p>Size(ETH)</p>
                        </div>
                        <div className="quote flex items-center flex-col">
                            <p>Price(USDT)</p>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <OrderBookListItem size={10} price={10} percantage={35} orderType="SELL" />
                        <OrderBookListItem size={10} price={10} percantage={40} orderType="SELL" />
                        <OrderBookListItem size={10} price={10} percantage={37} orderType="SELL" />
                        <OrderBookListItem size={10} price={10} percantage={76} orderType="SELL" />

                        <p className="text-green-500 font-semibold w-full text-center my-2">24.002</p>

                        <OrderBookListItem size={10} price={10} percantage={35} />
                        <OrderBookListItem size={10} price={10} percantage={40} />
                        <OrderBookListItem size={10} price={10} percantage={55} />
                        <OrderBookListItem size={10} price={10} percantage={76} />
                    </div>
                </div>

                <div className="flex bg-primary/20 h-[100%] mt-2 border-primary border-[1px]">

                </div>
            </div>
            <div className="col-span-6 flex-col flex  ">
                <div className="flex gap-4 items-center bg-primary/20">
                    <div className="flex items-center px-4 py-2 border-2 border-primary text-white gap-4 w-fit">
                        <p>ETH/USDC</p><ChevronDown className="text-primary" />
                    </div>
                    <PlusCircle className="text-primary" />
                    <InfoIcon className="text-primary" />
                </div>
                <OrderChart />
                {/* <div className="flex flex-col border-primary border-[1px] mt-2 h-full bg-primary/20"></div> */}
            </div>
            <div className="col-span-3 flex-col gap-y-4 flex  ">
                <div className="flex px-4 py-4 border-primary border-2 flex-col bg-primary/20">
                    <Tabs defaultValue="account" className="w-full">
                        <TabsList className="flex justify-center w-full px-0">
                            <TabsTrigger value="account" className="w-full bg-transparent border-r-0">BUY</TabsTrigger>
                            <TabsTrigger value="password" className="w-full bg-transparent border-l-0 data-[state=active]:bg-red-500">SELL</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account"><OrderBookForm orderType="BUY" /></TabsContent>
                        <TabsContent value="password"><OrderBookForm orderType="SELL" /></TabsContent>
                    </Tabs>
                </div>
                <div className="flex px-4 py-4 border-primary border-2 flex-col bg-primary/20">
                    <TokenDivider>ETH</TokenDivider>
                    <div className="flex flex-col gap-2 text-white/70 font-medium my-2">
                        <p>Wallet balance: {toNormal(ethBalance!).toString()} ETH</p>
                        <p>Unsettled balance: {0} ETH</p>
                        <p>Spendable Balance : {computedETHAllowance} ETH</p>
                        <div className="flex flex-row gap-2">
                            <Button onClick={() => updateETHAllowance(1000)} className="w-full">Allow</Button>
                            <Button onClick={() => updateETHAllowance(0)} className="w-full">Unallow</Button>
                        </div>
                    </div>
                    <TokenDivider>USDC</TokenDivider>
                    <div className="flex flex-col gap-2 text-white/70 font-medium my-2">
                        <p>Wallet balance: {toNormal(usdcBalance ?? BigInt(100)).toString()} USDC</p>
                        <p>Unsettled balance: {0} USDC</p>
                        <p>Spendable Balance : {computedUsdcAllowance} USDC </p>
                        <div className="flex flex-row gap-2">
                            <Button onClick={() => updateUsdcAllowance(1000)} className="w-full">Allow</Button>
                            <Button onClick={() => updateUsdcAllowance(0)} className="w-full">Unallow</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex  w-full gap-2 mt-4">
            <OrderTable orders={userOrdersList as any} />
        </div>



    </main>);
}

export default OrderBook;