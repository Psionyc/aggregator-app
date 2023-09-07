import { Observable } from "@legendapp/state"
import { createContext, useContext } from "react";
import { OrderStruct } from "./types";

const OrderContext = createContext<
    {
        account?: `0x${string}` | undefined,
        settleableBalances?: Observable<Array<number>> | undefined,
        userOrders?: Observable<Array<OrderStruct>> | [],
        contractAddress: Observable<`0x${string}`>,
        baseToken: Observable<`0x${string}`>,
        quoteToken: Observable<`0x${string}`>
    } | null
>(null)



export const useOrderContext = () => useContext(OrderContext);

export const OrderContextProvider = OrderContext.Provider