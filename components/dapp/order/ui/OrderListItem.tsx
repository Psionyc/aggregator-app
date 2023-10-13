"use client"
import { useOrderContext } from "@/app/dapp/order/OrderContext"
import { Button } from "@/components/ui/button"
import { toReadable } from "@/utils/decimals"
import { computed } from "@legendapp/state"
import { observer, useComputed } from "@legendapp/state/react"
import { ethers } from "ethers"
import { useContractEvent, useContractWrite } from "wagmi"
import Tetris from "@/assets/contracts/TetrisOrderBook.json"
import { BigNumber } from "bignumber.js"
import { useEffect } from "react"


export interface OrderListItemProps {
    orderType?: bigint,
    price?: bigint,
    quantity?: bigint
    size?: bigint
    inputSize: bigint,
    inputQuantity: bigint,
    orderState: bigint,
    id: bigint
    ioc?: boolean
}

const OrderListItem = observer(({ orderType, price, quantity, size, inputSize, inputQuantity, orderState, id }: OrderListItemProps) => {
    const context = useOrderContext()

    useEffect(() => {
        console.log("The order type is ", orderType)
    })

    function down(value: bigint) {
        const n = new BigNumber(Number.parseFloat(toReadable(value!.toString(), 18)));

        return n.toPrecision(5);

    }

    const computedPercentage = useComputed(() => {
        const priceR = Number.parseFloat(toReadable(price!.toString(), 9))
        const sizeR = Number.parseFloat(toReadable(size!.toString(), 18))
        const quantityR = Number.parseFloat(toReadable(quantity!.toString(), 18))
        const inputSizeR = Number.parseFloat(toReadable(inputSize!.toString(), 18))
        const inputQuantityR = Number.parseFloat(toReadable(inputQuantity!.toString(), 18))

        console.log("The quantity is ", quantityR)
        console.log("The max quantity is ", inputQuantityR)
        if (Number(orderType) == 0) {
            return ((sizeR / inputSizeR) * 100)
        } else {
            console.log("Input Quantity Readabele = ", inputQuantityR)
            return ((quantityR / inputQuantityR) * 100);

        }
    })

    useContractEvent({
        address: context!.contractAddress.get(),
        eventName: "OrderMatched",
        abi: Tetris.abi,
        listener(data: any) {
            console.log(data)
            console.log(data.args.buyOrder)
        }
    })


    const { write, isLoading } = useContractWrite({
        address: context!.contractAddress.get(),
        functionName: "cancelOrder",
        abi: Tetris.abi,
        args: [price, id, orderType]
    })


    return (<div className="flex bg-primary/10  relative flex-col px-2 overflow-clip">
        {Number(orderType) == 0 ? <div className="w-full">
            <div className="absolute right-2 top-2 text-green-500 font-bold">BUY</div>
            <p className="text-green-500 font-semibold text-[24px]">{inputQuantity ? down(inputQuantity) : 0} <span className="text-[20px]">USDC</span></p>
            <div className="w-full progres relative">
                <div className="bg-white/20 absolute top-0 left-0 right-0 w-full h-[3px]"></div>
                <div className="bg-green-500/70 absolute top-0 left-0  h-[3px]" style={{
                    width: `${computedPercentage.get()}%`
                }}></div>
            </div>
            <p className="text-white font-semibold text-[16px] text-center w-full mt-2">GET {down(inputSize)} <span className="text-[12px]" >ETH</span> at {price ? toReadable(price.toString(), 9) : 1750} <span className="text-[12px]" >USDC</span></p>
        </div>
            : <div className="w-full">
                <div className="absolute right-2 top-2 text-red-500 font-bold">SELL</div>
                <p className="text-red-500 font-semibold text-[24px]">{down(inputSize)}<span className="text-[20px]">ETH</span></p>
                <div className="w-full progres relative h-[3px] overflow-hidden">
                    <div className="bg-white/20 absolute top-0 left-0 right-0 w-full h-[3px]"></div>
                    <div className="bg-red-500/70 absolute top-0 left-0 h-[3px]" style={
                        {
                            width: `${computedPercentage.get()}%`
                        }
                    }></div>
                </div>
                <p className="text-white font-semibold text-[16px] text-center w-full mt-2">GET {down(inputQuantity)} <span className="text-[12px]">USDC</span> at {price ? toReadable(price.toString(), 9) : 1750} <span className="text-[12px]" >USDC</span></p>
            </div>
        }

        <div className="flex justify-end mt-auto py-2">
            <Button variant={"destructive"} className="font-semibold" disabled={orderState != BigInt(0)} onClick={() => write?.()}>Cancel</Button>
        </div>



    </div>);
})




export default OrderListItem;