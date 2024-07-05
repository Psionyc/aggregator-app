import { useContractRead } from "wagmi"
import FeeManager from "@/assets/contracts/FeeManager.json"
import { FEE_MANAGER_CONTRACT } from "@/config"

export const useFeeManagerFee = () => {
    const { data: fee, isLoading
    } = useContractRead({
        abi: FeeManager.abi,
        address: FEE_MANAGER_CONTRACT,
        functionName: "fee"
    })

    return fee as bigint
}