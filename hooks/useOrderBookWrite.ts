import { useContractWrite } from "wagmi"
import TetrisOrderbook from "@/assets/contracts/TetrisOrderBook.json"

export const useOrderBookWrite = (fn: string, args: any) => {
    return useContractWrite({
        functionName: fn,
        abi: TetrisOrderbook.abi,
        args: args
    })
}