"use client";

import { arrayOutputType } from "zod";
import { Order, columns } from "./ui/OrderColumns"
import { DataTable } from "./ui/OrderDataTable"
import { toNormal, toReadable } from "@/utils/decimals";



export default function OrderTable({ orders }: { orders: Array<Order> }) {
  if (orders == undefined) {
    orders = []
  }

  orders.forEach((v) => {
    v.orderTypeName = v.orderType == BigInt(0) ? "BUY" : "SELL"
    v.priceReadable = toReadable(v.price.toString(), 9).toFixed(2)
    v.sizeReadable = toReadable(v.size.toString(), 18).toFixed(2)
    v.quantityReadable = toReadable(v.quantity.toString(), 18).toFixed(2)
  })




  return (

    <DataTable columns={columns as any} data={orders} />

  )
}
