import {Doughnut} from 'react-chartjs-2';
import {ChartData, ChartOptions} from 'chart.js';
import {v4} from 'uuid';

export interface DoughnutChartData extends ChartData<'doughnut'> {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
    }[];
}

// ✅ options với đúng kiểu ChartOptions<'doughnut'>
const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom'
        },
        tooltip: {
            enabled: true
        }
    }
};

interface DoughnutChartProps {
    data: DoughnutChartData;
}

const DoughnutChart = ({data}: DoughnutChartProps) => {
    return <Doughnut key={v4()} data={data} options={doughnutOptions}/>;
};

export default DoughnutChart;
