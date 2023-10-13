import { AddressLike } from "ethers";

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
    orderState: bigint,
    ioc: boolean
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
    ioc: boolean;
  };

export enum OrderType {
    BUY,
    SELL
}

export enum OrderState {
    OPEN,
    CANCEL,
    MATCHING,
    DONE,
    ALL //For frontend only
}