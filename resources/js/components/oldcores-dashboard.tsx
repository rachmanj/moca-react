import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface OldcoreRecord {
    id: number;
    migi_detail_id: number;
    item_code: string;
    desc: string;
    total_qty: number;
    created_at: string;
    updated_at: string;
    line: number;
    stock_price: number;
    total_price: number;
    document_number: string;
    document_date: string;
    wo_number: string;
    unit_number: string;
    model_number: string;
    serial_number: string;
}

interface Stats {
    totalItems: number;
    totalQuantity: number;
}

interface MonthlyData {
    month: string;
    total_quantity: number;
}

interface OldcoresDashboardProps {
    data: OldcoreRecord[];
    stats?: Stats;
    monthlyData?: MonthlyData[];
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export default function OldcoresDashboard({ data, stats, monthlyData = [] }: OldcoresDashboardProps) {
    // Format monthly data for the chart
    const formattedMonthlyData = useMemo(() => {
        return monthlyData.map((item) => ({
            ...item,
            month: formatMonth(item.month),
        }));
    }, [monthlyData]);

    // Calculate top items by quantity
    const topItemsByQuantity = useMemo(() => {
        return [...data]
            .sort((a, b) => (b.total_qty || 0) - (a.total_qty || 0))
            .slice(0, 5)
            .map((item) => ({
                id: item.id,
                item_code: item.item_code,
                desc: item.desc,
                total_qty: item.total_qty || 0,
            }));
    }, [data]);

    return (
        <div>
            {/* Stats */}
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="overflow-hidden rounded-lg bg-gray-800 px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-400">Total Items</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">{stats?.totalItems || 0}</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-gray-800 px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-400">Total Quantity</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">{stats?.totalQuantity || 0}</dd>
                </div>
            </dl>

            {/* Monthly Quantity Chart */}
            <div className="mt-8">
                <h3 className="text-lg leading-6 font-medium text-white">Monthly Quantity Trend</h3>
                <div className="mt-4 h-80 rounded-lg bg-gray-800 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={formattedMonthlyData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    borderColor: '#374151',
                                    color: '#F9FAFB',
                                }}
                                formatter={(value: number) => [value.toString(), 'Quantity']}
                            />
                            <Legend />
                            <Bar dataKey="total_quantity" name="Quantity" fill="#6366F1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Items Table */}
            <div className="mt-8">
                <h3 className="text-lg leading-6 font-medium text-white">Top Items by Quantity</h3>
                <div className="mt-4 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-white sm:pl-0">
                                            Item Code
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                            Description
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-white">
                                            Quantity
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {topItemsByQuantity.map((item) => (
                                        <tr key={item.id}>
                                            <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-white sm:pl-0">
                                                {item.item_code}
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-300">{item.desc}</td>
                                            <td className="px-3 py-4 text-right text-sm whitespace-nowrap text-gray-300">{item.total_qty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
