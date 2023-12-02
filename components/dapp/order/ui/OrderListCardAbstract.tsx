"use client"

import { OrderStruct } from "@/app/dapp/order/types";
import { CircularProgress } from "@nextui-org/react";
import { cn } from "@/lib/utils";
import { ethers, id } from "ethers"
import { ReactNode } from "react";
import { Button } from "@/components/shadcn-ui/button";
import { useContractWrite } from "wagmi";
import { useOrderContext } from "@/app/dapp/order/OrderContext";
import Tetris from "@/assets/contracts/TetrisOrderBook.json"
import { motion } from "framer-motion";
import { observer } from "@legendapp/state/react";

const TitleAndLabel = ({ title, label, unit }: { title: string, label: ReactNode, unit?: string }) => {
    return (<motion.div layout className="flex flex-col gap-1">
        <p className="text-[14px] text-white/50 font-semibold">{title}</p>
        <p className="text-[20px] text-white font-medium">{label} {unit}</p>
    </motion.div>)
}

const ProgressLabel = ({ value }: { value: number }) => {
    return (
        <motion.div layout className="flex flex-col items-center justify-center">
            <p className="text-xl font-semibold">{value.toPrecision(3)}%</p>
            <p className="text-lg font-medium">FILLED</p>
        </motion.div>
    );
}

const OrderListCardAbstract = observer(({ order }: { order: OrderStruct }) => {

    const context = useOrderContext()


    const baseTokenSymbol = context!.baseTokenSymbol;
    const quoteTokenSymbol = context!.quoteTokenSymbol

    console.log("Price here is ", order);
    const priceR = ethers.formatUnits(order.price.toString(), 9);
    const inputQuantityR = ethers.formatUnits(order.inputQuantity.toString(), 18);
    const inputSizeR = ethers.formatUnits(order.inputSize.toString(), 18);
    const sizeR = ethers.formatUnits(order.size.toString(), 18);
    const quantityR = ethers.formatUnits(order.quantity.toString(), 18);
    const quantityUsedR = Number(inputQuantityR) - Number(quantityR)
    const sizeUsedR = Number(inputSizeR) - Number(sizeR)


    const percentage = Number(order.orderType) == 0 ? (Number(sizeR) / Number(inputSizeR) * 100) : (Number(sizeUsedR) / Number(inputSizeR) * 100);

    return (
        <>
            <motion.div layout className={cn("grid grid-cols-2 w-full gap-y-2 bg-primary/20 rounded-[10px] py-2 px-4  border-1", Number(order.orderType) == 0 ? "border-green-600" : "border-red-600")} >
                <motion.div layout className="flex flex-col gap-2">
                    <p className="text-[20px] font-semibold text-white">{Number(order.orderType) == 0 ? "BUY ORDER" : "SELL ORDER"}</p>
                    <TitleAndLabel title="PRICE" label={priceR} unit={quoteTokenSymbol.get()} />
                    {Number(order.orderType) == 0 ? <TitleAndLabel title={baseTokenSymbol.get()} label={`${Number(sizeR).toPrecision(4)}/${Number(inputSizeR).toPrecision(4)}`} unit={baseTokenSymbol.get()} /> : <TitleAndLabel title={baseTokenSymbol.get()} label={`${Number(sizeUsedR).toPrecision(3)}/${inputSizeR}`} unit={baseTokenSymbol.get()} />}
                </motion.div>
                <motion.div layout className="flex justify-end">
                    <CircularProgress
                        classNames={{
                            svg: "w-28 h-28 drop-shadow-md",
                            indicator: cn(Number(order.orderType) == 0 ? "stroke-green-600" : "stroke-red-600"),
                            track: "stroke-white/10",
                            value: "text-white",
                        }}
                        disableAnimation
                        value={percentage} valueLabel={<ProgressLabel value={percentage} />} strokeWidth={48} showValueLabel />
                </motion.div>
            </motion.div>

        </>
    );
})

export default OrderListCardAbstract;