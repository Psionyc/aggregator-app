import { Observable } from "@legendapp/state"
import { createContext, useContext } from "react";
import { OrderStruct } from "@/types/order";

const OrderContext = createContext<
    {
        account?: `0x${string}` | undefined,
        settleableBalances?: Observable<Array<number>>,
        quoteSpendableBalance?: bigint,
        baseSpendableBalance?: bigint,
        userOrders?: Observable<Array<OrderStruct>> | [],
        contractAddress: Observable<`0x${string}`>,
        baseToken: Observable<`0x${string}`>,
        quoteToken: Observable<`0x${string}`>,
        baseTokenSymbol: Observable<string>,
        quoteTokenSymbol: Observable<string>,
        lastPrice?: bigint,
    } | null
>(null)



export const useOrderContext = () => useContext(OrderContext);

export const useNormalize = () => {

}

export const useNormalizePrice = () => {

}

export const OrderContextProvider = OrderContext.Provider