import { BarElement, CategoryScale, Chart as ChartJS, ChartOptions, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartData {
    labels: string[];
    values: number[];
}

interface InventoryChartProps {
    data: ChartData;
    title: string;
}

export default function InventoryChart({ data, title }: InventoryChartProps) {
    // Convert weight values from grams to kilograms
    const kgValues = data.values.map((value) => value / 1000);

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: title.replace('(g)', '(kg)'),
                data: kgValues,
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#d1d5db',
                },
            },
            title: {
                display: true,
                text: title.replace('(g)', '(kg)'),
                color: '#d1d5db',
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(context.parsed.y);
                        }
                        return label;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#d1d5db',
                    callback: function (value: any) {
                        return new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(value);
                    },
                },
                grid: {
                    color: 'rgba(55, 65, 81, 0.5)',
                },
            },
            x: {
                ticks: {
                    color: '#d1d5db',
                },
                grid: {
                    color: 'rgba(55, 65, 81, 0.5)',
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;

    // Placeholder until Chart.js is installed
    return (
        <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-600 p-4">
            <p className="mb-2 text-center text-gray-400">{title}</p>
            <p className="text-center text-sm text-gray-500">Chart will be displayed here once Chart.js and react-chartjs-2 are installed.</p>
            <div className="mt-4 w-full">
                <div className="flex justify-between">
                    {data.labels.map((label, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className="w-8 bg-indigo-600"
                                style={{
                                    height: `${Math.max(20, (data.values[index] / Math.max(...data.values)) * 100)}px`,
                                }}
                            ></div>
                            <span className="mt-1 text-xs text-gray-500">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
