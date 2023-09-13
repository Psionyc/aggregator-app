"use client"
import { useOrderContext } from "@/app/dapp/order/OrderContext"
import { Button } from "@/components/ui/button"
import { toReadable } from "@/utils/decimals"
import { computed } from "@legendapp/state"
import { useComputed } from "@legendapp/state/react"
import { ethers } from "ethers"
import { useContractWrite } from "wagmi"
import Tetris from "@/assets/contracts/TetrisOrderBook.json"

export interface OrderListItemProps {
    orderType?: "BUY" | "SELL",
    price?: bigint,
    quantity?: bigint
    size?: bigint
    inputSize: bigint,
    inputQuantity: bigint,
    orderState: bigint,
    id: bigint
}

const OrderListItem = ({ orderType = "BUY", price, quantity, size, inputSize, inputQuantity, orderState, id }: OrderListItemProps) => {
    const context = useOrderContext()

    const computedPercentage = useComputed(() => {
        const priceR = Number.parseFloat(toReadable(price!.toString(), 9))
        const sizeR = Number.parseFloat(toReadable(size!.toString(), 18))
        const quantityR = Number.parseFloat(toReadable(quantity!.toString(), 18))
        const inputSizeR = Number.parseFloat(toReadable(inputSize!.toString(), 18))
        const inputQuantityR = Number.parseFloat(toReadable(inputQuantity!.toString(), 18))

        console.log("The quantity is ", quantityR)
        console.log("The max quantity is ", inputQuantityR)
        if (orderType == "BUY") {
            return ((sizeR / inputSizeR) * 100)
        } else {
            return ((quantityR / inputQuantityR) * 100)
        }
    })


    const { write, isLoading } = useContractWrite({
        address: context!.contractAddress.get(),
        functionName: "cancelOrder",
        abi: Tetris.abi,
        args: [price, id, orderType == "BUY" ? 0 : 1]
    })
    return (<div className="flex bg-primary/20  relative flex-col px-2 overflow-clip">
        {orderType == "BUY" ? <div className="w-full">
            <div className="absolute right-2 top-2 text-green-500 font-bold">BUY</div>
            <p className="text-green-500 font-semibold text-[48px]">{quantity ? toReadable(inputQuantity.toString(), 18) : 200}<span className="text-[20px]">USDC</span></p>
            <div className="w-full progres relative">
                <div className="bg-white/20 absolute top-0 left-0 right-0 w-full h-[3px]"></div>
                <div className="bg-green-500/70 absolute top-0 left-0  h-[3px]" style={{
                    width: `${computedPercentage.get()}%`
                }}></div>
            </div>
            <p className="text-white font-semibold text-[16px] text-center w-full mt-2">GET {toReadable(inputSize.toString(), 18)} <span className="text-[12px]" >ETH</span> at {price ? toReadable(price.toString(), 9) : 1750} <span className="text-[12px]" >USDC</span></p>
        </div>
            : <div className="w-full">
                <div className="absolute right-2 top-2 text-red-500 font-bold">SELL</div>
                <p className="text-red-500 font-semibold text-[48px]">{inputSize ? toReadable(inputSize.toString(), 18) : 0.02}<span className="text-[20px]">ETH</span></p>
                <div className="w-full progres relative h-[3px] overflow-hidden">
                    <div className="bg-white/20 absolute top-0 left-0 right-0 w-full h-[3px]"></div>
                    <div className="bg-red-500/70 absolute top-0 left-0 h-[3px]" style={
                        {
                            width: `${computedPercentage.get()}%`
                        }
                    }></div>
                </div>
                <p className="text-white font-semibold text-[16px] text-center w-full mt-2">GET {toReadable(inputQuantity.toString(), 18)} <span className="text-[12px]">USDC</span> at {price ? toReadable(price.toString(), 9) : 1750} <span className="text-[12px]" >USDC</span></p>
            </div>
        }

        <div className="flex justify-end mt-auto py-2">
            <Button variant={"destructive"} className="font-semibold" disabled={orderState != BigInt(0)} onClick={() => write?.()}>Cancel</Button>
        </div>



    </div>);
}

export default OrderListItem;