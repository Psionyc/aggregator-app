"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Order = {
    orderType: bigint
    trader: string
    price: bigint;
    size: bigint;
    quantity: bigint;
    orderTypeName: string;
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderTypeName",
    header: "OrderType",
  },
  {
    accessorKey: "trader",
    header: "Trader",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
]
