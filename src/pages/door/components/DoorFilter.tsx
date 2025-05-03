import React, {useEffect, useState} from 'react';
import {DoorQueryParams} from '@/hooks/doors';
import {FunnelIcon, MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import {useDoorTypes} from "@/hooks/doorTypes";

interface DoorFilterProps {
    onFilterChange: (filters: DoorQueryParams) => void;
    initialFilters?: DoorQueryParams;
}

const DoorFilter: React.FC<DoorFilterProps> = ({onFilterChange, initialFilters}) => {
    const [filters, setFilters] = useState<DoorQueryParams>({
        search: '',
        door_type_id: undefined,
        status: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
        ...initialFilters
    });

    const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

    // Cập nhật filters khi initialFilters thay đổi
    useEffect(() => {
        if (initialFilters) {
            setFilters(prev => ({
                ...prev,
                ...initialFilters
            }));
        }
    }, [initialFilters]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        setFilters(prev => ({...prev, search}));
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;

        // Xử lý đặc biệt cho door_type_id để chuyển đổi thành số hoặc undefined
        if (name === 'door_type_id') {
            const doorTypeId = value === '' ? undefined : parseInt(value);
            setFilters(prev => ({...prev, [name]: doorTypeId}));
        } else {
            setFilters(prev => ({...prev, [name]: value}));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange(filters);
    };

    const handleReset = () => {
        const resetFilters: DoorQueryParams = {
            search: '',
            door_type_id: undefined,
            status: '',
            sortBy: 'created_at',
            sortOrder: 'desc'
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    // Fetch door types from API
    const {data: configData, isLoading: isLoadingConfig} = useDoorTypes();

    // Fallback door types in case API fails or is loading
    const fallbackDoorTypes = [
        {value: '', label: 'Tất cả loại cửa'},
        {value: '1', label: 'Cửa thông thường'},
        {value: '2', label: 'Cửa thoát hiểm'},
        {value: '3', label: 'Cửa hạn chế'},
        {value: '4', label: 'Thang máy'},
        {value: '5', label: 'Cầu thang'}
    ];

    // Use door types from API if available, otherwise use fallback
    const apiDoorTypes = configData?.data?.doorTypes
        ? configData.data.doorTypes.map(type => ({value: String(type.id), label: type.name}))
        : [];

    // Add "All door types" option to the beginning
    const doorTypes = [
        {value: '', label: 'Tất cả loại cửa'},
        ...(apiDoorTypes.length > 0 ? apiDoorTypes : fallbackDoorTypes.slice(1))
    ];

    const doorStatuses = [
        {value: '', label: 'Tất cả trạng thái'},
        {value: 'active', label: 'Hoạt động'},
        {value: 'inactive', label: 'Không hoạt động'},
        {value: 'maintenance', label: 'Bảo trì'}
    ];

    const sortOptions = [
        {value: 'name', label: 'Tên cửa'},
        {value: 'door_type_id', label: 'Loại cửa'},
        {value: 'status', label: 'Trạng thái'},
        {value: 'created_at', label: 'Ngày tạo'},
        {value: 'updated_at', label: 'Ngày cập nhật'}
    ];

    return (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                        <div className="relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                            </div>
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleSearchChange}
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Tìm kiếm theo tên cửa..."
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true"/>
                            Bộ lọc
                        </button>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>

                {isAdvancedFilterOpen && (
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label htmlFor="door_type_id" className="block text-sm font-medium text-gray-700">
                                Loại cửa
                            </label>
                            {isLoadingConfig ? (
                                <div className="mt-1 flex items-center">
                                    <div
                                        className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                                    <span className="text-sm text-gray-500">Đang tải loại cửa...</span>
                                </div>
                            ) : (
                                <select
                                    id="door_type_id"
                                    name="door_type_id"
                                    value={filters.door_type_id ? String(filters.door_type_id) : ''}
                                    onChange={handleFilterChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    {doorTypes.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Trạng thái
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                {doorStatuses.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">
                                Sắp xếp theo
                            </label>
                            <select
                                id="sortBy"
                                name="sortBy"
                                value={filters.sortBy}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">
                                Thứ tự
                            </label>
                            <select
                                id="sortOrder"
                                name="sortOrder"
                                value={filters.sortOrder}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="asc">Tăng dần</option>
                                <option value="desc">Giảm dần</option>
                            </select>
                        </div>

                        <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Đặt lại bộ lọc
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default DoorFilter;