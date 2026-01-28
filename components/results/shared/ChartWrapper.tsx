import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    type ChartOptions
} from 'chart.js';
import { Bar, Line, Scatter } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface ChartWrapperProps {
    type: 'bar' | 'line' | 'scatter';
    data: any;
    options?: ChartOptions<any>;
    className?: string;
    height?: number;
}

/**
 * Chart Wrapper Component
 * Wrapper for Chart.js charts with consistent styling
 */
export function ChartWrapper({
    type,
    data,
    options,
    className = '',
    height = 320
}: ChartWrapperProps) {
    const defaultOptions: ChartOptions<any> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                padding: 12,
                cornerRadius: 8,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f3f4f6' },
                ticks: { font: { size: 11 } }
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } }
            }
        }
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        plugins: {
            ...defaultOptions.plugins,
            ...options?.plugins,
        },
        scales: {
            ...defaultOptions.scales,
            ...options?.scales,
        }
    };

    const ChartComponent = type === 'bar' ? Bar : type === 'line' ? Line : Scatter;

    return (
        <div className={`chart-container ${className}`} style={{ height: `${height}px` }}>
            <ChartComponent data={data} options={mergedOptions} />
        </div>
    );
}

export default ChartWrapper;
