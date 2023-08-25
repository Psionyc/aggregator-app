import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import "./ui/styles.css";

import Chart from "./ui/Chart";

export default function OrderChart() {
    const chart_width = 750;
    const chart_height = 500;

    let bars_displayed = 40;
    let last_bar_displayed = 0;

    const divRef = useRef();

    useEffect(() => {
        console.log("Type", divRef.current)
    }, [divRef])

    const randomOne = (weight = 1) => {
        return (Math.random() + Math.random() - 1) * weight;
    };

    const generateData = () => {
        const length = Math.round(Math.random() * 90) + 10;

        // initial values
        const seed_close = Math.random() * 150 + 50;
        let previous_close = seed_close;
        let previous_volume = Math.random() * 300 + 10;
        let trend = Math.floor(Math.random() * 2) * 2 - 1;

        // calculate each bar
        return d3.range(length).map((item, i) => {
            const open = previous_close * (1 + randomOne(0.1));
            const close = open * (1 + randomOne(0.2) * trend);
            const high = Math.max(open, close) * (1 + randomOne(0.1));
            const low = Math.min(open, close) * (1 - randomOne(0.1));
            const volume = previous_volume * (1 + randomOne(0.5));

            previous_close = close;
            trend = Math.floor(Math.random() * 2) * 2 - 1;

            return {
                time: i,
                open,
                high,
                low,
                close,
                volume
            };
        });
    };

    const [data, setData] = useState(generateData());
    const changeData = () => {
        setData(generateData);
    };

    // const data_on_chart = data.slice()

    return (
        <div className="flex w-full h-full bg-primary/20" ref={divRef.current}>
            <Chart data={data} width={chart_width} height={chart_height} />

        </div>

    );
}
