"use client"

import { useContractRead } from "wagmi";
import OrderListItem from "@/components/dapp/order/ui/OrderListItem";
import OrderSortTab from "@/components/dapp/order/ui/OrderSortTab";
import { useOrderContext } from "../OrderContext";
import Tetris from "@/assets/contracts/TetrisOrderBook.json"
import { useEffect } from "react";
import { OrderStruct } from "../types";

function OrderGrid() {

    const context = useOrderContext()

    const { isLoading, isError, data: orderListData } = useContractRead({
        abi: Tetris.abi,
        functionName: "getOrders",
        address: context!.contractAddress!.get(),
        args: [context?.account]
    })



    useEffect(() => {
        console.log(orderListData)
    }, [orderListData])



    return (
        <section className="user-orders w-full">
            <div className="w-full flex flex-col gap-y-4">
                <div className="flex sort-parameters gap-4 w-full h-10">
                    <OrderSortTab className="bg-white/40">OPEN</OrderSortTab>
                    <OrderSortTab>CANCELLED</OrderSortTab>
                    <OrderSortTab>DONE</OrderSortTab>
                    <OrderSortTab>ALL</OrderSortTab>

                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
                    {
                        (orderListData as Array<OrderStruct>) && (orderListData as Array<OrderStruct>).map((v) => {
                            return <OrderListItem price={v.price} inputSize={v.inputSize} inputQuantity={v.inputQuantity} key={v.id.toString()} quantity={v.quantity} size={v.size} orderType={v.orderType == BigInt(0) ? "BUY" : "SELL"} id={v.id} orderState={v.orderState} />
                        })
                    }
                </div>
            </div>
        </section>);
}

export default OrderGrid;