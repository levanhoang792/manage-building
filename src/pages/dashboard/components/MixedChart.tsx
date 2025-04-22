import {Chart} from 'react-chartjs-2';
import {ChartData, ChartOptions, ChartType,} from 'chart.js';
import {v4} from 'uuid';
import {cn} from "@/lib/utils";

const mixedData: ChartData = {
    labels: ['T1', 'T2', 'T3'],
    datasets: [
        {
            type: 'bar' as const,
            label: 'Doanh thu',
            data: [100, 200, 150],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            type: 'line' as const,
            label: 'Tăng trưởng',
            data: [10, 30, 20],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.4,
            fill: true,
        },
    ],
};

const mixedOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
    },
};

const MixedChart = () => {
    return (
        <div className={cn("min-h-[500px]")}>
            <Chart
                key={v4()}
                type={'bar' as ChartType} // 👈 ép kiểu để đồng bộ
                data={mixedData}
                options={mixedOptions}
            />
        </div>
    );
};

export default MixedChart;
