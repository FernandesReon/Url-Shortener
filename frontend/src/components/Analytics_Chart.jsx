import { useEffect, useRef, useState, useMemo } from "react";

const Analytics_Chart = ({ data, onDateChange }) => {
    const chartData = data ?? [];

    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    // Set dateFrom to the first day of the current month
    const [dateFrom, setDateFrom] = useState(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return firstDayOfMonth.toISOString().split("T")[0];
    });

    // Set dateTo to tomorrow
    const [dateTo, setDateTo] = useState(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Set to +1 day
        return tomorrow.toISOString().split("T")[0];
    });

    const filteredData = useMemo(() => {
        if (!dateFrom || !dateTo) return chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        return chartData
            .filter((item) => {
                const itemDate = new Date(item.date);
                return itemDate >= fromDate && itemDate <= toDate;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [chartData, dateFrom, dateTo]);

    useEffect(() => {
        const loadChart = async () => {
            const { Chart, registerables } = await import("chart.js");
            Chart.register(...registerables);

            if (canvasRef.current) {
                if (chartRef.current) chartRef.current.destroy();

                const ctx = canvasRef.current.getContext("2d");
                if (ctx) {
                    chartRef.current = new Chart(ctx, {
                        type: "line",
                        data: {
                            labels: filteredData.map((d) => {
                                const date = new Date(d.date);
                                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                            }),
                            datasets: [
                                {
                                    label: "Clicks",
                                    data: filteredData.map((d) => d.clicks),
                                    borderColor: "#4f46e5",
                                    backgroundColor: "rgba(79, 70, 229, 0.1)",
                                    borderWidth: 3,
                                    fill: true,
                                    tension: 0.4,
                                    pointBackgroundColor: "#4f46e5",
                                    pointBorderColor: "#4f46e5",
                                    pointRadius: 6,
                                    pointHoverRadius: 8,
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: { color: "#e5e7eb" },
                                    ticks: { color: "#000000", font: { size: 12 } },
                                },
                                x: {
                                    grid: { display: false },
                                    ticks: { color: "#000000", font: { size: 12 } },
                                },
                            },
                        },
                    });
                }
            }
        };

        loadChart();

        return () => {
            if (chartRef.current) chartRef.current.destroy();
        };
    }, [filteredData]);

    return (
        <div className="bg-white rounded-lg p-6 shadow-xl border border-gray-50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">Click Analytics</h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-black">From:</label>
                        <input
                            type="date"
                            value={dateFrom}
                            max={dateTo}
                            onChange={(e) => {
                                setDateFrom(e.target.value);
                                if (onDateChange) onDateChange(new Date(e.target.value), new Date(dateTo));
                            }}
                            className="px-3 py-1 border border-gray-400 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-black">To:</label>
                        <input
                            type="date"
                            value={dateTo}
                            min={dateFrom}
                            onChange={(e) => {
                                setDateTo(e.target.value);
                                if (onDateChange) onDateChange(new Date(dateFrom), new Date(e.target.value));
                            }}
                            className="px-3 py-1 border border-gray-400 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                    </div>
                </div>
            </div>
            <div className="relative h-64">
                <canvas ref={canvasRef} className="w-full h-full"></canvas>
            </div>
            <div className="mt-4 text-center">
                <span className="text-sm text-black">
                    Total Clicks: {filteredData.length > 0 ? filteredData.reduce((sum, d) => sum + d.clicks, 0) : 0}
                </span>
            </div>
        </div>
    );
};

export default Analytics_Chart;