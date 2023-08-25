import { bigint } from "zod"

export const to18 = (value: number) => {
    if (!Number.isFinite(value)) return BigInt(0)
    if (Number.isNaN(value)) value = 0;
    value = Math.floor(value);
    const final = value * 10 ** 18;
    return BigInt(final)
}

export const to8 = (value: number) => {
    return BigInt(value * 10 * 10 ** 8)
}

export const toNormal = (value: bigint) => {
    if (value == undefined) return BigInt(0);

    const divisor = (BigInt(10 ** 18));
    return value / divisor;
}