import { useMemo } from 'react';
import InventoryChart from './inventory-chart';

interface InventoryRecord {
    id: number;
    item_code: string;
    description: string;
    total_qty: number;
    avg_unit_price: number;
    total_amount: number;
    uom: string;
    avg_weight: number;
    total_weight: number;
    created_at: string;
    updated_at: string;
}

interface Stats {
    totalItems: number;
    totalQuantity: number;
    totalWeight: number;
}

interface MonthlyData {
    month: string;
    total_weight: number;
}

interface InventoryDashboardProps {
    data: InventoryRecord[];
    stats?: Stats;
    monthlyData?: MonthlyData[];
}

export default function InventoryDashboard({ data, stats, monthlyData = [] }: InventoryDashboardProps) {
    // Calculate summary statistics if not provided from backend
    const calculatedStats = useMemo(() => {
        if (stats) return stats;

        const totalItems = data.length;
        const totalQuantity = data.reduce((sum, item) => sum + (item.total_qty || 0), 0);
        const totalWeight = data.reduce((sum, item) => sum + (item.total_weight || 0), 0);
        const avgWeight = totalQuantity > 0 ? totalWeight / totalQuantity : 0;

        return {
            totalItems,
            totalQuantity,
            totalWeight,
            avgWeight,
        };
    }, [data, stats]);

    // Format number function
    const formatNumber = (num: number | null | undefined) => {
        if (num === null || num === undefined) return '-';

        // Ensure we're using a locale that uses commas for thousands separators
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    };

    // Process monthly data for chart
    const processedMonthlyData = useMemo(() => {
        // Get current date to determine the current year
        const today = new Date();
        const currentYear = today.getFullYear();
        const months: Record<string, number> = {};

        // Initialize all months of the current year with zero values (Jan to Dec)
        for (let month = 1; month <= 12; month++) {
            const monthYear = `${currentYear}-${String(month).padStart(2, '0')}`;
            months[monthYear] = 0;
        }

        if (monthlyData && monthlyData.length > 0) {
            // Fill in actual values from backend data
            monthlyData.forEach((item) => {
                // Extract year from the month string
                const [itemYear] = item.month.split('-');

                // Only use data from the current year
                if (itemYear === String(currentYear)) {
                    months[item.month] = item.total_weight;
                }
            });
        } else {
            // Calculate from inventory data if not provided
            data.forEach((item) => {
                if (!item.created_at) return;

                const date = new Date(item.created_at);

                // Only use data from the current year
                if (date.getFullYear() === currentYear) {
                    const monthYear = `${currentYear}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    months[monthYear] += item.total_weight || 0;
                }
            });
        }

        // Convert to array of [month, value] entries and sort by month
        return Object.entries(months).sort((a, b) => {
            // Sort by month number
            const monthA = parseInt(a[0].split('-')[1]);
            const monthB = parseInt(b[0].split('-')[1]);
            return monthA - monthB;
        });
    }, [data, monthlyData]);

    // Format month labels for chart
    const chartData = useMemo(() => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const labels = processedMonthlyData.map(([month]) => {
            // Get month number (1-12) and convert to index (0-11)
            const monthIndex = parseInt(month.split('-')[1]) - 1;
            return monthNames[monthIndex];
        });

        const values = processedMonthlyData.map(([, value]) => Number(value));

        return { labels, values };
    }, [processedMonthlyData]);

    // Calculate average weight
    const avgWeight = useMemo(() => {
        // Check if calculatedStats is from backend (stats) or locally calculated
        const hasAvgWeight = 'avgWeight' in calculatedStats;
        if (hasAvgWeight) return (calculatedStats as { avgWeight: number }).avgWeight;

        return calculatedStats.totalQuantity > 0 ? calculatedStats.totalWeight / calculatedStats.totalQuantity : 0;
    }, [calculatedStats]);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-400">Total Items</dt>
                        <dd className="mt-1 text-3xl font-semibold text-white">{calculatedStats.totalItems}</dd>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-400">Total Quantity</dt>
                        <dd className="mt-1 text-3xl font-semibold text-white">{formatNumber(calculatedStats.totalQuantity)}</dd>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-400">Total Weight (kg)</dt>
                        <dd className="mt-1 text-3xl font-semibold text-white">{formatNumber(calculatedStats.totalWeight / 1000)}</dd>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-400">Average Weight (kg)</dt>
                        <dd className="mt-1 text-3xl font-semibold text-white">{formatNumber(avgWeight / 1000)}</dd>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-white">Monthly Total Weight ({new Date().getFullYear()})</h3>
                    <div className="mt-5">
                        {processedMonthlyData.length > 0 ? (
                            <InventoryChart data={chartData} title={`Total Weight by Month (kg) - ${new Date().getFullYear()}`} />
                        ) : (
                            <div className="flex h-64 w-full items-center justify-center">
                                <p className="text-gray-400">No data available for chart</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Items Section */}
            <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-white">Recently Added Items</h3>
                    <div className="mt-5">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead>
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                                            Item Code
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                                            Description
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-400 uppercase">
                                            Quantity
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-400 uppercase">
                                            Total Weight (kg)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700 bg-gray-800">
                                    {data
                                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                        .slice(0, 5)
                                        .map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-700">
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-white">{item.item_code}</td>
                                                <td className="px-6 py-4 text-sm text-white">{item.description}</td>
                                                <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-white">
                                                    {formatNumber(item.total_qty)}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-white">
                                                    {formatNumber(item.total_weight / 1000)}
                                                </td>
                                            </tr>
                                        ))}
                                    {data.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-400">
                                                No items found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
