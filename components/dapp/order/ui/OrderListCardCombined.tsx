"use client";
import { OrderStruct } from "@/app/dapp/order/types";
import OrderListCard from "./OrderListCard";
import OrderListCardAbstract from "./OrderListCardAbstract";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const gridItemVariants = {
    closed: {
        scale: [1.01, 1],
        opacity: [0.8, 1],
        transition: {
            duration: 0.5,
        },
    },
    opened: {
        scale: [1.01, 1],
        opacity: [0.8, 1],
        transition: {
            duration: 0.5,
        },
    },
};

const OrderListCardCombined = ({ order }: { order: OrderStruct }) => {
    const [opened, setOpened] = useState(false);

    

    return (
        <motion.div
            className="grid-item cursor-pointer" // Add your grid item class here
            variants={gridItemVariants}
            initial="closed"
            animate={opened ? "opened" : "closed"}
            exit="closed"
            whileHover={{ scale: 1.02 }}
           
            onDoubleClick={() => setOpened(!opened)}
            layout // Add layout property to reserve space
        >
            <AnimatePresence>
                {!opened ? (
                    <motion.div
                        key={order.timestamp.toString()}
                        exit={{ scale: 0.9, opacity: 0 }}
                        layout
                    >
                        <OrderListCardAbstract order={order} />
                    </motion.div>
                ) : (
                    <motion.div
                        key={order.timestamp.toString()}
                        exit={{ scale: 0.5, opacity: 0 }}
                        layout
                    >
                        <OrderListCard order={order} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default OrderListCardCombined;
