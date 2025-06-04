import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    RadialLinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import BarChart, {BarChartData} from "@/pages/dashboard/components/BarChart";
import LineChart, {LineChartData} from "@/pages/dashboard/components/LineChart";
import DoughnutChart, {DoughnutChartData} from "@/pages/dashboard/components/DoughnutChart";
import {useDashboard} from "@/hooks/dashboard/useDashboard";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
    Title
);

export default function Dashboard() {
    const {data: response, isLoading, error} = useDashboard();
    const data = response?.data;

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-lg text-red-600">Error: {error.message}</p>
            </div>
        );
    }

    // Data for door status chart
    const doorStatusData: DoughnutChartData = {
        labels: ['Open', 'Closed'],
        datasets: [
            {
                label: 'Door Status',
                data: data ? [
                    data.doorStatusStats.find(stat => stat.lock_status === 'open')?.count || 0,
                    data.doorStatusStats.find(stat => stat.lock_status === 'closed')?.count || 0
                ] : [0, 0],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Transform building data for charts
    const buildingData = data ? Object.values(
        data.doorStatusByBuilding.reduce((acc, curr) => {
            if (!acc[curr.building_name]) {
                acc[curr.building_name] = {
                    building: curr.building_name,
                    open: 0,
                    closed: 0
                };
            }
            if (curr.lock_status === 'open') {
                acc[curr.building_name].open = curr.count;
            } else {
                acc[curr.building_name].closed = curr.count;
            }
            return acc;
        }, {} as Record<string, { building: string; open: number; closed: number }>)
    ) : [];

    // Data for door status by building chart
    const doorStatusByBuildingData: BarChartData = {
        labels: buildingData.map(item => item.building),
        datasets: [
            {
                label: 'Open Doors',
                data: buildingData.map(item => item.open),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Closed Doors',
                data: buildingData.map(item => item.closed),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Data for weekly activity chart
    const weeklyActivityData: LineChartData = {
        labels: data ? data.weeklyDoorActivity.map(item => item.date) : [],
        datasets: [
            {
                label: 'Total Requests',
                data: data ? data.weeklyDoorActivity.map(item => item.total_requests) : [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Approved Requests',
                data: data ? data.weeklyDoorActivity.map(item => item.approved_requests) : [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    // Data for hourly activity chart
    const hourlyActivityData: LineChartData = {
        labels: data ? data.hourlyActivity.map(item => `${item.hour}:00`) : [],
        datasets: [
            {
                label: 'Total Requests',
                data: data ? data.hourlyActivity.map(item => item.total_requests) : [],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Approved Requests',
                data: data ? data.hourlyActivity.map(item => item.approved_requests) : [],
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    // Data for top active buildings chart
    const topBuildingsData: BarChartData = {
        labels: data ? data.topActiveBuildings.map(item => item.building_name) : [],
        datasets: [
            {
                label: 'Total Requests',
                data: data ? data.topActiveBuildings.map(item => item.total_requests) : [],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
            {
                label: 'Total Doors',
                data: data ? data.topActiveBuildings.map(item => item.total_doors) : [],
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Data for building approval rates chart
    const approvalRatesData: BarChartData = {
        labels: data ? data.buildingApprovalRates.map(item => item.building_name) : [],
        datasets: [
            {
                label: 'Approved Requests',
                data: data ? data.buildingApprovalRates.map(item => item.approved_requests) : [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Rejected Requests',
                data: data ? data.buildingApprovalRates.map(item => item.rejected_requests) : [],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg">Loading dashboard statistics...</p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700">Buildings</h2>
                            <p className="text-3xl font-bold text-blue-600">{data?.basicStats.total_buildings || 0}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700">Floors</h2>
                            <p className="text-3xl font-bold text-green-600">{data?.basicStats.total_floors || 0}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700">Users</h2>
                            <p className="text-3xl font-bold text-purple-600">{data?.basicStats.total_users || 0}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700">Total Doors</h2>
                            <p className="text-3xl font-bold text-orange-600">{data?.basicStats.total_doors || 0}</p>
                        </div>
                    </div>

                    {/* Door Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Door Status</h2>
                            <div className="h-64">
                                <DoughnutChart data={doorStatusData}/>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Door Status by Building</h2>
                            <div className="h-64">
                                <BarChart data={doorStatusByBuildingData}/>
                            </div>
                        </div>
                    </div>

                    {/* Activity Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Weekly Activity</h2>
                            <div className="h-64">
                                <LineChart data={weeklyActivityData}/>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Hourly Activity</h2>
                            <div className="h-64">
                                <LineChart data={hourlyActivityData}/>
                            </div>
                        </div>
                    </div>

                    {/* Building Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Top Active Buildings</h2>
                            <div className="h-64">
                                <BarChart data={topBuildingsData}/>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Building Approval Rates</h2>
                            <div className="h-64">
                                <BarChart data={approvalRatesData}/>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
