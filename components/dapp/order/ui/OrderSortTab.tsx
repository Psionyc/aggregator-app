import { cn } from "@/lib/utils"
import { MouseEventHandler } from "react";

export interface OrderSortTabInterface {
    children: React.ReactNode,
    className?: string
    onClick?: MouseEventHandler<HTMLDivElement>
}

const OrderSortTab = ({ children, className, onClick }: OrderSortTabInterface) => {
    return (<div onClick={onClick} className={cn("flex items-center justify-center text-[18px] cursor-pointer font-semibold bg-white/10 p-2 text-white rounded-md", className)}>
        {children}
    </div>);
}

export default OrderSortTab;