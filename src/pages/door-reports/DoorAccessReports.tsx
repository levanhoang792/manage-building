import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  useGetDoorAccessReports, 
  DoorReportType, 
  DoorReportGroupBy
} from '@/hooks/doors/useDoorLock';
import { useGetBuildings, Building } from '@/hooks/buildings';
import { useGetFloors, Floor } from '@/hooks/floors';
import { useGetDoors } from '@/hooks/doors';
import { 
  ArrowPathIcon, 
  BuildingOffice2Icon, 
  ChartBarIcon, 
  ChartPieIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';
import { cn } from '@/lib/utils';
import { format, parseISO, subDays } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

const DoorAccessReports: React.FC = () => {
  // URL params
  const { buildingId = '', floorId = '', doorId = '' } = useParams<{
    buildingId: string;
    floorId: string;
    doorId: string;
  }>();

  // State for report parameters
  const [reportType, setReportType] = useState<DoorReportType>('summary');
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [groupBy, setGroupBy] = useState<DoorReportGroupBy>('day');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(buildingId);
  const [selectedFloorId, setSelectedFloorId] = useState<string>(floorId);
  const [selectedDoorId, setSelectedDoorId] = useState<string>(doorId);

  // Fetch data
  const { data: buildingsData } = useGetBuildings({ limit: 100 });
  const { data: floorsData } = useGetFloors(selectedBuildingId, {
    enabled: !!selectedBuildingId
  });
  const { data: doorsData } = useGetDoors(
    selectedBuildingId,
    selectedFloorId,
    {
      limit: 100,
      enabled: !!selectedBuildingId && (!!selectedFloorId || selectedFloorId === 'all')
    }
  );

  // Fetch report data
  const { data: reportData, isLoading: isLoadingReport, refetch } = useGetDoorAccessReports(
    selectedBuildingId,
    selectedFloorId,
    selectedDoorId || 'all',
    {
      report_type: reportType,
      start_date: startDate ? `${startDate}T00:00:00Z` : undefined,
      end_date: endDate ? `${endDate}T23:59:59Z` : undefined,
      group_by: groupBy,
      format: 'json',
      enabled: !!selectedBuildingId && (!!selectedFloorId || selectedFloorId === 'all')
    }
  );

  // Extract data from API responses
  const buildings = buildingsData?.data?.data || [];
  const floors = floorsData?.data?.data || [];
  const doors = doorsData?.data?.data || [];

  // Set initial values if not already set
  useEffect(() => {
    if (buildings.length > 0 && !selectedBuildingId) {
      setSelectedBuildingId(buildings[0].id.toString());
    }
  }, [buildings, selectedBuildingId]);

  useEffect(() => {
    if (!selectedFloorId && selectedBuildingId) {
      setSelectedFloorId('all');
    }
  }, [selectedFloorId, selectedBuildingId]);

  useEffect(() => {
    // Default to 'all' for doors
    if (!selectedDoorId) {
      setSelectedDoorId('all');
    }
  }, [selectedDoorId]);

  // Handle building selection
  const handleBuildingSelect = (id: string) => {
    setSelectedBuildingId(id);
    setSelectedFloorId('');
    setSelectedDoorId('all');
  };

  // Handle floor selection
  const handleFloorSelect = (id: string) => {
    setSelectedFloorId(id);
    setSelectedDoorId('all');
  };

  // Handle door selection
  const handleDoorSelect = (id: string) => {
    setSelectedDoorId(id || 'all');
  };

  // Handle report type selection
  const handleReportTypeSelect = (type: DoorReportType) => {
    setReportType(type);
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
    toast.success('Dữ liệu báo cáo đã được cập nhật');
  };

  // Handle download CSV
  const handleDownloadCSV = () => {
    if (!selectedBuildingId) {
      toast.error('Vui lòng chọn tòa nhà trước khi tải xuống báo cáo');
      return;
    }

    const url = `${import.meta.env.VITE_API_URL}/buildings/${selectedBuildingId}/floors/${selectedFloorId || 'all'}/doors/${selectedDoorId || 'all'}/lock-reports?report_type=${reportType}&start_date=${startDate ? `${startDate}T00:00:00Z` : ''}&end_date=${endDate ? `${endDate}T23:59:59Z` : ''}&group_by=${groupBy}&format=csv`;

    window.open(url, '_blank');
    toast.success('Đang tải xuống báo cáo CSV');
  };

  // Render summary report
  const renderSummaryReport = () => {
    if (!reportData?.data) return null;

    const data = reportData.data;

    // Check if required data exists
    if (!data.summary || !data.most_active_doors || !data.most_active_users || !data.recent_activity || !data.period) {
      return (
        <div className="flex flex-col justify-center items-center h-96 bg-gray-50 rounded-lg">
          <ChartBarIcon className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center font-medium">Dữ liệu báo cáo không đầy đủ</p>
          <p className="text-gray-400 text-sm mt-2 text-center">Vui lòng thử lại hoặc chọn tham số khác</p>
        </div>
      );
    }

    // Prepare data for pie chart
    const pieData = {
      labels: ['Mở cửa', 'Đóng cửa'],
      datasets: [
        {
          data: [data.summary.open_events || 0, data.summary.close_events || 0],
          backgroundColor: ['#10b981', '#ef4444'],
          borderColor: ['#047857', '#b91c1c'],
          borderWidth: 1,
        },
      ],
    };

    // Prepare data for bar chart (most active doors)
    const barData = {
      labels: data.most_active_doors.map((door: any) => door.door_name || 'Không xác định'),
      datasets: [
        {
          label: 'Số lần truy cập',
          data: data.most_active_doors.map((door: any) => door.access_count || 0),
          backgroundColor: '#6366f1',
        },
      ],
    };

    // Prepare data for bar chart (most active users)
    const userBarData = {
      labels: data.most_active_users.map((user: any) => user.user_name || 'Không xác định'),
      datasets: [
        {
          label: 'Số lần truy cập',
          data: data.most_active_users.map((user: any) => user.access_count || 0),
          backgroundColor: '#8b5cf6',
        },
      ],
    };

    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Tổng quan</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Tổng số cửa</p>
              <p className="text-2xl font-bold text-indigo-600">{data.summary.total_doors}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Tổng số sự kiện</p>
              <p className="text-2xl font-bold text-green-600">{data.summary.total_access_events}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Số người dùng</p>
              <p className="text-2xl font-bold text-purple-600">{data.summary.unique_users}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Thời gian</p>
              <p className="text-sm font-medium text-blue-600">
                {!data.period.start_date || data.period.start_date === 'All time'
                  ? 'Tất cả thời gian'
                  : `${
                      data.period.start_date ? format(parseISO(data.period.start_date), 'dd/MM/yyyy') : 'N/A'
                    } - ${
                      data.period.end_date ? format(parseISO(data.period.end_date), 'dd/MM/yyyy') : 'N/A'
                    }`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Phân bố trạng thái</h3>
          <div className="h-64">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Cửa được sử dụng nhiều nhất</h3>
          <div className="h-64">
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Người dùng hoạt động nhiều nhất</h3>
          <div className="h-64">
            <Bar
              data={userBarData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Hoạt động gần đây</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cửa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.recent_activity.map((activity: any) => (
                  <tr key={activity.id || Math.random()}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.door_name || 'Không xác định'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.new_status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {activity.new_status === 'open' ? 'Mở' : 'Đóng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.user_name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.created_at ? format(parseISO(activity.created_at), 'dd/MM/yyyy HH:mm:ss') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Render frequency report
  const renderFrequencyReport = () => {
    if (!reportData?.data) return null;

    const data = reportData.data;

    // Check if required data exists
    if (!data.frequency_data || !Array.isArray(data.frequency_data) || data.frequency_data.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-96 bg-gray-50 rounded-lg">
          <ChartBarIcon className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center font-medium">Không có dữ liệu tần suất</p>
          <p className="text-gray-400 text-sm mt-2 text-center">Vui lòng thử lại với khoảng thời gian khác</p>
        </div>
      );
    }

    // Prepare data for line chart
    const lineData = {
      labels: data.frequency_data.map((item: any) => item.time_period || ''),
      datasets: [
        {
          label: 'Tổng truy cập',
          data: data.frequency_data.map((item: any) => item.access_count || 0),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          fill: true,
        },
        {
          label: 'Mở cửa',
          data: data.frequency_data.map((item: any) => item.open_events || 0),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          fill: true,
        },
        {
          label: 'Đóng cửa',
          data: data.frequency_data.map((item: any) => item.close_events || 0),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          fill: true,
        },
      ],
    };

    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Tần suất truy cập theo {
            groupBy === 'hour' ? 'giờ' :
            groupBy === 'day' ? 'ngày' :
            groupBy === 'week' ? 'tuần' :
            groupBy === 'month' ? 'tháng' : 'năm'
          }</h3>
          <div className="h-96">
            <Line
              data={lineData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Render user activity report
  const renderUserActivityReport = () => {
    if (!reportData?.data) return null;

    const data = reportData.data;

    // Check if required data exists
    if (!data.user_activity || !Array.isArray(data.user_activity) || data.user_activity.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-96 bg-gray-50 rounded-lg">
          <UserGroupIcon className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center font-medium">Không có dữ liệu hoạt động người dùng</p>
          <p className="text-gray-400 text-sm mt-2 text-center">Vui lòng thử lại với các tham số khác</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Hoạt động người dùng</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng truy cập</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mở cửa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đóng cửa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lần đầu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lần cuối</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.user_activity.map((user: any) => (
                  <tr key={user.changed_by || Math.random()}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.user_name || 'Không xác định'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.user_email || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.access_count || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.open_events || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.close_events || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.first_access ? format(parseISO(user.first_access), 'dd/MM/yyyy HH:mm') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_access ? format(parseISO(user.last_access), 'dd/MM/yyyy HH:mm') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Render time analysis report
  const renderTimeAnalysisReport = () => {
    if (!reportData?.data) return null;

    const data = reportData.data;

    // Check if required data exists
    if (!data.hourly_distribution || !Array.isArray(data.hourly_distribution) || data.hourly_distribution.length === 0 ||
        !data.daily_distribution || !Array.isArray(data.daily_distribution) || data.daily_distribution.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-96 bg-gray-50 rounded-lg">
          <ClockIcon className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center font-medium">Không có dữ liệu phân tích thời gian</p>
          <p className="text-gray-400 text-sm mt-2 text-center">Vui lòng thử lại với khoảng thời gian khác</p>
        </div>
      );
    }

    // Prepare data for hourly distribution
    const hourlyData = {
      labels: data.hourly_distribution.map((item: any) => `${item.hour_of_day || 0}:00`),
      datasets: [
        {
          label: 'Số lần truy cập',
          data: data.hourly_distribution.map((item: any) => item.access_count || 0),
          backgroundColor: '#6366f1',
        },
      ],
    };

    // Prepare data for daily distribution
    const dailyData = {
      labels: data.daily_distribution.map((item: any) => item.day_of_week || ''),
      datasets: [
        {
          label: 'Số lần truy cập',
          data: data.daily_distribution.map((item: any) => item.access_count || 0),
          backgroundColor: '#8b5cf6',
        },
      ],
    };

    // Prepare data for radar chart
    const radarData = {
      labels: data.daily_distribution.map((item: any) => item.day_of_week || ''),
      datasets: [
        {
          label: 'Phân bố theo ngày trong tuần',
          data: data.daily_distribution.map((item: any) => item.access_count || 0),
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: '#6366f1',
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#6366f1',
        },
      ],
    };

    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Phân bố theo giờ trong ngày</h3>
          <div className="h-64">
            <Bar
              data={hourlyData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Phân bố theo ngày trong tuần</h3>
          <div className="h-64">
            <Bar
              data={dailyData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Biểu đồ radar phân bố theo ngày</h3>
          <div className="h-96 flex justify-center">
            <div className="w-1/2 h-full">
              <Radar
                data={radarData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render door comparison report
  const renderDoorComparisonReport = () => {
    if (!reportData?.data) return null;

    const data = reportData.data;

    // Check if required data exists
    if (!data.door_comparison || !Array.isArray(data.door_comparison) || data.door_comparison.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-96 bg-gray-50 rounded-lg">
          <BuildingOffice2Icon className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center font-medium">Không có dữ liệu so sánh cửa</p>
          <p className="text-gray-400 text-sm mt-2 text-center">Vui lòng thử lại với các tham số khác</p>
        </div>
      );
    }

    // Prepare data for bar chart
    const barData = {
      labels: data.door_comparison.map((door: any) => door.door_name || 'Không xác định'),
      datasets: [
        {
          label: 'Tổng truy cập',
          data: data.door_comparison.map((door: any) => door.access_count || 0),
          backgroundColor: '#6366f1',
        },
      ],
    };

    // Prepare data for pie chart
    const pieData = {
      labels: data.door_comparison.map((door: any) => door.door_name || 'Không xác định'),
      datasets: [
        {
          data: data.door_comparison.map((door: any) => door.access_count || 0),
          backgroundColor: [
            '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b',
            '#10b981', '#06b6d4', '#3b82f6', '#a855f7', '#d946ef'
          ],
          borderWidth: 1,
        },
      ],
    };

    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">So sánh tần suất sử dụng cửa</h3>
          <div className="h-96">
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Phân bố sử dụng cửa</h3>
          <div className="h-96">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Chi tiết so sánh cửa</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cửa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tầng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng truy cập</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mở cửa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đóng cửa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số người dùng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lần đầu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lần cuối</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.door_comparison.map((door: any) => (
                  <tr key={door.door_id || Math.random()}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{door.door_name || 'Không xác định'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{door.floor_name || 'Không xác định'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{door.access_count || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{door.open_events || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{door.close_events || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{door.unique_users || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {door.first_access ? format(parseISO(door.first_access), 'dd/MM/yyyy HH:mm') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {door.last_access ? format(parseISO(door.last_access), 'dd/MM/yyyy HH:mm') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Render report based on type
  const renderReport = () => {
    if (isLoadingReport) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="ml-4 text-gray-600">Đang tải dữ liệu báo cáo...</p>
        </div>
      );
    }

    if (!reportData) {
      return (
        <div className="flex flex-col justify-center items-center h-96 bg-gray-50 rounded-lg">
          <ChartBarIcon className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center font-medium">Không có dữ liệu báo cáo</p>
          <p className="text-gray-400 text-sm mt-2 text-center">Vui lòng chọn các tham số báo cáo và nhấn Tạo báo cáo</p>
        </div>
      );
    }

    switch (reportType) {
      case 'summary':
        return renderSummaryReport();
      case 'frequency':
        return renderFrequencyReport();
      case 'user_activity':
        return renderUserActivityReport();
      case 'time_analysis':
        return renderTimeAnalysisReport();
      case 'door_comparison':
        return renderDoorComparisonReport();
      default:
        return null;
    }
  };

  return (
    <div className="h-[calc(100vh-var(--header-height)-2rem)] flex flex-col p-4">
      {/* Header section */}
      <div className="flex justify-between items-center h-12">
        <h1 className="text-xl font-bold text-gray-900">Báo cáo truy cập cửa</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowsPointingOutIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            Tải CSV
          </button>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
          >
            <ArrowPathIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Filters section */}
      <div className="bg-white rounded-lg shadow-md p-4 mt-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
              Tòa nhà
            </label>
            <select
              id="building"
              value={selectedBuildingId}
              onChange={(e) => handleBuildingSelect(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Chọn tòa nhà</option>
              {buildings.map((building: Building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
              Tầng
            </label>
            <select
              id="floor"
              value={selectedFloorId}
              onChange={(e) => handleFloorSelect(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={!selectedBuildingId}
            >
              <option value="all">Tất cả các tầng</option>
              {floors.map((floor: Floor) => (
                <option key={floor.id} value={floor.id}>
                  {floor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="door" className="block text-sm font-medium text-gray-700 mb-1">
              Cửa
            </label>
            <select
              id="door"
              value={selectedDoorId}
              onChange={(e) => handleDoorSelect(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={!selectedFloorId}
            >
              <option value="all">Tất cả các cửa</option>
              {doors.map((door: any) => (
                <option key={door.id} value={door.id}>
                  {door.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
              Loại báo cáo
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => handleReportTypeSelect(e.target.value as DoorReportType)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="summary">Tổng quan</option>
              <option value="frequency">Tần suất</option>
              <option value="user_activity">Hoạt động người dùng</option>
              <option value="time_analysis">Phân tích thời gian</option>
              <option value="door_comparison">So sánh cửa</option>
            </select>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Từ ngày
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Đến ngày
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>

          <div>
            <label htmlFor="groupBy" className="block text-sm font-medium text-gray-700 mb-1">
              Nhóm theo
            </label>
            <select
              id="groupBy"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as DoorReportGroupBy)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={reportType !== 'frequency'}
            >
              <option value="hour">Giờ</option>
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => refetch()}
              disabled={isLoadingReport}
              className={cn(
                "w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                isLoadingReport
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              )}
            >
              {isLoadingReport ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tải...
                </>
              ) : (
                <>
                  <ChartBarIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                  Tạo báo cáo
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Report type tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mt-4">
        <button
          onClick={() => handleReportTypeSelect('summary')}
          className={cn(
            "flex-1 py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center",
            reportType === 'summary'
              ? "bg-white text-indigo-700 shadow"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <ChartPieIcon className="h-4 w-4 mr-2" />
          Tổng quan
        </button>
        <button
          onClick={() => handleReportTypeSelect('frequency')}
          className={cn(
            "flex-1 py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center",
            reportType === 'frequency'
              ? "bg-white text-indigo-700 shadow"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <ChartBarIcon className="h-4 w-4 mr-2" />
          Tần suất
        </button>
        <button
          onClick={() => handleReportTypeSelect('user_activity')}
          className={cn(
            "flex-1 py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center",
            reportType === 'user_activity'
              ? "bg-white text-indigo-700 shadow"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <UserGroupIcon className="h-4 w-4 mr-2" />
          Người dùng
        </button>
        <button
          onClick={() => handleReportTypeSelect('time_analysis')}
          className={cn(
            "flex-1 py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center",
            reportType === 'time_analysis'
              ? "bg-white text-indigo-700 shadow"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <ClockIcon className="h-4 w-4 mr-2" />
          Thời gian
        </button>
        <button
          onClick={() => handleReportTypeSelect('door_comparison')}
          className={cn(
            "flex-1 py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center",
            reportType === 'door_comparison'
              ? "bg-white text-indigo-700 shadow"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <BuildingOffice2Icon className="h-4 w-4 mr-2" />
          So sánh cửa
        </button>
      </div>

      {/* Report content */}
      <div className="flex-1 overflow-auto mt-4">
        {renderReport()}
      </div>
    </div>
  );
};

export default DoorAccessReports;
