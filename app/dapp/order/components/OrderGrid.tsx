"use client"

import { useAccount, useContractEvent, useContractRead } from "wagmi";
import OrderSortTab from "@/components/dapp/order/ui/OrderSortTab";
import { useOrderContext } from "../OrderContext";
import Tetris from "@/assets/contracts/TetrisOrderBook.json"
import { OrderState, OrderStruct } from "@/types/order";
import { observer, useComputed, useObservable } from "@legendapp/state/react";
import OrderListCardCombined from "@/components/dapp/order/ui/OrderListCardCombined";
import { Button } from "@nextui-org/react";
import { cn } from "@/lib/utils";
import OrderGridSearchBar from "@/components/dapp/order/ui/OrderGridSearchBar";


const OrderGrid = observer(() => {
    const context = useOrderContext()
    const { address } = useAccount();

    const baseTokenSymbol = context!.baseTokenSymbol;
    const quoteTokenSymbol = context!.quoteTokenSymbol

    const orderState = useObservable(OrderState.OPEN)
    const maxShown = useObservable(5)
    const maxShownMobile = useObservable(2)

    const allOrders = useObservable<Array<OrderStruct>>([]);
    const cancelledOrders = useComputed<Array<OrderStruct>>(() => {
        return allOrders.get().filter((v) =>
            v.orderState == BigInt(OrderState.CANCEL)
        )
    })

    const openOrders = useComputed<Array<OrderStruct>>(() => {
        return allOrders.get().filter((v) =>
            v.orderState == BigInt(OrderState.OPEN)
        )
    })
    const doneOrders = useComputed<Array<OrderStruct>>(() => {

        return allOrders.get().filter((v) =>
            v.orderState == BigInt(3)
        )
    })

    const currentDisplayedOrders = useComputed<Array<OrderStruct>>(() => {
        let orders: Array<OrderStruct> = []
        switch (orderState.get()) {
            case OrderState.ALL:
                orders = allOrders.get();
                break;
            case OrderState.OPEN:
                orders = openOrders.get();
                break;
            case OrderState.CANCEL:
                orders = cancelledOrders.get();
                break;
            case OrderState.DONE:
                orders = doneOrders.get();
                break;

            default:
                orders = openOrders.get();
                break;
        }

        const returnedOrders: Array<OrderStruct> = []

        orders.forEach((v, i) => {
            if (i < maxShown.get()) {
                returnedOrders.push(v);
            }
        })

        return returnedOrders;
    }, [orderState, maxShownMobile, maxShown])



    const { isLoading, isError, data: orderListData, refetch: refetchOrders } = useContractRead({
        abi: Tetris.abi,
        functionName: "getOrders",
        address: context!.contractAddress!.get(),
        args: [context?.account],
        onSuccess(data: any) {
            console.log("Order List", data as Array<OrderStruct>)
            allOrders.set(data);
        }
    })

    useContractEvent({
        address: context?.contractAddress.get(),
        abi: Tetris.abi,
        eventName: "OrderCreated",
        async listener(logs) {

            if ((logs[0] as any).args.order.trader == address) {
                allOrders.set([...allOrders.get(), (logs[0] as any).args.order as OrderStruct])
            }

        },
    })

    useContractEvent({
        address: context?.contractAddress.get(),
        abi: Tetris.abi,
        eventName: "OrderCancelled",
        async listener(logs) {

            const order: OrderStruct = (logs[0] as any).args.order
            const newAllOrders: Array<OrderStruct> = []

            allOrders.get().forEach((v) => {
                if (v.timestamp == order.timestamp) {
                    newAllOrders.push(order);
                }
                else { newAllOrders.push(v); }
            })

            allOrders.set(newAllOrders);

        },
    })

    useContractEvent({
        address: context?.contractAddress.get(),
        abi: Tetris.abi,
        eventName: "OrderMatched",
        async listener(logs) {



            const newAllOrders: Array<OrderStruct> = []

            const sellOrder: OrderStruct = (logs[0] as any).args.sellOrder
            const buyOrder: OrderStruct = (logs[0] as any).args.buyOrder

            allOrders.get().forEach((v) => {
                if (v.timestamp == sellOrder.timestamp) {
                    newAllOrders.push(sellOrder);
                } else if (v.timestamp == buyOrder.timestamp) {
                    newAllOrders.push(buyOrder);
                }
                else { newAllOrders.push(v); }
            })

            allOrders.set(newAllOrders);
        }
    })



    return (
        <section className="user-orders w-full ">
            <div className="w-full flex flex-col gap-y-4">
                <div className="flex justify-between">
                    <div className="flex sort-parameters gap-2 md:gap-4 w-full h-10">
                        <OrderSortTab onClick={() => orderState.set(OrderState.OPEN)} active={orderState.get() == OrderState.OPEN}>OPEN</OrderSortTab>
                        <OrderSortTab onClick={() => orderState.set(OrderState.CANCEL)} active={orderState.get() == OrderState.CANCEL}>CANCELLED</OrderSortTab>
                        <OrderSortTab onClick={() => orderState.set(OrderState.DONE)} active={orderState.get() == OrderState.DONE}>DONE</OrderSortTab>
                        <OrderSortTab onClick={() => orderState.set(OrderState.ALL)} active={orderState.get() == OrderState.ALL} >ALL</OrderSortTab>
                    </div>
                    <OrderGridSearchBar />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 w-full">
                    {
                        (currentDisplayedOrders) && (currentDisplayedOrders.get()).map((v) => {
                            console.log("The ordertype from here is ", v.orderType);
                            return <OrderListCardCombined order={v} key={v.timestamp.toString()} />
                        })
                    }
                </div>
            </div>

            <div className="flex w-full items-center justify-center py-8">
                <Button className={cn("bg-slate-700 text-white", currentDisplayedOrders.get().length < 1 ? "hidden" : "block")} hidden={currentDisplayedOrders.get().length < 1} onClick={() => maxShown.set(maxShown.get() + 5)}>Show More +</Button>
            </div>
        </section>);
})

export default OrderGrid;