import {Bar} from 'react-chartjs-2';
import {ChartData, ChartOptions} from 'chart.js';
import {v4} from 'uuid';

export interface BarChartData extends ChartData<'bar'> {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    }[];
}

const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, // Cho phép biểu đồ co giãn theo khung cha
    plugins: {
        legend: {
            position: 'top'
        }
    },
    layout: {
        padding: 10
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

interface BarChartProps {
    data: BarChartData;
}

const BarChart = ({data}: BarChartProps) => {
    return <Bar key={v4()} data={data} options={barOptions}/>;
};

export default BarChart;
