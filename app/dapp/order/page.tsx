'use client';

import { OrderBookForm } from "@/components/dapp/order/OrderbookForms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation";
import { useComputed, useObservable } from "@legendapp/state/react"
import { ChevronDown, InfoIcon, PlusCircle } from "lucide-react";
import { erc20ABI, useAccount, useContractRead, useContractWrite, useContractEvent, useWaitForTransaction } from "wagmi";
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
import { Code2 } from "lucide-react"
import { useQuery } from "@apollo/client";
import { GET_PRICE_LEVEL_BUYS, GET_PRICE_LEVEL_SELLS } from "@/graphql/queries"
import { ethers } from "ethers";
import TestErc20 from "@/assets/contracts/TestERC20.json";
import { OrderContextProvider } from "./OrderContext";
import OrderGrid from "./components/OrderGrid";
import { OrderStruct } from "./types";
import { ChartComponent } from "@/components/dapp/order/ui/TradingViewChart";

const OrderBook = () => {
    const { address } = useAccount();
    const [usdcAllowance_, setUsdcAllowance] = useState(1000);
    const [ethAllowance_, setEthAllowance] = useState(1000);

    const orderbookContract = useObservable<`0x${string}`>(process.env.NEXT_PUBLIC_ORDERBOOK_CONTRACT as `0x${string}`)
    const baseTokenContract = useObservable(process.env.NEXT_PUBLIC_BASE_CONTRACT as `0x${string}`)
    const quoteTokenContract = useObservable(process.env.NEXT_PUBLIC_QUOTE_CONTRACT as `0x${string}`)


    const initialData = [
        { time: '2018-12-22', value: 1232.51 },
        { time: '2018-12-23', value: 1271.11 },
        { time: '2018-12-24', value: 1227.02 },
        { time: '2018-12-25', value: 1257.32 },
        { time: '2018-12-26', value: 1225.17 },
        { time: '2018-12-27', value: 1328.89 },
        { time: '2018-12-28', value: 1225.46 },
        { time: '2018-12-29', value: 1223.92 },
        { time: '2018-12-30', value: 1322.68 },
        { time: '2018-12-31', value: 1322.67 },
    ];


    const { data: usdcBalance, isLoading: isLoadingUSDCBalance, isSuccess: usdcBalanceSuccess, refetch: usdcBalanceRefetch } = useContractRead({
        address: quoteTokenContract.get(),
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address!],
    })

    const { data: usdcAllowance, isLoading: isLoadingUSDCAllowance, isSuccess: usdcAllowanceSuccess, refetch: usdcAllowanceRefecth } = useContractRead({
        address: quoteTokenContract.get(),
        abi: erc20ABI,
        functionName: "allowance",
        args: [address!, orderbookContract.get()],
    })

    const {
        data: buyOrderLevels, isLoading: buyOrderLevelsLoading, refetch: buyOrderRefetch
    } = useContractRead({
        address: orderbookContract.get(),
        abi: TetrisOrderBook.abi,
        functionName: "getBuyPriceLevels",
        args: []
    })

    const {
        data: lastPrice, isLoading: lastPriceLoading, refetch: lastPriceRefetch
    } = useContractRead({
        address: orderbookContract.get(),
        abi: TetrisOrderBook.abi,
        functionName: "lastPrice",
        args: []
    })

    const {
        data: sellOrderLevels, isLoading: sellOrderLevelsLoading, refetch: sellOrderRefetch
    } = useContractRead({
        address: orderbookContract.get(),
        abi: TetrisOrderBook.abi,
        functionName: "getSellPriceLevels",
        args: []
    })

    const buyPriceLevels = useComputed(() => {
        if (buyOrderLevels) {
            return (buyOrderLevels as Array<any>).sort((a, b) => Number(b.price) - Number(a.price))
        }
        return []
    }, [buyOrderLevels])

    const sellPriceLevels = useComputed(() => {
        if (sellOrderLevels) {
            return (sellOrderLevels as Array<any>).sort((a, b) => Number(b.price) - Number(a.price))
        }
        return []
    }, [sellOrderLevels])




    // const data = useSWR()

    function toReadable(amount: string, decimals: number) {
        return Number.parseFloat(ethers.formatUnits(amount, decimals));
    }


    const { data: ethBalance, isLoading: isLoadingETHBalance, isSuccess: ethBalanceSuccess, refetch: ethBalanceRefetch } = useContractRead({
        address: baseTokenContract.get(),
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address!],
    })

    const { data: ethAllowance, isLoading: isLoadingETHAllowance, isSuccess: ethAllowanceSuccess, refetch: ethAllowanceRefecth, } = useContractRead({
        address: baseTokenContract.get(),
        abi: erc20ABI,
        functionName: "allowance",
        args: [address!, orderbookContract.get()],
    })



    const { data: orderSettlements, isLoading: orderSettlementsIsLoading, refetch: refetchOrderSettlements } = useContractRead({
        abi: TetrisOrderBook.abi,
        address: orderbookContract.get(),
        functionName: "getSettlementBalance",
        account: address,
    })

    useEffect(() => {
        console.log(orderSettlements);
    }, [orderSettlements])

    async function refetchData() {
        await ethAllowanceRefecth?.()
        await usdcAllowanceRefecth?.()
        await sellOrderRefetch?.()
        await buyOrderRefetch?.()
        await refetchOrderSettlements?.()
        await usdcBalanceRefetch?.()
        await ethAllowanceRefecth?.()
        await lastPriceRefetch?.()
    }


    useContractEvent({
        address: orderbookContract.get(),
        abi: TetrisOrderBook.abi,
        eventName: "OrderCreated",
        async listener(log) {
            toast({
                title: "New Order Created",
            })

            await refetchData()
        },
    })

    // useContractEvent({
    //     address: orderbookContract.get(),
    //     abi: TetrisOrderBook.abi,
    //     eventName: "OrderCreated",
    //     async listener(log) {
    //         toast({
    //             title: "Order Created Successfully",
    //         })

    //         await refetchData()
    //     },
    // })

    useContractEvent({
        address: orderbookContract.get(),
        abi: TetrisOrderBook.abi,
        eventName: "OrderMatched",
        listener(log) {
            toast({
                title: "Order Matched Successfully",
            })

        },
    })

    useContractEvent({
        address: orderbookContract.get(),
        abi: TetrisOrderBook.abi,
        eventName: "OrderCancelled",
        async listener(log: any) {
            const order = log.args.order as OrderStruct
            console.log("Order Cancelled", log)
            await refetchData()
        },
    })

    useContractEvent({
        address: orderbookContract.get(),
        abi: TetrisOrderBook.abi,
        eventName: "OrderDone",
        listener(log) {
            // toast({
            //     title: "Order Done Successfully",
            // })
        },
    })


    const { write: usdcAddAllowance } = useContractWrite({
        address: quoteTokenContract.get(),
        abi: erc20ABI,
        functionName: "approve",
        args: [orderbookContract.get(), to18(usdcAllowance_)],
        onSuccess() {
            usdcAllowanceRefecth?.()
        }
    })

    const { write: ethAddAllowance } = useContractWrite({
        address: baseTokenContract.get(),
        abi: erc20ABI,
        functionName: "approve",
        args: [orderbookContract.get(), to18(ethAllowance_)],
        onSuccess() {
            ethAllowanceRefecth?.()
        }
    })

    const { write: ethSelfMint } = useContractWrite({
        address: baseTokenContract.get(),
        abi: TestErc20.abi,
        functionName: "selfMint",
        async onSuccess() {
            toast({
                title: "Token Faucetted Successfully",
            })
            await refetchData()

        }
    })

    const { write: usdcSelfMint, data: usdcSelfMintData } = useContractWrite({
        address: quoteTokenContract.get(),
        abi: TestErc20.abi,
        functionName: "selfMint",
        async onSuccess() {
            toast({
                title: "Token Faucetted Successfully",
            })
            await refetchData()
        }
    })

    const { write: settleBase } = useContractWrite({
        address: orderbookContract.get(),
        abi: TetrisOrderBook.abi,
        functionName: "settleBaseToken",
        async onSuccess() {
            await refetchData()
        }
    })

    const { write: settleQuote } = useContractWrite({
        address: orderbookContract.get(),
        abi: TetrisOrderBook.abi,
        functionName: "settleQuoteToken",
        async onSuccess() {
            await refetchData()
        }
    })



    function updateETHAllowance(value: number) {
        setEthAllowance(value)
        ethAddAllowance?.()
    }

    function updateUsdcAllowance(value: number) {
        setUsdcAllowance(value)
        usdcAddAllowance?.()
    }

    const computedUsdcAllowance = useMemo(() => toNormal(usdcAllowance!).toString(), [usdcAllowance])
    const computedETHAllowance = useMemo(() => toNormal(ethAllowance!).toString(), [ethAllowance])



    return (

        <OrderContextProvider value={{
            baseToken: baseTokenContract,
            contractAddress: orderbookContract,
            quoteToken: quoteTokenContract,
            account: address,
            baseSpendableBalance: ethAllowance ? ethAllowance : BigInt(0),
            quoteSpendableBalance: usdcAllowance ? usdcAllowance : BigInt(0),
            lastPrice: lastPrice ? lastPrice as bigint : BigInt(0),
        }}>

            <main className="w-full h-full">


                <div suppressHydrationWarning className="grid grid-cols-12 gap-2">
                    <div className="col-span-3 flex flex-col">
                        <div className="orderbookSection flex flex-col gap-2 border-primary/25 border-[1px] px-4 py-4 bg-primary/10">
                            <p className="text-primary">Orderbook</p>

                            <div className="grid grid-cols-2 text-white text-sm">
                                <div className="main flex items-start flex-col">
                                    <p>Size(ETH)</p>
                                </div>
                                <div className="quote flex items-end flex-col">
                                    <p>Price(USDT)</p>
                                </div>
                            </div>

                            <div className="flex flex-col">

                                {sellOrderLevelsLoading && <p className="animate-pulse text-white w-full text-center">Loading...</p>}
                                {
                                    (sellOrderLevels as any) && (sellPriceLevels.get() as Array<any>).map((v) => {

                                        return <OrderBookListItem key={Math.random()} size={toReadable(v.size as string, 18)} price={toReadable(v.price as string, 9)} percantage={Math.random() * 100} orderType="SELL" />
                                    })
                                }


                                <p className="text-green-500 font-semibold w-full text-center my-2">{lastPrice ? toReadable(lastPrice as string, 9) : "Loading"}</p>

                                {buyOrderLevelsLoading && <p className="animate-pulse text-white w-full text-center">Loading...</p>}
                                {
                                    buyOrderLevels && (buyPriceLevels.get() as Array<any>).map((v) => {
                                        console.log(v)

                                        return <OrderBookListItem key={Math.random()} size={toReadable(v.size as string, 18)} price={toReadable(v.price as string, 9)} percantage={Math.random() * 100} />
                                    })
                                }

                            </div>
                        </div>

                        <div className="flex flex-col bg-primary/10 h-[100%] mt-2 border-primary/25 border-[1px] p-4">
                            <div className="layer-1">
                                <p className="text-primary font-medium">Order Events</p>
                            </div>

                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                <Code2 size={40} className="text-white" />
                                <p className="font-semibold text-center text-white">In Development</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-6 flex-col flex  ">
                        <div className="flex gap-4 items-center bg-primary/10">
                            <div className="flex items-center px-4 py-2 border-2 border-primary/25 text-white gap-4 w-fit">
                                <p>ETH/USDC</p><ChevronDown className="text-primary" />
                            </div>
                            <PlusCircle className="text-primary" />
                            <InfoIcon className="text-primary" />
                        </div>
                        <ChartComponent data={initialData} />
                        {/* <div className="flex flex-col border-primary/25 border-[1px] mt-2 h-full bg-primary/10"></div> */}
                    </div>
                    <div className="col-span-3 flex-col gap-y-4 flex  ">
                        <div className="flex px-4 py-4 border-primary/25 border-2 flex-col bg-primary/10">
                            <Tabs defaultValue="account" className="w-full">
                                <TabsList className="flex justify-center w-full px-0">
                                    <TabsTrigger value="account" className="w-full bg-transparent border-r-0">BUY</TabsTrigger>
                                    <TabsTrigger value="password" className="w-full bg-transparent border-l-0 data-[state=active]:bg-red-500">SELL</TabsTrigger>
                                </TabsList>
                                <TabsContent value="account"><OrderBookForm orderType="BUY" /></TabsContent>
                                <TabsContent value="password"><OrderBookForm orderType="SELL" /></TabsContent>
                            </Tabs>
                        </div>
                        <div className="flex px-4 py-4 border-primary/25 border-2 flex-col bg-primary/10">
                            <TokenDivider>ETH</TokenDivider>
                            <div className="flex flex-col gap-2 text-white/70 font-medium my-2">
                                <p>Wallet balance: {toNormal(ethBalance!).toString()} ETH</p>
                                <p>Unsettled balance: {(orderSettlements ? toReadable((orderSettlements as any)[0], 18).toString() : "Loading")} ETH</p>
                                <p>Spendable Balance : {computedETHAllowance} ETH</p>
                                <div className="flex flex-row gap-2">
                                    <Button onClick={() => updateETHAllowance(10000)} className="w-full  bg-slate-700 ">Allow</Button>
                                    <Button disabled={orderSettlements ? toNormal((orderSettlements as any)[0]) <= 0 : true} className="w-full  bg-slate-700" onClick={() => settleBase?.()}>Settle</Button>
                                </div>
                                <Button onClick={() => ethSelfMint?.()} className="w-full  bg-slate-700 ">Faucet</Button>
                            </div>
                            <TokenDivider>USDC</TokenDivider>
                            <div className="flex flex-col gap-2 text-white/70 font-medium my-2">
                                <p>Wallet balance: {toNormal(usdcBalance ?? BigInt(100)).toString()} USDC</p>
                                <p>Unsettled balance: {(orderSettlements ? toReadable((orderSettlements as any)[1], 18) : "Loading")} USDC</p>
                                <p>Spendable Balance : {computedUsdcAllowance} USDC </p>
                                <div className="flex flex-row gap-2">
                                    <Button onClick={() => updateUsdcAllowance(10000)} className="w-full  bg-slate-700 ">Allow</Button>
                                    <Button disabled={orderSettlements ? toNormal((orderSettlements as any)[1]) <= 0 : true} className="w-full  bg-slate-700 " onClick={() => settleQuote?.()}>Settle</Button>
                                </div>
                                <Button onClick={() => usdcSelfMint?.()} className="w-full  bg-slate-700 ">Faucet</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex  w-full gap-2 mt-4">
                    {/* <OrderTable orders={userOrdersList as any} /> */}
                    <OrderGrid />
                </div>



            </main>
        </OrderContextProvider>
    );
}

export default OrderBook;