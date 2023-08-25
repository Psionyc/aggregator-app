"use client";

import { arrayOutputType } from "zod";
import { Order, columns } from "./ui/OrderColumns"
import { DataTable } from "./ui/OrderDataTable"
import { toNormal } from "@/utils/decimals";



export default function OrderTable({ orders }: { orders: Array<Order> }) {
  if (orders == undefined) {
    orders = []
  }

  orders.forEach((v) => {
    v.orderTypeName = v.orderType == BigInt(0) ? "BUY" : "SELL";
  })


  return (

    <DataTable columns={columns as any} data={orders} />

  )
}
