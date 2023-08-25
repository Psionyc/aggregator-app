"use client";

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { erc20ABI, useAccount, useContractRead, useContractWrite } from "wagmi";
import { useEffect, useMemo, useState } from "react";
//@ts-ignore
import { ConnectKitButton } from "connectkit";
import TetrisOrderBook from "@/assets/contracts/TetrisOrderBook.json"
import { to18 } from "@/utils/decimals";
import { useToast } from "@/components/ui/use-toast";




const formSchema = z.object({
    quantity: z.coerce.number().gt(0),
    size: z.coerce.number().gt(0),
    price: z.coerce.number().gt(0),
    orderType: z.enum(["BUY", "SELL"])
})

export interface OrderBookFormProps {
    buttonText?: string
    orderFunction?: Function,
    orderType: "SELL" | "BUY"
}


export const OrderBookForm = ({ buttonText, orderFunction, orderType }: OrderBookFormProps) => {

    const [orderBookAddress, setOrderBookAddress] = useState("");
  
    const { address, isConnecting, isDisconnected, isConnected, connector } = useAccount();
    const { toast } = useToast();

    useEffect(() => {
        setOrderBookAddress(process.env.NEXT_PUBLIC_ORDERBOOK!)
    }, [])
    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onChange",
        resolver: zodResolver(formSchema),
        defaultValues: {
            orderType,
            price: 0,
            quantity: 0,
            size: 0,
        },
    })

    const { quantity, size, price } = form.getValues();

    const computedQuantity = useMemo(()=> to18(quantity), [quantity])
    const computedPrice = useMemo(()=> to18(price), [price])
    const computedSize = useMemo(()=> to18(size), [size])

    const [shouldUpdateSize, setShouldUpdateSize] = useState(true);
    const [shouldUpdateQuantity, setShouldUpdateQuantity] = useState(true);


    useEffect(() => {
        if (!shouldUpdateSize) {
            setShouldUpdateSize(true);
            return;
        }
        console.log(quantity);
        if (price !== 0) {
            const newSize = quantity / price;
            form.setValue("size", newSize);
        }
        setShouldUpdateQuantity(false)
    }, [quantity, price]);

    useEffect(() => {
        if (!shouldUpdateQuantity) {
            setShouldUpdateQuantity(true);
            return;
        }
        console.log(computedSize)
        const newQuantity = size * price;
        form.setValue("quantity", newQuantity);
        setShouldUpdateSize(false)
    }, [size, price]);

    //Order Read and Write

    const { isError: createOrderHasError, isLoading: createOrderIsLoading, write: createOrder } = useContractWrite({
        abi: TetrisOrderBook.abi,
        address: "0xEb25C051616dEE1227B71aEd158E8948309ee630",
        functionName: "createOrder",
        args: [computedQuantity, computedSize, computedPrice, orderType == "BUY" ? 0 : 1],
        onError(error) {
            toast({
                title: "Preparation Error",
                description: error.message,
            })
        },
        onSuccess(data) {
            toast({
                title: "Transaction sent successfully",
                description: data.hash,
            })
            form.reset();
        }
    })



    const { data: usdcBalance, isLoading: isLoadingUSDCBalance, isSuccess: usdcBalanceSuccess } = useContractRead({
        address: "0x1cb7AcEEcb808BE920CD9D27cecef62B21a45CA1",
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address!],
    })

    // const {config: settleOrderConfig } = usePrepareContractWrite({
    //     address: orderBookAddress as any,
    //     functionName: "createOrder",
    //     abi: TetrisOrderBook.abi,
    //     args: [quantity, size, price, orderType == "BUY" ? 0 : 1],
    // })

    // const {config: cancelOrderConfig } = usePrepareContractWrite({
    //     address: orderBookAddress as any,
    //     functionName: "createOrder",
    //     abi: TetrisOrderBook.abi,
    //     args: [quantity, size, price, orderType == "BUY" ? 0 : 1],
    // })




    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            createOrder?.();

        } catch (e) {
            console.log(e)
        }

    }



    return (<div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 text-white">
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex gap-0 relative">
                                    <div className="absolute text-white right-3 top-0 h-full  flex flex-col justify-center text-sm">USDC</div>
                                    <div className="flex items-center text-white bg-slate-700 rounded-r-none rounded-l-md px-4 border-white/30 border-[1px] text-sm">Price</div>
                                    <Input placeholder="0.001" {...field} className="rounded-l-none bg-transparent border-white/30" />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex">


                    <FormField
                        control={form.control}
                        name="size"
                        render={({ field, },) => (
                            <FormItem>
                                <FormControl>
                                    <div className="flex gap-0 relative">
                                        <div className="absolute text-white right-3 top-0 h-full  flex flex-col justify-center text-sm">ETH</div>
                                        <div className="flex items-center text-white bg-slate-700 rounded-r-none rounded-l-md px-4 border-white/30 border-[1px] text-sm">Size</div>
                                        <Input placeholder="100" {...field} className="rounded-none bg-transparent border-white/30" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="flex gap-0 relative">
                                        <div className="absolute text-white right-3 top-0 h-full  flex flex-col justify-center text-sm">USDC</div>
                                        <Input placeholder="10" {...field} className="rounded-l-none bg-transparent border-white/30" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {isConnected && !createOrderIsLoading && <Button type="submit" className="w-full bg-slate-700 mt-2">{orderType == "SELL" ? "Sell ETH" : "Buy ETH"}</Button>}


            </form>
        </Form>
        {isConnecting && <Button type="button" disabled className="w-full bg-slate-700 animate-pulse mt-2">Connecting...</Button>}

        {isDisconnected && <ConnectKitButton.Custom>
            {({ show, truncatedAddress, ensName }: { show: any, truncatedAddress: string, ensName: string }) => {
                return (
                    <Button onClick={show} className="w-full bg-slate-700 mt-2">
                        {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
                    </Button>
                );
            }}
        </ConnectKitButton.Custom>}
        {createOrderIsLoading && <Button disabled className="w-full bg-slate-700 animate-pulse mt-2">Sending Transaction...</Button>}
    </div>);
}
