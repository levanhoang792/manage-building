import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { v4 } from 'uuid';

// ✅ Kiểu dữ liệu cho option bar chart
const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, // Cho phép biểu đồ co giãn theo khung cha
    plugins: {
        legend: {
            position: 'top',
        },
    },
    layout: {
        padding: 10,
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

const barData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3'],
    datasets: [
        {
            label: 'Doanh thu (triệu)',
            data: [12, 19, 3],
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
    ],
};

const BarChart = () => {
    return (
        <div>
            <Bar key={v4()} data={barData} options={barOptions} />
        </div>
    );
};

export default BarChart;
