import { cn } from "@/lib/utils";
import { toReadable } from "@/utils/decimals";

export interface OrderBookListItemProps {
    size: bigint,
    price: bigint,
    orderType?: "BUY" | "SELL"
    percantage: number
}

const OrderBookLevelListItem = ({ size, price, orderType, percantage }: OrderBookListItemProps) => {
    console.log("Percentage is ", percantage)
    return (
        <div className="grid grid-cols-2 h-[30px] text-white font-semibold relative w-full">
            <p className="flex items-start flex-col z-20">{toReadable(size.toString(), 18)}</p>
            <div className="flex items-center relative">
                <p className="text-end w-full mr-[3px] z-20">{toReadable(price.toString(), 9)}</p>
            </div>
            <div style={{
                width: `${percantage}%`
            }} className={cn("absolute top-0 right-0 h-full", orderType == "BUY" ? "bg-green-500/50" : "bg-red-500/50")}></div>

        </div>
    );
}

export default OrderBookLevelListItem;