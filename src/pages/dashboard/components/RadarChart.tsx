import {Radar} from 'react-chartjs-2';
import {ChartOptions} from 'chart.js';
import {v4} from 'uuid';

const radarData = {
    labels: ['HTML', 'CSS', 'JS', 'React', 'Vue'],
    datasets: [
        {
            label: 'Kỹ năng',
            data: [90, 85, 80, 75, 70],
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
        },
    ],
};

// ✅ Cấu hình cho biểu đồ radar
const radarOptions: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
    },
    scales: {
        r: {
            beginAtZero: true,
            min: 0,
            max: 100,
            ticks: {
                stepSize: 20,
            },
        },
    },
};

const RadarChart = () => {
    return (
        <div>
            <Radar key={v4()} data={radarData} options={radarOptions}/>
        </div>
    );
};

export default RadarChart;
