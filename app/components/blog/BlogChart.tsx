"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area
} from "recharts";

type BlogChartProps = {
    data: any[];
    type?: "bar" | "line" | "area";
    xKey: string;
    dataKeys: { key: string; color: string; name?: string }[];
    title?: string;
};

export function BlogChart({ data, type = "bar", xKey, dataKeys, title }: BlogChartProps) {
    const renderChart = () => {
        const commonProps = {
            data,
            margin: { top: 20, right: 30, left: 20, bottom: 5 }
        };

        if (type === "line") {
            return (
                <LineChart {...commonProps}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.1)" />
                    <XAxis dataKey={xKey} stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Legend />
                    {dataKeys.map((k) => (
                        <Line
                            key={k.key}
                            type="monotone"
                            dataKey={k.key}
                            name={k.name || k.key}
                            stroke={k.color}
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    ))}
                </LineChart>
            );
        }

        if (type === "area") {
            return (
                <AreaChart {...commonProps}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.1)" />
                    <XAxis dataKey={xKey} stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Legend />
                    {dataKeys.map((k) => (
                        <Area
                            key={k.key}
                            type="monotone"
                            dataKey={k.key}
                            name={k.name || k.key}
                            stroke={k.color}
                            fill={k.color}
                            fillOpacity={0.3}
                        />
                    ))}
                </AreaChart>
            );
        }

        return (
            <BarChart {...commonProps}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.1)" />
                <XAxis dataKey={xKey} stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                {dataKeys.map((k) => (
                    <Bar
                        key={k.key}
                        dataKey={k.key}
                        name={k.name || k.key}
                        fill={k.color}
                        radius={[4, 4, 0, 0]}
                    />
                ))}
            </BarChart>
        );
    };

    return (
        <div className="my-8">
            {title && <h4 className="text-center mb-4 font-semibold text-slate-700 dark:text-slate-300">{title}</h4>}
            <div className="w-full h-[400px] p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
