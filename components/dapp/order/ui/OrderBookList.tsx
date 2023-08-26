export interface OrderBookListItemProps {
    size: number,
    price: number,
    orderType?: "BUY" | "SELL"
    percantage?: number
}

const OrderBookListItem = ({ size, price, orderType, percantage }: OrderBookListItemProps) => {
    return (
        <div className="grid grid-cols-2 h-[30px] text-white font-semibold">
            <p className="flex items-start flex-col">{size.toFixed(2)}</p>
            <div className="flex items-center relative">
                <div style={
                    { width: `${percantage}%`, background: `${(orderType ?? "BUY") == 'BUY' ? 'green' : 'red'}` }
                } className={` z-[-1] bg-red-500 absolute top-0 right-0 h-full`}></div>
                <p className="text-end w-full mr-[1px]">{price.toFixed(2)}</p>
            </div>
        </div>
    );
}

export default OrderBookListItem;