"use client"

import { OrderStruct } from "@/types/order";
import { CircularProgress } from "@nextui-org/react";
import { cn } from "@/lib/utils";
import { ethers, id } from "ethers";
import { ReactNode, useEffect } from "react";
import { Button } from "@/components/shadcn-ui/button";
import { useContractWrite } from "wagmi";
import { useOrderContext } from "@/app/dapp/order/OrderContext";
import Tetris from "@/assets/contracts/TetrisOrderBook.json";
import { motion } from "framer-motion";
import { observer, useObservable } from "@legendapp/state/react";

const TitleAndLabel = ({ title, label, unit }: { title: string, label: ReactNode, unit?: string }) => {
    return (<motion.div layout className="flex flex-col gap-1">
        <p className="text-[14px] text-white/50 font-semibold">{title}</p>
        <p className="text-[20px] text-white font-medium">{label} {unit}</p>
    </motion.div>)
}

const ProgressLabel = ({ value }: { value: number }) => {
    return (
        <motion.div layout className="flex flex-col items-center justify-center">
            <p className="text-2xl font-semibold">{value.toPrecision(3)}%</p>
            <p className="text-xl font-medium">FILLED</p>
        </motion.div>
    );
}

const OrderListCard = observer(({ order }: { order: OrderStruct }) => {

    const context = useOrderContext()

    const intl = Intl.NumberFormat("en", {
        notation: "compact",
        maximumSignificantDigits: 5,
        // maximumFractionDigits: 4,
        // minimumFractionDigits: 3,

    })

    const baseTokenSymbol = context!.baseTokenSymbol;
    const quoteTokenSymbol = context!.quoteTokenSymbol

    const priceR = useObservable(ethers.formatUnits(order.price.toString(), 9));
    const inputQuantityR = ethers.formatUnits(order.inputQuantity.toString(), 18);
    const inputSizeR = ethers.formatUnits(order.inputSize.toString(), 18);
    const sizeR = ethers.formatUnits(order.size.toString(), 18);
    const quantityR = ethers.formatUnits(order.quantity.toString(), 18);
    const quantityUsedR = Number(inputQuantityR) - Number(quantityR)
    const sizeUsedR = Number(inputSizeR) - Number(sizeR)

    const percentage = Number(order.orderType) == 0 ? (Number(sizeR) / Number(inputSizeR) * 100) : (Number(sizeUsedR) / Number(inputSizeR) * 100);

    const { write, isLoading } = useContractWrite({
        address: context!.contractAddress.get(),
        functionName: "cancelOrder",
        abi: Tetris.abi,
        args: [order.price, order.id, order.orderType]
    })




    return (


        <>
            <motion.div layout className={cn("grid grid-cols-2 w-full gap-y-4 bg-primary/20 rounded-[10px] py-2 px-4  border-1", Number(order.orderType) == 0 ? "border-green-600" : "border-red-600")} >
                <motion.div layout className="left flex flex-col justify-between items-start">
                    <motion.div className="flex flex-col gap-4">
                        <p className="text-[20px] font-semibold text-white">{Number(order.orderType) == 0 ? "BUY ORDER" : "SELL ORDER"}</p>
                        <TitleAndLabel title="PRICE" label={priceR.get()} unit={quoteTokenSymbol.get()} />
                    </motion.div>



                    {Number(order.orderType) == 0 ? <motion.div layout className="flex flex-col gap-4">
                        <TitleAndLabel title="QUANTITY" label={intl.format(Number(inputQuantityR))} unit={quoteTokenSymbol.get()} />
                        <TitleAndLabel title="EXPECTED BASE" label={Number(inputSizeR).toPrecision(4)} unit={baseTokenSymbol.get()} />
                    </motion.div> : <motion.div layout className="flex flex-col gap-4">
                        <TitleAndLabel title="SIZE" label={Number(inputSizeR).toPrecision(4)} unit={baseTokenSymbol.get()} />
                        <TitleAndLabel title="EXPECTED QUOTE" label={intl.format(Number(inputQuantityR))} unit={quoteTokenSymbol.get()} />
                    </motion.div>
                    }
                </motion.div>

                <motion.div layout className="right flex flex-col justify-between items-center gap-4 ">
                    <CircularProgress
                        classNames={{
                            svg: "w-36 h-36 drop-shadow-md",
                            indicator: cn(Number(order.orderType) == 0 ? "stroke-green-600" : "stroke-red-600"),
                            track: "stroke-white/10",
                            value: "text-white",
                        }}
                        value={percentage} valueLabel={<ProgressLabel value={percentage} />} strokeWidth={48} size="lg" showValueLabel />

                    {Number(order.orderType) == 0 ? <motion.div layout className="flex flex-col gap-4">
                        <TitleAndLabel title="QUANTITY USED" label={intl.format(Number(quantityUsedR))} unit={quoteTokenSymbol.get()} />
                        <TitleAndLabel title="BASE GOTTEN" label={Number(sizeR).toPrecision(4)} unit={baseTokenSymbol.get()} />
                    </motion.div> : <motion.div layout className="flex flex-col gap-4">
                        <TitleAndLabel title="SIZE USED" label={Number(sizeUsedR).toPrecision(4)} unit={baseTokenSymbol.get()} />
                        <TitleAndLabel title="QUOTE GOTTEN" label={Number(quantityR).toPrecision(4)} unit={quoteTokenSymbol.get()} />
                    </motion.div>

                    }
                </motion.div>

                <Button onClick={() => write?.()} disabled={Number(order.orderState) != 0 || isLoading} className={cn("text-semibold flex items-center justify-center gap-4 text-white px-4 py-3 col-span-2  w-full h-12 bg-red-500 hover:bg-red-500/40 rounded-md", isLoading && "bg-red-500/40")}>
                    {isLoading && <CircularProgress

                        classNames={{
                            svg: "w-8 h-8 drop-shadow-md",
                            indicator: "stroke-white",
                            track: "stroke-white/10",
                            value: "text-white",
                        }}
                        strokeWidth={48} size="lg" />}
                    Cancel
                </Button>

            </motion.div>


        </>
    );
})

export default OrderListCard;