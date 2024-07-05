import { cn } from "@/lib/utils";
import { intl, toReadable } from "@/utils/decimals";
import { ethers } from "ethers";
import React, { useEffect } from "react";

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
  const sizeIntl = new Intl.NumberFormat("en", {
    maximumSignificantDigits: 6,
    style: "decimal"
  })

  function countLeadingZeros(number: number | string) {
    // Convert the number to a string
    const numberStr = number.toString();

    // Remove the '0.' prefix to only have the decimal part
    const decimalPart = numberStr.split('.')[1];

    // Use a regex to match leading zeros
    const leadingZerosMatch = decimalPart.match(/^0*/);

    // Count the leading zeros
    const leadingZeros = leadingZerosMatch ? leadingZerosMatch[0].length : 0;

    return leadingZeros;
  }

  function getDecimalPartWithoutLeadingZeros(number: number | string) {
    // Convert the number to a string
    const numberStr = number.toString();

    // Split the string at the decimal point to get the decimal part
    const decimalPart = numberStr.split('.')[1];

    // Remove leading zeros from the decimal part
    const decimalPartWithoutLeadingZeros = decimalPart.replace(/^0+/, '');

    return decimalPartWithoutLeadingZeros;
  }

  function createDecimalComponent(number: number | string): React.ReactNode {

    if (Number(number) > 0.00001 || number == 0) {
      return sizeIntl.format(Number(number))
    }

    const zeros = countLeadingZeros(number)
    const lastNumbers = getDecimalPartWithoutLeadingZeros(number);

    return (<span>0.0<sub>{zeros - 1}</sub>{lastNumbers.slice(0, 6)}</span>);
  }


  return (
    <div className="grid grid-cols-2 h-[30px] text-white font-semibold relative w-full">
      {/* <p className="flex items-start flex-col z-20">{toReadable(size.toString(), 18)}</p> */}
      <p className="flex items-start flex-col z-20">
        {/* {createDecimalComponent(Number(toReadable(size.toString(), 18)))} */}
        {size ? createDecimalComponent(ethers.formatEther(size)) : "_"}
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
