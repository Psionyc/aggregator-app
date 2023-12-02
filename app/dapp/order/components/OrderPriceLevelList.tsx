"use client"

import OrderBookLevelListItem from "@/components/dapp/order/ui/OrderBookList"
import { intl, toReadable } from "@/utils/decimals"
import { useComputed, useObservable } from "@legendapp/state/react"
import { useAccount, useContractEvent, useContractRead } from "wagmi"
import Tetris from "@/assets/contracts/TetrisOrderBook.json"
import { useOrderContext } from "../OrderContext"
import { OrderLevelStruct } from "@/types/order"

const OrderPriceLevelList = () => {

    const context = useOrderContext()
    const { address } = useAccount();


    const baseTokenSymbol = context!.baseTokenSymbol;
    const quoteTokenSymbol = context!.quoteTokenSymbol

    const orderbookContract = useObservable<`0x${string}`>(context!.contractAddress.get() as `0x${string}`)

    const {
        data: buyOrderLevels, isLoading: buyOrderLevelsLoading, refetch: buyOrderRefetch
    } = useContractRead({
        address: orderbookContract.get(),
        abi: Tetris.abi,
        functionName: "getBuyPriceLevels",
        args: []
    })


    const {
        data: lastPrice, isLoading: lastPriceLoading, refetch: lastPriceRefetch
    } = useContractRead({
        address: orderbookContract.get(),
        abi: Tetris.abi,
        functionName: "lastPrice",
        args: []
    })

    useContractEvent({
        address: orderbookContract.get(),
        abi: Tetris.abi,
        eventName: "OrderLevelCreated",
        async listener(event) {
            console.log((event[0] as any).args.orderLevel);

            await buyOrderRefetch(); await sellOrderRefetch();
        }
    })

    useContractEvent({
        address: orderbookContract.get(),
        abi: Tetris.abi,
        eventName: "OrderLevelUpdated",
        async listener(event) {
            console.log((event[0] as any).args.orderLevel);
            await buyOrderRefetch(); await sellOrderRefetch();
        }
    })

    useContractEvent({
        address: orderbookContract.get(),
        abi: Tetris.abi,
        eventName: "OrderLevelDeleted",
        async listener(event) {
            console.log((event[0] as any).args.orderLevel);
            await buyOrderRefetch(); await sellOrderRefetch();
        }
    })



    const {
        data: sellOrderLevels, isLoading: sellOrderLevelsLoading, refetch: sellOrderRefetch
    } = useContractRead({
        address: orderbookContract.get(),
        abi: Tetris.abi,
        functionName: "getSellPriceLevels",
        args: []
    })




    const buyPriceLevels = useComputed(() => {
        if (buyOrderLevels) {
            return (buyOrderLevels as Array<OrderLevelStruct>).sort((a, b) => Number(b.price) - Number(a.price))
        }
        return []
    }, [buyOrderLevels])

    const sellPriceLevels = useComputed(() => {
        if (sellOrderLevels) {
            return (sellOrderLevels as Array<OrderLevelStruct>).sort((a, b) => Number(b.price) - Number(a.price))
        }
        return []
    }, [sellOrderLevels])



    return (<div className="orderbookSection flex flex-col gap-2 border-primary/25 border-[1px] px-4 py-4 bg-primary/10 h-full">
        <p className="text-primary">Orderbook</p>

        <div className="grid grid-cols-2 text-white text-sm">
            <div className="main flex items-start flex-col">
                <p>Size({baseTokenSymbol.get()})</p>
            </div>
            <div className="quote flex items-end flex-col">
                <p>Price({quoteTokenSymbol.get()})</p>
            </div>
        </div>

        <div className="flex flex-col h-full">

            <div className="h-full"></div>

            {sellOrderLevelsLoading && <p className="animate-pulse text-white w-full text-center">Loading...</p>}
            {
                (sellOrderLevels as any) && (sellPriceLevels.get() as Array<OrderLevelStruct>).map((v) => {


                    return <OrderBookLevelListItem key={Math.random()} size={v.size} price={v.price} percantage={(Number(v.size) / Number(v.overallSize)) * 100} orderType="SELL" />
                })
            }


            <p className="text-green-500 font-semibold w-full text-center my-2">{lastPrice ? intl.format(Number(toReadable(lastPrice as string, 9))) : "Loading"}</p>

            {buyOrderLevelsLoading && <p className="animate-pulse text-white w-full text-center">Loading...</p>}
            {
                buyOrderLevels && (buyPriceLevels.get() as Array<OrderLevelStruct>).map((v) => {
                    console.log(v)

                    return <OrderBookLevelListItem key={Math.random().toString()} size={v.size} orderType="BUY" price={v.price} percantage={(Number(v.size) / Number(v.overallSize)) * 100} />
                })
            }

            <div className="h-full"></div>

        </div>
    </div>);
}

export default OrderPriceLevelList;