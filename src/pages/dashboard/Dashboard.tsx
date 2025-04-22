import BarChart from "@/pages/dashboard/components/BarChart";

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
import LineChart from "@/pages/dashboard/components/LineChart";
import PieChart from "@/pages/dashboard/components/PieChart";
import DoughnutChart from "@/pages/dashboard/components/DoughnutChart";
import RadarChart from "@/pages/dashboard/components/RadarChart";
import MultiBarChart from "@/pages/dashboard/components/MultiBarChart";
import MixedChart from "@/pages/dashboard/components/MixedChart";

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
    return (
        <div className="grid grid-cols-2 gap-6 p-4">
            <BarChart/>
            <LineChart/>
            <PieChart/>
            <DoughnutChart/>
            <RadarChart/>
            <MultiBarChart/>
            <MixedChart/>
        </div>
    )
}