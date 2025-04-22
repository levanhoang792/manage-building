import {Pie} from 'react-chartjs-2';
import {ChartOptions} from 'chart.js';
import {v4} from 'uuid';
import {cn} from "@/lib/utils";

const pieData = {
    labels: ['Chrome', 'Firefox', 'Edge'],
    datasets: [
        {
            label: 'Tỉ lệ người dùng',
            data: [60, 25, 15],
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            hoverOffset: 10,
        },
    ],
};

// ✅ Cấu hình chuẩn cho Pie Chart
const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom', // bạn có thể đổi sang 'top' / 'left' / 'right'
        },
        tooltip: {
            enabled: true,
        },
    },
};

const PieChart = () => {
    return (
        <div className={cn("min-h-[500px]")}>
            <Pie key={v4()} data={pieData} options={pieOptions}/>
        </div>
    );
};

export default PieChart;
