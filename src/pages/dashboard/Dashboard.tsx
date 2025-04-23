import {useEffect, useState} from 'react';
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
import PieChart, {PieChartData} from "@/pages/dashboard/components/PieChart";
import DoughnutChart, {DoughnutChartData} from "@/pages/dashboard/components/DoughnutChart";

// Mock data for dashboard statistics (replace with API call later)
const mockStats = {
    buildingCount: 3,
    floorCount: 12,
    userCount: 45,
    doorCount: 36,
    openDoorCount: 15,
    closedDoorCount: 21,
    peopleInBuilding: 28,
    entryExitHistory: [
        {date: '2023-01-01', entries: 42, exits: 38},
        {date: '2023-01-02', entries: 35, exits: 40},
        {date: '2023-01-03', entries: 50, exits: 45},
        {date: '2023-01-04', entries: 38, exits: 42},
        {date: '2023-01-05', entries: 45, exits: 40},
        {date: '2023-01-06', entries: 55, exits: 52},
        {date: '2023-01-07', entries: 30, exits: 35},
    ],
    doorStatusByBuilding: [
        {building: 'Building A', open: 8, closed: 12},
        {building: 'Building B', open: 5, closed: 7},
        {building: 'Building C', open: 2, closed: 2},
    ],
    peopleByBuilding: [
        {building: 'Building A', count: 15},
        {building: 'Building B', count: 10},
        {building: 'Building C', count: 3},
    ]
};

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
    const [stats, setStats] = useState(mockStats);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        const fetchStats = async () => {
            try {
                // Replace with actual API call later
                // const response = await fetch('/api/dashboard/stats');
                // const data = await response.json();
                setStats(mockStats);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Data for door status chart
    const doorStatusData: DoughnutChartData = {
        labels: ['Open', 'Closed'],
        datasets: [
            {
                label: 'Door Status',
                data: [stats.openDoorCount, stats.closedDoorCount],
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

    // Data for entry/exit history chart
    const entryExitData: LineChartData = {
        labels: stats.entryExitHistory.map(item => item.date),
        datasets: [
            {
                label: 'Entries',
                data: stats.entryExitHistory.map(item => item.entries),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Exits',
                data: stats.entryExitHistory.map(item => item.exits),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    // Data for people by building chart
    const peopleByBuildingData: PieChartData = {
        labels: stats.peopleByBuilding.map(item => item.building),
        datasets: [
            {
                label: 'People Count',
                data: stats.peopleByBuilding.map(item => item.count),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Data for door status by building chart
    const doorStatusByBuildingData: BarChartData = {
        labels: stats.doorStatusByBuilding.map(item => item.building),
        datasets: [
            {
                label: 'Open Doors',
                data: stats.doorStatusByBuilding.map(item => item.open),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Closed Doors',
                data: stats.doorStatusByBuilding.map(item => item.closed),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg">Loading dashboard statistics...</p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700">Buildings</h2>
                            <p className="text-3xl font-bold text-blue-600">{stats.buildingCount}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700">Floors</h2>
                            <p className="text-3xl font-bold text-green-600">{stats.floorCount}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700">Users</h2>
                            <p className="text-3xl font-bold text-purple-600">{stats.userCount}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700">People in Buildings</h2>
                            <p className="text-3xl font-bold text-orange-600">{stats.peopleInBuilding}</p>
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

                    {/* Entry/Exit History */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Entry/Exit History</h2>
                        <div className="h-96">
                            <LineChart data={entryExitData}/>
                        </div>
                    </div>

                    {/* People by Building */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">People by Building</h2>
                        <div className="h-64">
                            <PieChart data={peopleByBuildingData}/>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
