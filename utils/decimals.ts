import { ethers } from "ethers";
import { bigint } from "zod"

export const intl = Intl.NumberFormat("en", {
    notation: "standard",
    // maximumSignificantDigits: 5,
    // minimumIntegerDigits: 4,
    maximumFractionDigits: 4,
    minimumFractionDigits: 3
    
    
})

export const to18 = (value: number) => {
    if (!Number.isFinite(value)) return BigInt(0)
    if (Number.isNaN(value)) value = 0;
    value = Math.floor(value);
    const final = value * 10 ** 18;
    return BigInt(final)
}

export const to9 = (value: number) => {
    return BigInt(value * 10 ** 9)
}

export const toNormal = (value: bigint) => {
    if (value == undefined) return BigInt(0);

    const divisor = (BigInt(10 ** 18));
    return value / divisor;
}

export function toReadable(amount: string, decimals: number) {
    return Number.parseFloat(ethers.formatUnits(amount, decimals)).toFixed(5);
}

