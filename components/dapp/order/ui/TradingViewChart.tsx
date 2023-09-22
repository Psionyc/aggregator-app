"use client"
import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

export const ChartComponent = (props: any) => {
    const {
        data,
        colors: {
            backgroundColor = 'hwb(191 41% 0% / 0.1)',
            lineColor = '#68E4FF',
            textColor = 'white',
            areaTopColor = '#68E4FF',
            areaBottomColor = 'hwb(191 41% 0% / 0.1)',
        } = {},
    } = props;

    const chartContainerRef: any = useRef();

    useEffect(
        () => {
            const handleResize = () => {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
            };

            const chart = createChart(chartContainerRef.current, {
                grid: {
                    vertLines: {
                        visible: false
                    },
                    horzLines: {
                        visible: false
                    }
                },
                layout: {
                    background: { type: ColorType.Solid, color: backgroundColor },
                    textColor,

                },
                width: chartContainerRef.current.clientWidth,

            });
            chart.timeScale().fitContent();

            const newSeries = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
            newSeries.setData(data);

            const resizeObserver = new ResizeObserver(handleResize);

            if (chartContainerRef.current) {
                resizeObserver.observe(chartContainerRef.current);
            }



            return () => {
                if (chartContainerRef.current) {
                    resizeObserver.unobserve(chartContainerRef.current);
                }

                chart.remove();
            };
        },
        [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor, chartContainerRef]
    );

    return (
        <div className="h-full"
            ref={chartContainerRef}
        />
    );
};

