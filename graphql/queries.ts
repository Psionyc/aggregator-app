import { gql } from "@apollo/client";

export const GET_PRICE_LEVEL_BUYS = gql`
    query{
         priceLevelBuys(orderBy: price) {
            id
      price
      quantity
      size
    }
  }
`
export const GET_PRICE_LEVEL_SELLS = gql`
 query{
         priceLevelSells {
            id
      price
      quantity
      size
    }
 }
`