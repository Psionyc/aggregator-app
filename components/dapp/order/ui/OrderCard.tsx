import React from 'react';

export interface Order {
    orderType: bigint
    trader: string
    price: bigint;
    size: bigint;
    quantity: bigint;

}

const OrderCard = ({ order }: { order: Order }) => {
    return (
        <div className="bg-white shadow-md p-6 rounded-md overflow-hidden px-4">
            <h3 className="text-lg font-semibold mb-2">
                {order?.orderType == BigInt(0) ? 'Buy Order' : 'Sell Order'}
            </h3>
            <p className="text-gray-600 mb-2 ">Address: {order?.trader ?? "0xffff"}</p>
            <p className="text-gray-600 mb-2">Quantity: {order?.quantity.toString() ?? "2000"}</p>
            <p className="text-gray-600 mb-2">Price: {order?.price.toString() ?? "100"}</p>
            <p className="text-gray-600 mb-2">Size: {order?.size.toString() ?? "1000"}</p>
            {/* Add more order details as needed */}
        </div>
    );
};

export default OrderCard;