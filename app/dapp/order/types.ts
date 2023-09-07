import { AddressLike, BigNumberish } from "ethers";

export type OrderStruct = [
    id: bigint,
    trader: string,
    price: bigint,
    size: bigint,
    quantity: bigint,
    inputSize: bigint,
    inputQuantity: bigint,
    orderType: bigint,
    timestamp: bigint,
    orderState: bigint
] & {
    id: bigint;
    trader: string;
    price: bigint;
    size: bigint;
    quantity: bigint;
    inputSize: bigint;
    inputQuantity: bigint;
    orderType: bigint;
    timestamp: bigint;
    orderState: bigint;
};

export enum OrderType {
    BUY,
    SELL
}

export enum OrderState {
    OPEN,
    CANCEL,
    MATCHING,
    DONE
}