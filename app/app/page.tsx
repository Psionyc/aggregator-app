import { SwapBox } from "@/components/SwapBox";
import { SwapRouteBox } from "@/components/SwapRouteBox";



export default function Swap() {
    return (
        <div className="grid place-items-center h-[100vh]">
            <div className="flex flex-row justify-center items-center w-[60vw] h-[70vh] gap-x-4">
               
                <SwapBox />
                <SwapRouteBox/>
            </div>

        </div>
    )
}