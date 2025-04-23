import {Line} from 'react-chartjs-2';
import {ChartData, ChartOptions} from 'chart.js';
import {v4} from 'uuid';

export interface LineChartData extends ChartData<'line'> {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        tension: number;
        fill: boolean;
    }[];
}

// ✅ Cấu hình tùy chỉnh biểu đồ line
const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top'
        },
        tooltip: {
            enabled: true
        }
    },
    scales: {
        x: {
            beginAtZero: true
        },
        y: {
            beginAtZero: true
        }
    }
};

interface LineChartProps {
    data: LineChartData;
}

const LineChart = ({data}: LineChartProps) => {
    return <Line key={v4()} data={data} options={lineOptions}/>;
};

export default LineChart;
