import { Doughnut } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { v4 } from 'uuid';

const doughnutData = {
    labels: ['Frontend', 'Backend', 'DevOps'],
    datasets: [
        {
            data: [40, 35, 25],
            backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0'],
        },
    ],
};

// ✅ options với đúng kiểu ChartOptions<'doughnut'>
const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
        },
        tooltip: {
            enabled: true,
        },
    },
};

const DoughnutChart = () => {
    return (
        <div>
            <Doughnut key={v4()} data={doughnutData} options={doughnutOptions} />
        </div>
    );
};

export default DoughnutChart;
