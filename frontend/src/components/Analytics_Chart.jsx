import { useEffect, useRef, useState, useMemo } from "react"

const dummyData = [
    { date: "2025-08-02", clicks: 10 },
    { date: "2025-09-02", clicks: 120 },
    { date: "2025-09-03", clicks: 150 },
    { date: "2025-09-04", clicks: 180 },
    { date: "2025-09-05", clicks: 200 },
    { date: "2025-09-06", clicks: 170 },
    { date: "2025-09-07", clicks: 190 },
    { date: "2025-09-08", clicks: 210 },
]

const Analytics_Chart = ({ data, onDateChange }) => {
    const chartData = data && data.length > 0 ? data : dummyData;

    const canvasRef = useRef(null)
    const chartRef = useRef(null)
    const [dateFrom, setDateFrom] = useState(() => {
        const date = new Date()
        date.setDate(date.getDate() - 7)
        return date.toISOString().split("T")[0]
    })
    const [dateTo, setDateTo] = useState(() => {
        return new Date().toISOString().split("T")[0]
    })

    const filteredData = useMemo(() => {
        return chartData.filter((item) => {
            const itemDate = new Date(item.date)
            const fromDate = new Date(dateFrom)
            const toDate = new Date(dateTo)
            return itemDate >= fromDate && itemDate <= toDate
        }).sort((a, b) => new Date(a.date) - new Date(b.date))
    }, [chartData, dateFrom, dateTo])

    useEffect(() => {
        const loadChart = async () => {
            const { Chart, registerables } = await import("chart.js")
            Chart.register(...registerables)

            if (canvasRef.current) {
                if (chartRef.current) {
                    chartRef.current.destroy()
                }

                const ctx = canvasRef.current.getContext("2d")
                if (ctx) {
                    chartRef.current = new Chart(ctx, {
                        type: "line",
                        data: {
                            labels: filteredData.map((d) => {
                                const date = new Date(d.date)
                                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            }),
                            datasets: [
                                {
                                    label: "Clicks",
                                    data: filteredData.map((d) => d.clicks),
                                    borderColor: "#4f46e5", // Indigo
                                    backgroundColor: "rgba(79, 70, 229, 0.1)", // Indigo with opacity
                                    borderWidth: 3,
                                    fill: true,
                                    tension: 0.4,
                                    pointBackgroundColor: "#4f46e5", // Indigo
                                    pointBorderColor: "#4f46e5", // Indigo
                                    pointRadius: 6,
                                    pointHoverRadius: 8,
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        color: "#e5e7eb", // Light gray for grid, visible on white bg
                                    },
                                    ticks: {
                                        color: "#000000", // Black
                                        font: {
                                            size: 12,
                                        },
                                    },
                                },
                                x: {
                                    grid: {
                                        display: false,
                                    },
                                    ticks: {
                                        color: "#000000", // Black
                                        font: {
                                            size: 12,
                                        },
                                    },
                                },
                            },
                            elements: {
                                point: {
                                    hoverBackgroundColor: "#4f46e5", // Indigo
                                },
                            },
                        },
                    })
                }
            }
        }

        loadChart()

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy()
            }
        }
    }, [filteredData])

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
                                if (onDateChange) {
                                    onDateChange(new Date(e.target.value), new Date(dateTo));
                                }
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
                                if (onDateChange) {
                                    onDateChange(new Date(dateFrom), new Date(e.target.value));
                                }
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
                    Total Clicks: {filteredData.reduce((sum, d) => sum + d.clicks, 0)}
                </span>
            </div>
        </div>
    )
}

export default Analytics_Chart;
