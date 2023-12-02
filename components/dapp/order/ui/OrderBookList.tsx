import { cn } from "@/lib/utils";
import { intl, toReadable } from "@/utils/decimals";
import { ethers } from "ethers";
import React from "react";

export interface OrderBookListItemProps {
  size: bigint;
  price: bigint;
  orderType?: "BUY" | "SELL";
  percantage: number;
}

const OrderBookLevelListItem = ({
  size,
  price,
  orderType,
  percantage,
}: OrderBookListItemProps) => {
  console.log("Percentage is ", percantage);

  function formatDecimal(num: number): React.ReactNode{
    // Convert the number to a string
    let numStr = num.toString();

    // Find the position of the first non-zero digit after the decimal
    let firstNonZeroPos = numStr.indexOf(".") + 1;
    while (numStr[firstNonZeroPos] === "0") {
      firstNonZeroPos++;
    }

    // Calculate the number of zeros
    let zeroCount = firstNonZeroPos - numStr.indexOf(".") - 1;

    // Format the number
    let formattedNumber = num.toFixed(zeroCount + 1);

    // Replace the zeros with the superscript notation
    let result =
      formattedNumber.substring(0, firstNonZeroPos - zeroCount) +
      (zeroCount > 0 ? <sup>`${zeroCount}`</sup> : "").toString() +
      formattedNumber.substring(firstNonZeroPos);

    return result;
  }
  return (
    <div className="grid grid-cols-2 h-[30px] text-white font-semibold relative w-full">
      {/* <p className="flex items-start flex-col z-20">{toReadable(size.toString(), 18)}</p> */}
      <p className="flex items-start flex-col z-20">
        {formatDecimal(Number(ethers.formatEther(size)))}
      </p>
      <div className="flex items-center relative">
        <p className="text-end w-full mr-[3px] z-20">
          {intl.format(Number(toReadable(price.toString(), 9)))}
        </p>
      </div>
      <div
        style={{
          width: `${percantage}%`,
        }}
        className={cn(
          "absolute top-0 right-0 h-full",
          orderType == "BUY" ? "bg-green-500/30" : "bg-red-500/30"
        )}
      ></div>
    </div>
  );
};

export default OrderBookLevelListItem;
