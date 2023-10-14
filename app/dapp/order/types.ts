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

  export type OrderLevelStruct = {
    price: bigint;
    size: bigint;
    quantity: bigint;
    overallSize: bigint;
    overallQuantity: bigint;
    orderType: bigint;
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