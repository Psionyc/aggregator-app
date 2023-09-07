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
import { to18, to9 } from "@/utils/decimals";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers"
import { useOrderContext } from "@/app/dapp/order/OrderContext";
import { useObservable, useComputed } from "@legendapp/state/react";



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

    const context = useOrderContext()

    const { address, isConnecting, isDisconnected, isConnected, connector } = useAccount();
    const { toast } = useToast();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            orderType,
            price: 0,
            quantity: 0,
            size: 0,
        },
    })




    const { quantity, size, price } = form.watch();

    const computedQuantity = useComputed(() => format(quantity), [quantity])
    const computedPrice = useComputed(() => decimalFormat(price), [price])
    const computedSize = useComputed(() => format(size), [size])

    const computedArgs = useComputed(()=>{
        return [computedQuantity.get(), computedSize.get(), computedPrice.get(), orderType == "BUY" ? 0 : 1]
    }, [quantity, price, size])
    const lastUpdated = useObservable<"quantity" | "size">();

    function format(value: number) {
        if (Number.isNaN(value)) return BigInt(0);
        const dv = value.toString();
        if (dv.length == 0) {
            return BigInt(0)
        }
        return ethers.parseEther(dv);
    }

    function decimalFormat(value: number) {
        if (Number.isNaN(value)) return BigInt(0);
        const dv = value.toString();
        if (dv.length == 0) {
            return BigInt(0)
        }
        return ethers.parseUnits(dv, 9)
    }


    useEffect(() => {
        console.log("Computed values updated")
        // computedQuantity.set(format(quantity))
        // computedPrice.set(decimalFormat(price))
        // computedSize.set(format(size))

        console.log(computedPrice.get(), computedQuantity.get(), computedSize.get());
    }, [quantity, price, size])

    const [shouldUpdateSize, setShouldUpdateSize] = useState(true);
    const [shouldUpdateQuantity, setShouldUpdateQuantity] = useState(true);
    const [sizeUpdate, setSizeUpdate] = useState(true);


    useEffect(() => {
        if (!shouldUpdateQuantity || sizeUpdate) {
            return;
        }
        setShouldUpdateSize(false);
        console.log(quantity);
        if (price !== 0 && !Number.isNaN(price)) {
            const newSize = quantity / price;
            form.setValue("size", newSize);
        }
        setShouldUpdateSize(true)
        lastUpdated.set("quantity")
    }, [quantity]);

    useEffect(() => {
        if (!shouldUpdateSize || sizeUpdate) {
            return;
        }
        setShouldUpdateQuantity(false);
        if (!Number.isNaN(price)) {
            const newQuantity = size * price;
            form.setValue("quantity", newQuantity);
        }
        setShouldUpdateQuantity(true)
        lastUpdated.set("size")
    }, [size]);

    useEffect(() => {
        setSizeUpdate(true)
        const lu = lastUpdated.get()
        if (lu == "size") {
            const newQuantity = size * price;
            form.setValue("quantity", newQuantity);
        } else {
            if (price <= 0 || price == undefined || Number.isNaN(price)) {
                form.setValue("size", 0);
                return
            }
            const newSize = quantity / price;
            form.setValue("size", newSize);
        }

        setSizeUpdate(false)

    }, [price])

    //Order Read and Write

    const { isError: createOrderHasError, isLoading: createOrderIsLoading, write: createOrder } = useContractWrite({
        abi: TetrisOrderBook.abi,
        address: context!.contractAddress.get(),
        functionName: "createOrder",
        args: computedArgs.get(),
        onError(error) {
            toast({
                title: "Transaction Error",
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
