import {Line} from 'react-chartjs-2';
import {ChartOptions} from 'chart.js';
import {v4} from 'uuid';

const lineData = {
    labels: ['T2', 'T3', 'T4', 'T5'],
    datasets: [
        {
            label: 'Truy cập',
            data: [100, 300, 200, 500],
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.3,
            fill: true,
        },
    ],
};

// ✅ Cấu hình tùy chỉnh biểu đồ line
const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            enabled: true,
        },
    },
    scales: {
        x: {
            beginAtZero: true,
        },
        y: {
            beginAtZero: true,
        },
    },
};

const LineChart = () => {
    return (
        <div>
            <Line key={v4()} data={lineData} options={lineOptions}/>
        </div>
    );
};

export default LineChart;
