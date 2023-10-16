'use client';

import { useObservable } from "@legendapp/state/react"
import { erc20ABI, useAccount, useContractRead, useContractWrite, useContractEvent } from "wagmi";
import { Button } from "@/components/ui/button";
import { to18, toNormal } from "@/utils/decimals";
import { useEffect, useMemo, useState } from "react";
import TetrisOrderBook from "@/assets/contracts/TetrisOrderBook.json"
import { toast } from "@/components/ui/use-toast";

import { ethers } from "ethers";
import TestErc20 from "@/assets/contracts/TestERC20.json";


import TokenDivider from "./ui/TokenDivider";
import { OrderStruct } from "@/app/dapp/order/types";
import { useOrderContext } from "@/app/dapp/order/OrderContext";

const OrderBookUserData = () => {

    const { address } = useAccount();
    const [usdcAllowance_, setUsdcAllowance] = useState(1e9);
    const [ethAllowance_, setEthAllowance] = useState(1e9);
    const context = useOrderContext()

    const orderbookContract = useObservable<`0x${string}`>(process.env.NEXT_PUBLIC_ORDERBOOK_CONTRACT as `0x${string}`)
    const baseTokenContract = useObservable(process.env.NEXT_PUBLIC_BASE_CONTRACT as `0x${string}`)
    const quoteTokenContract = useObservable(process.env.NEXT_PUBLIC_QUOTE_CONTRACT as `0x${string}`)



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
        await refetchOrderSettlements?.()
        await usdcBalanceRefetch?.()
        await ethAllowanceRefecth?.()
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
            refetchData()
        }
    })

    const { write: ethAddAllowance } = useContractWrite({
        address: baseTokenContract.get(),
        abi: erc20ABI,
        functionName: "approve",
        args: [orderbookContract.get(), to18(ethAllowance_)],
        onSuccess() {
            refetchData()
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

    return (        <div className="flex px-4 py-4 border-primary/25 border-2 flex-col bg-primary/10">
    <TokenDivider>ETH</TokenDivider>
    <div className="flex flex-col gap-2 text-white/70 font-medium my-2">
        <p>Wallet balance: {ethBalance ? toReadable(ethBalance!.toString(), 18).toString() : 0} ETH</p>
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
        <p>Wallet balance: {usdcBalance ? toReadable(usdcBalance!.toString(), 18).toString() : 0} USDC</p>
        <p>Unsettled balance: {(orderSettlements ? toReadable((orderSettlements as any)[1], 18) : "Loading")} USDC</p>
        <p>Spendable Balance : {computedUsdcAllowance} USDC </p>
        <div className="flex flex-row gap-2">
            <Button onClick={() => updateUsdcAllowance(10000)} className="w-full  bg-slate-700 ">Allow</Button>
            <Button disabled={orderSettlements ? toNormal((orderSettlements as any)[1]) <= 0 : true} className="w-full  bg-slate-700 " onClick={() => settleQuote?.()}>Settle</Button>
        </div>
        <Button onClick={() => usdcSelfMint?.()} className="w-full  bg-slate-700 ">Faucet</Button>
    </div>
</div> );
}
 
export default OrderBookUserData;