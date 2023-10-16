'use client';

import { OrderBookForm } from "@/components/dapp/order/OrderbookForms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { observer, useObservable } from "@legendapp/state/react"
import { ChevronDown, InfoIcon, PlusCircle } from "lucide-react";
import { erc20ABI, useAccount, useContractRead, useContractWrite, useContractEvent } from "wagmi";
import TokenDivider from "@/components/dapp/order/ui/TokenDivider";
import { Button } from "@/components/ui/button";
import { to18, toNormal } from "@/utils/decimals";
import { useEffect, useMemo, useState } from "react";
import TetrisOrderBook from "@/assets/contracts/TetrisOrderBook.json"
import { toast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import TestErc20 from "@/assets/contracts/TestERC20.json";
import { ChartComponent } from "@/components/dapp/order/ui/TradingViewChart";
import { OrderContextProvider } from "../OrderContext";
import OrderGrid from "../components/OrderGrid";
import OrderPriceLevelList from "../components/OrderPriceLevelList";
import { OrderStruct } from "../types";
import { useParams } from "next/navigation";


const OrderBook = observer(() => {

    const initialData = [
        { time: '2023-10-01', value: 1733.81 },
        { time: '2023-10-02', value: 1663.63 },
        { time: '2023-10-03', value: 1656.69 },
        { time: '2023-10-04', value: 1647.84 },
        { time: '2023-10-05', value: 1611.48 },
        { time: '2023-10-06', value: 1645.83 },
        { time: '2023-10-07', value: 1634.51 },
        { time: '2023-10-08', value: 1633.55 },
        { time: '2023-10-09', value: 1579.81 },
        { time: '2023-10-10', value: 1567.71 },
        { time: '2023-10-11', value: 1566.25 },
        { time: '2023-10-12', value: 1539.61 },
        { time: '2023-10-13', value: 1552.09 },
        { time: '2023-10-14', value: 1555.26 },
        { time: '2023-10-15', value: 1558.07 },
        { time: '2023-10-16', value: 1608.29 }
    ];

    const { address } = useAccount();
    const [quoteAllowance_, setQuoteAllowance] = useState(1e9);
    const [ethAllowance_, setBaseAllowance] = useState(1e9);



    const { contract } = useParams();

    const orderbookContract = useObservable<`0x${string}`>(contract as `0x${string}`)


    const baseTokenContract = useObservable(process.env.NEXT_PUBLIC_BASE_CONTRACT as `0x${string}`)
    const quoteTokenContract = useObservable(process.env.NEXT_PUBLIC_QUOTE_CONTRACT as `0x${string}`)

    const baseTokenSymbol = useObservable("_")
    const quoteTokenSymbol = useObservable("_")



    const { data: quoteBalance, refetch: quoteBalanceRefetch } = useContractRead({
        address: quoteTokenContract.get(),
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address!],
    })




    const { data: quoteAllowance, refetch: qoteAllowanceRefecth } = useContractRead({
        address: quoteTokenContract.get(),
        abi: erc20ABI,
        functionName: "allowance",
        args: [address!, orderbookContract.get()],
    })





    useContractRead({
        address: orderbookContract.get(),
        abi: TetrisOrderBook.abi,
        functionName: "quoteExcess",
        args: [],
        onSuccess(data) {
            console.log("The excess quote tokens gotten = ", data);
        },
    })

    useContractRead({
        address: orderbookContract.get(),
        abi: TetrisOrderBook.abi,
        functionName: "baseToken",
        args: [],
        onSuccess(data) {
            baseTokenContract.set(data as `0x${string}`)
        },
    })

    useContractRead({
        address: orderbookContract.get(),
        abi: TetrisOrderBook.abi,
        functionName: "quoteToken",
        args: [],
        onSuccess(data) {
            quoteTokenContract.set(data as `0x${string}`)
            console.log(data)
        },
    })

    const {
        data: name,
    } = useContractRead({
        address: orderbookContract.get(),
        abi: TetrisOrderBook.abi,
        functionName: "name",
        args: [],
        onSuccess(data) {

            const names = (data as string).split("/");
            baseTokenSymbol.set(names[0])
            quoteTokenSymbol.set(names[1])


        },
    })





    // const data = useSWR()

    function toReadable(amount: string, decimals: number) {
        return Number.parseFloat(ethers.formatUnits(amount, decimals));
    }


    const { data: baseBalance } = useContractRead({
        address: baseTokenContract.get(),
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address!],
    })

    const { data: baseAllowance, refetch: baseAllowanceRefecth, } = useContractRead({
        address: baseTokenContract.get(),
        abi: erc20ABI,
        functionName: "allowance",
        args: [address!, orderbookContract.get()],
    })



    const { data: orderSettlements, refetch: refetchOrderSettlements } = useContractRead({
        abi: TetrisOrderBook.abi,
        address: orderbookContract.get(),
        functionName: "getSettlementBalance",
        account: address,
    })

    useEffect(() => {
        console.log(orderSettlements);
    }, [orderSettlements])

    async function refetchData() {
        await baseAllowanceRefecth?.()
        await qoteAllowanceRefecth?.()
        await refetchOrderSettlements?.()
        await quoteBalanceRefetch?.()
        await baseAllowanceRefecth?.()
    }

    useContractEvent({
        address: orderbookContract.get(),
        abi: TetrisOrderBook.abi,
        eventName: "OrderCreated",
        async listener() {
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
        listener() {
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
            console.log("Order Cancelled", log)
            await refetchData()
        },
    })

    useContractEvent({
        address: orderbookContract.get(),
        abi: TetrisOrderBook.abi,
        eventName: "OrderDone",
        listener() {
            // toast({
            //     title: "Order Done Successfully",
            // })
        },
    })


    const { write: quoteAddAllowance } = useContractWrite({
        address: quoteTokenContract.get(),
        abi: erc20ABI,
        functionName: "approve",
        args: [orderbookContract.get(), to18(quoteAllowance_)],
        onSuccess() {
            refetchData()
        }
    })

    const { write: baseAddAllowance } = useContractWrite({
        address: baseTokenContract.get(),
        abi: erc20ABI,
        functionName: "approve",
        args: [orderbookContract.get(), to18(ethAllowance_)],
        onSuccess() {
            refetchData()
        }
    })

    const { write: baseSelfMint } = useContractWrite({
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

    const { write: quoteSelfMint } = useContractWrite({
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



    function updateBaseAllowance(value: number) {
        setBaseAllowance(value)
        baseAddAllowance?.()
    }

    function updateQuoteAllowance(value: number) {
        setQuoteAllowance(value)
        quoteAddAllowance?.()
    }

    const computedQuoteAllowance = useMemo(() => toNormal(quoteAllowance!).toString(), [quoteAllowance])
    const computedBaseAllowance = useMemo(() => toNormal(baseAllowance!).toString(), [baseAllowance])



    return (

        <OrderContextProvider value={{
            baseToken: baseTokenContract,
            contractAddress: orderbookContract,
            quoteToken: quoteTokenContract,
            account: address,
            baseSpendableBalance: baseAllowance ? baseAllowance : BigInt(0),
            quoteSpendableBalance: quoteAllowance ? quoteAllowance : BigInt(0),
            baseTokenSymbol: baseTokenSymbol,
            quoteTokenSymbol: quoteTokenSymbol
        }}>

            <main className="w-full h-full">


                <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-12 gap-2">
                    <div className="col-span-3 flex flex-col">
                        <OrderPriceLevelList />
                    </div>
                    <div className="md:col-span-6 flex-col md:flex hidden ">
                        <div className="flex gap-4 items-center bg-primary/10">
                            <div className="flex items-center px-4 py-2 border-2 border-primary/25 text-white gap-4 w-fit">
                                <p>{baseTokenSymbol.get()}/{quoteTokenSymbol.get()}</p><ChevronDown className="text-primary" />
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
                            <TokenDivider>{baseTokenSymbol.get()}</TokenDivider>
                            <div className="flex flex-col gap-2 text-white/70 font-medium my-2">
                                <p>Wallet balance: {baseBalance ? toReadable(baseBalance!.toString(), 18).toString() : 0} {baseTokenSymbol.get()}</p>
                                <p>Unsettled balance: {(orderSettlements ? toReadable((orderSettlements as any)[0], 18).toString() : "Loading")} {baseTokenSymbol.get()}</p>
                                <p>Spendable Balance : {computedBaseAllowance} {baseTokenSymbol.get()}</p>
                                <div className="flex flex-row gap-2">
                                    <Button onClick={() => updateBaseAllowance(10000)} className="w-full  bg-slate-700 ">Allow</Button>
                                    <Button disabled={orderSettlements ? toNormal((orderSettlements as any)[0]) <= 0 : true} className="w-full  bg-slate-700" onClick={() => settleBase?.()}>Settle</Button>
                                </div>
                                <Button onClick={() => baseSelfMint?.()} className="w-full  bg-slate-700 ">Faucet</Button>
                            </div>
                            <TokenDivider>{quoteTokenSymbol.get()}</TokenDivider>
                            <div className="flex flex-col gap-2 text-white/70 font-medium my-2">
                                <p>Wallet balance: {quoteBalance ? toReadable(quoteBalance!.toString(), 18).toString() : 0} {quoteTokenSymbol.get()}</p>
                                <p>Unsettled balance: {(orderSettlements ? toReadable((orderSettlements as any)[1], 18) : "Loading")} {quoteTokenSymbol.get()}</p>
                                <p>Spendable Balance : {computedQuoteAllowance} {quoteTokenSymbol.get()} </p>
                                <div className="flex flex-row gap-2">
                                    <Button onClick={() => updateQuoteAllowance(10000)} className="w-full  bg-slate-700 ">Allow</Button>
                                    <Button disabled={orderSettlements ? toNormal((orderSettlements as any)[1]) <= 0 : true} className="w-full  bg-slate-700 " onClick={() => settleQuote?.()}>Settle</Button>
                                </div>
                                <Button onClick={() => quoteSelfMint?.()} className="w-full  bg-slate-700 ">Faucet</Button>
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
})

export default OrderBook;