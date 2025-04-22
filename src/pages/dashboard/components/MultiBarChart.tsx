import {Bar} from 'react-chartjs-2';
import {v4} from 'uuid';
import {ChartData, ChartOptions} from 'chart.js';
import {cn} from '@/lib/utils';

const multiData: ChartData<'bar'> = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3'],
    datasets: [
        {
            label: 'Sản phẩm A',
            data: [10, 20, 30],
            backgroundColor: 'rgba(255, 99, 132, 0.5)'
        },
        {
            label: 'Sản phẩm B',
            data: [15, 25, 10],
            backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }
    ]
};

// 👉 Options để biểu đồ không bị tràn
const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const // ✅ Fix TS ở đây
        }
    },
    layout: {
        padding: 10
    },
    scales: {
        x: {
            beginAtZero: true,
            stacked: false
        },
        y: {
            beginAtZero: true
        }
    }
};

const MultiBarChart = () => {
    return (
        <div className={cn('min-h-[500px]')}>
            <Bar key={v4()} data={multiData} options={options}/>
        </div>
    );
};

export default MultiBarChart;
