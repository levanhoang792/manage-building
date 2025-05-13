import React, {useEffect, useState} from 'react';
import {DoorRequestQueryParams} from '@/hooks/doorRequests';
import {useGetBuildings} from '@/hooks/buildings';
import {useGetFloors} from '@/hooks/floors';
import {useGetDoors} from '@/hooks/doors';
import {
    AdjustmentsHorizontalIcon,
    ArrowPathIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    FunnelIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import {cn} from '@/lib/utils';

interface DoorRequestFilterProps {
    onFilterChange: (filters: DoorRequestQueryParams) => void;
    initialFilters: DoorRequestQueryParams;
}

const DoorRequestFilter: React.FC<DoorRequestFilterProps> = ({
    onFilterChange,
    initialFilters
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filters, setFilters] = useState<DoorRequestQueryParams>(initialFilters);
    const [selectedBuildingId, setSelectedBuildingId] = useState<string | number | undefined>(
        initialFilters.buildingId
    );
    const [selectedFloorId, setSelectedFloorId] = useState<string | number | undefined>(
        initialFilters.floorId
    );

    // Fetch data
    const {data: buildingsData} = useGetBuildings();
    const {data: floorsData} = useGetFloors(selectedBuildingId || undefined);
    const {data: doorsData} = useGetDoors(
        selectedBuildingId || undefined,
        selectedFloorId || undefined
    );

    const buildings = buildingsData?.data?.data || [];
    const floors = floorsData?.data?.data || [];
    const doors = doorsData?.data?.data || [];

    // Apply filters when they change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onFilterChange(filters);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [filters, onFilterChange]);

    // Reset dependent fields when parent fields change
    useEffect(() => {
        if (selectedBuildingId !== filters.buildingId) {
            setFilters(prev => ({
                ...prev,
                floorId: undefined,
                doorId: undefined
            }));
            setSelectedFloorId(undefined);
        }
    }, [selectedBuildingId, filters.buildingId]);

    useEffect(() => {
        if (selectedFloorId !== filters.floorId) {
            setFilters(prev => ({
                ...prev,
                doorId: undefined
            }));
        }
    }, [selectedFloorId, filters.floorId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        
        if (name === 'buildingId') {
            setSelectedBuildingId(value || undefined);
        } else if (name === 'floorId') {
            setSelectedFloorId(value || undefined);
        }
        
        setFilters(prev => ({
            ...prev,
            [name]: value || undefined
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value || undefined
        }));
    };

    const handleReset = () => {
        setFilters({
            page: 1,
            limit: initialFilters.limit,
            search: '',
            status: '',
            buildingId: undefined,
            floorId: undefined,
            doorId: undefined,
            startDate: undefined,
            endDate: undefined,
            sortBy: 'created_at',
            sortOrder: 'desc'
        });
        setSelectedBuildingId(undefined);
        setSelectedFloorId(undefined);
    };

    return (
        <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Bộ lọc</h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        {isExpanded ? (
                            <ChevronUpIcon className="h-5 w-5" />
                        ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Basic search always visible */}
            <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="search"
                                value={filters.search || ''}
                                onChange={handleInputChange}
                                placeholder="Tìm kiếm theo tên người yêu cầu, email, số điện thoại..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-48">
                        <select
                            name="status"
                            value={filters.status || ''}
                            onChange={handleInputChange}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="pending">Đang chờ</option>
                            <option value="approved">Đã phê duyệt</option>
                            <option value="rejected">Đã từ chối</option>
                        </select>
                    </div>
                    <div className="w-full md:w-48">
                        <select
                            name="sortBy"
                            value={filters.sortBy || 'created_at'}
                            onChange={handleInputChange}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="created_at">Sắp xếp theo thời gian tạo</option>
                            <option value="processed_at">Sắp xếp theo thời gian xử lý</option>
                            <option value="requester_name">Sắp xếp theo tên người yêu cầu</option>
                        </select>
                    </div>
                    <div className="w-full md:w-48">
                        <select
                            name="sortOrder"
                            value={filters.sortOrder || 'desc'}
                            onChange={handleInputChange}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="desc">Giảm dần</option>
                            <option value="asc">Tăng dần</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Advanced filters */}
            {isExpanded && (
                <div className="px-4 py-3 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="buildingId" className="block text-sm font-medium text-gray-700 mb-1">
                                Tòa nhà
                            </label>
                            <select
                                id="buildingId"
                                name="buildingId"
                                value={filters.buildingId || ''}
                                onChange={handleInputChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">Tất cả tòa nhà</option>
                                {buildings.map(building => (
                                    <option key={building.id} value={building.id}>
                                        {building.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="floorId" className="block text-sm font-medium text-gray-700 mb-1">
                                Tầng
                            </label>
                            <select
                                id="floorId"
                                name="floorId"
                                value={filters.floorId || ''}
                                onChange={handleInputChange}
                                disabled={!selectedBuildingId}
                                className={cn(
                                    "block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
                                    !selectedBuildingId && "bg-gray-100 cursor-not-allowed"
                                )}
                            >
                                <option value="">Tất cả tầng</option>
                                {floors.map(floor => (
                                    <option key={floor.id} value={floor.id}>
                                        {floor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="doorId" className="block text-sm font-medium text-gray-700 mb-1">
                                Cửa
                            </label>
                            <select
                                id="doorId"
                                name="doorId"
                                value={filters.doorId || ''}
                                onChange={handleInputChange}
                                disabled={!selectedFloorId}
                                className={cn(
                                    "block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
                                    !selectedFloorId && "bg-gray-100 cursor-not-allowed"
                                )}
                            >
                                <option value="">Tất cả cửa</option>
                                {doors.map(door => (
                                    <option key={door.id} value={door.id}>
                                        {door.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Từ ngày
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={filters.startDate || ''}
                                onChange={handleDateChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Đến ngày
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={filters.endDate || ''}
                                onChange={handleDateChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="px-4 py-3 bg-gray-50 text-right">
                <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                >
                    <ArrowPathIcon className="h-4 w-4 mr-2" />
                    Đặt lại
                </button>
                <button
                    type="button"
                    onClick={() => onFilterChange(filters)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                    Áp dụng bộ lọc
                </button>
            </div>
        </div>
    );
};

export default DoorRequestFilter;