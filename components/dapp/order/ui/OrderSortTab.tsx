import { cn } from "@/lib/utils"
import { MouseEventHandler } from "react";

export interface OrderSortTabInterface {
    children: React.ReactNode,
    className?: string
    onClick?: MouseEventHandler<HTMLDivElement>,
    active: boolean
}

const OrderSortTab = ({ children, className, onClick, active }: OrderSortTabInterface) => {
    return (<div onClick={onClick} className={cn("flex items-center justify-center text-[14px] cursor-pointer font-medium bg-white/10 py-2 px-4 text-white rounded-md", active && "bg-white/20", className)}>
        {children}
    </div>);
}

export default OrderSortTab;