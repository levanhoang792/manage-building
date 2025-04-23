import {Pie} from 'react-chartjs-2';
import {ChartData, ChartOptions} from 'chart.js';
import {v4} from 'uuid';

export interface PieChartData extends ChartData<'pie'> {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    }[];
}

const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom' // bạn có thể đổi sang 'top' / 'left' / 'right'
        },
        tooltip: {
            enabled: true
        }
    }
};

interface PieChartProps {
    data: PieChartData;
}

const PieChart = ({data}: PieChartProps) => {
    return <Pie key={v4()} data={data} options={pieOptions}/>;
};

export default PieChart;
