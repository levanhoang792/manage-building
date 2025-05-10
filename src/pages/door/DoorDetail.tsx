import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useGetDoorDetail, useGetDoors, useUpdateDoorStatus} from '@/hooks/doors';
import {useGetFloorDetail} from '@/hooks/floors';
import {useGetBuildingDetail} from '@/hooks/buildings';
import {useDoorTypes} from '@/hooks/doorTypes';
import {useGetDoorCoordinates, useUpdateDoorCoordinate} from '@/hooks/doorCoordinates';
import {httpPut} from '@/utils/api';
import {ArrowLeftIcon, PencilIcon} from '@heroicons/react/24/outline';
import {format} from 'date-fns';
import {vi} from 'date-fns/locale';
import CoordinateVisualizer from './components/CoordinateVisualizer';
import {toast} from 'sonner';
import {QueryClient} from "@tanstack/react-query";

const DoorDetail: React.FC = () => {
    const queryClient = new QueryClient();
    const {id, floorId, doorId} = useParams<{ id: string; floorId: string; doorId: string }>();
    const navigate = useNavigate();

    // Kiểm tra nếu không có id, floorId hoặc doorId, chuyển hướng về trang buildings
    useEffect(() => {
        if (!id || !floorId || !doorId) {
            navigate('/buildings');
        }
    }, [id, floorId, doorId, navigate]);

    // Fetch data
    const {data: doorData, isLoading: isLoadingDoor, refetch: refetchDoor} =
        useGetDoorDetail(id || '0', floorId || '0', doorId || '0');
    const {data: floorData, isLoading: isLoadingFloor} =
        useGetFloorDetail(id || '0', floorId || '0');
    const {data: buildingData, isLoading: isLoadingBuilding} =
        useGetBuildingDetail(id || '0');
    const {data: doorTypesData, isLoading: isLoadingDoorTypes} =
        useDoorTypes();
    const {data: doorCoordinatesData, isLoading: isLoadingDoorCoordinates} =
        useGetDoorCoordinates(id || '0', floorId || '0', doorId || '0');
    const {data: doorsData, isLoading: isLoadingDoors} =
        useGetDoors(id || '0', floorId || '0', {limit: 100});

    // Mutations
    const updateStatusMutation = useUpdateDoorStatus(id || '0', floorId || '0', doorId || '0');
    const updateCoordinateMutation = useUpdateDoorCoordinate(id || '0', floorId || '0', doorId || '0', undefined);

    const handleStatusChange = async (status: 'active' | 'inactive' | 'maintenance') => {
        try {
            await updateStatusMutation.mutateAsync({status});
            refetchDoor();
        } catch (error) {
            console.error('Error updating door status:', error);
        }
    };

    const handleEdit = () => {
        // Thêm tham số returnTo để quay về trang chi tiết cửa sau khi chỉnh sửa
        const currentPath = `/buildings/${id}/floors/${floorId}/doors/${doorId}`;
        const encodedReturnTo = encodeURIComponent(currentPath);
        navigate(`/buildings/${id}/floors/${floorId}/doors/edit/${doorId}?returnTo=${encodedReturnTo}`);
    };

    const handleBack = () => {
        navigate(`/buildings/${id}/floors/${floorId}/doors`);
    };

    const isLoading = isLoadingDoor || isLoadingFloor || isLoadingBuilding || isLoadingDoorTypes || isLoadingDoorCoordinates || isLoadingDoors;
    const door = doorData?.data;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!door) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">Không tìm thấy thông tin cửa.</p>
                <button
                    onClick={handleBack}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                    Quay lại
                </button>
            </div>
        );
    }

    const getDoorTypeLabel = (doorTypeId: number) => {
        // Fallback door types in case API fails or is loading
        const fallbackDoorTypes = [
            {id: 1, name: 'Cửa thông thường'},
            {id: 2, name: 'Cửa thoát hiểm'},
            {id: 3, name: 'Cửa hạn chế'},
            {id: 4, name: 'Thang máy'},
            {id: 5, name: 'Cầu thang'}
        ];

        // Use door types from API if available
        if (doorTypesData?.data?.doorTypes) {
            const doorType = doorTypesData.data.doorTypes.find(type => type.id === doorTypeId);
            if (doorType) {
                return `${doorType.name} - ${doorType.description}`;
            }
        }

        // Fallback if API data is not available
        const fallbackDoorType = fallbackDoorTypes.find(type => type.id === doorTypeId);
        return fallbackDoorType ? fallbackDoorType.name : 'Khác';
    };

    const getDoorStatusLabel = (status: string) => {
        switch (status) {
            case 'active':
                return <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Hoạt động</span>;
            case 'inactive':
                return <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Không hoạt động</span>;
            case 'maintenance':
                return <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Bảo trì</span>;
            default:
                return <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Không xác định</span>;
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm', {locale: vi});
        } catch {
            return dateString;
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <button
                    onClick={handleBack}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <ArrowLeftIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true"/>
                    Quay lại
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Chi tiết cửa</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Tòa nhà: {buildingData?.data?.name} | Tầng: {floorData?.data?.name}
                        </p>
                    </div>
                    <button
                        onClick={handleEdit}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PencilIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true"/>
                        Chỉnh sửa
                    </button>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Tên cửa</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{door.name}</dd>
                        </div>

                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Loại cửa</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {getDoorTypeLabel(door.door_type_id)}
                            </dd>
                        </div>

                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {getDoorStatusLabel(door.status)}
                                <div className="mt-2">
                                    <label className="text-sm font-medium text-gray-500 mr-2">Thay đổi trạng
                                        thái:</label>
                                    <div className="mt-1 flex space-x-2">
                                        <button
                                            onClick={() => handleStatusChange('active')}
                                            disabled={door.status === 'active'}
                                            className={`px-2 py-1 text-xs rounded-md ${
                                                door.status === 'active'
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                            }`}
                                        >
                                            Hoạt động
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange('inactive')}
                                            disabled={door.status === 'inactive'}
                                            className={`px-2 py-1 text-xs rounded-md ${
                                                door.status === 'inactive'
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                            }`}
                                        >
                                            Không hoạt động
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange('maintenance')}
                                            disabled={door.status === 'maintenance'}
                                            className={`px-2 py-1 text-xs rounded-md ${
                                                door.status === 'maintenance'
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                            }`}
                                        >
                                            Bảo trì
                                        </button>
                                    </div>
                                </div>
                            </dd>
                        </div>

                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Mô tả</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {door.description || 'Không có mô tả'}
                            </dd>
                        </div>

                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Ngày tạo</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {formatDate(door.created_at)}
                            </dd>
                        </div>

                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Cập nhật lần cuối</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {formatDate(door.updated_at)}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Tọa độ cửa</h3>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-gray-500">
                                Quản lý vị trí của cửa trên sơ đồ tầng
                            </p>
                            <button
                                onClick={() => navigate(`/buildings/${id}/floors/${floorId}/doors/${doorId}/coordinates`)}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Quản lý tọa độ
                            </button>
                        </div>

                        {floorData?.data?.floor_plan_image ? (
                            <div className="relative">
                                <CoordinateVisualizer
                                    floorPlanImage={floorData.data.floor_plan_image}
                                    coordinates={doorCoordinatesData?.data || []}
                                    isEditable={false}
                                    allDoors={doorsData?.data?.data || []}
                                    currentDoorId={parseInt(doorId || '0')}
                                    onDoorSelect={(door) => navigate(`/buildings/${id}/floors/${floorId}/doors/${door.id}`)}
                                    enableDrag={true}
                                    disableDoorNavigation={true}
                                    onCoordinateUpdate={async (coordinate, x, y) => {
                                        try {
                                            // Lấy doorId từ coordinate thay vì từ URL
                                            const coordinateDoorId = coordinate.door_id.toString();
                                            
                                            console.log('Updating coordinate in DoorDetail:', {
                                                id: coordinate.id,
                                                door_id: coordinate.door_id,
                                                x_coordinate: x,
                                                y_coordinate: y,
                                                rotation: coordinate.rotation,
                                                currentDoorId: doorId,
                                                coordinateDoorId
                                            });

                                            // Cập nhật cache trước khi gọi API
                                            // 1. Cập nhật cache cho doorCoordinates của cửa đang được kéo thả
                                            const doorCoordinatesCache = queryClient.getQueryData(['doorCoordinates', id, floorId, coordinateDoorId]);
                                            if (doorCoordinatesCache) {
                                                const updatedCache = {
                                                    ...doorCoordinatesCache,
                                                    data: doorCoordinatesCache.data.map(c => 
                                                        c.id === coordinate.id 
                                                            ? {...c, x_coordinate: x, y_coordinate: y} 
                                                            : c
                                                    )
                                                };
                                                
                                                queryClient.setQueryData(['doorCoordinates', id, floorId, coordinateDoorId], updatedCache);
                                            }
                                            
                                            // 2. Cập nhật cache cho multipleDoorCoordinates
                                            const multipleCoordinatesCache = queryClient.getQueryData([
                                                'multipleDoorCoordinates', id, floorId, doorsData?.data?.data.map(d => d.id)
                                            ]);
                                            
                                            if (multipleCoordinatesCache) {
                                                const updatedCache = multipleCoordinatesCache.map(item => {
                                                    if (item.doorId.toString() === coordinateDoorId) {
                                                        return {
                                                            ...item,
                                                            data: {
                                                                ...item.data,
                                                                data: item.data.data.map(c => 
                                                                    c.id === coordinate.id 
                                                                        ? {...c, x_coordinate: x, y_coordinate: y} 
                                                                        : c
                                                                )
                                                            }
                                                        };
                                                    }
                                                    return item;
                                                });
                                                
                                                queryClient.setQueryData(
                                                    ['multipleDoorCoordinates', id, floorId, doorsData?.data?.data.map(d => d.id)],
                                                    updatedCache
                                                );
                                            }

                                            // Sử dụng API trực tiếp thay vì hook
                                            const uri = `/buildings/${id}/floors/${floorId}/doors/${coordinateDoorId}/coordinates/${coordinate.id}`;
                                            
                                            // Sử dụng httpPut từ utils/api
                                            const response = await httpPut({
                                                uri,
                                                options: {
                                                    body: JSON.stringify({
                                                        x_coordinate: x,
                                                        y_coordinate: y,
                                                        rotation: coordinate.rotation
                                                    })
                                                }
                                            });
                                            
                                            // Sau khi API thành công, cập nhật lại dữ liệu
                                            await refetchDoor();
                                            
                                            toast.success('Cập nhật tọa độ thành công');
                                        } catch (error) {
                                            console.error('Error updating coordinate:', error);
                                            toast.error('Không thể cập nhật tọa độ. Vui lòng thử lại.');
                                            
                                            // Nếu có lỗi, refetch để lấy lại dữ liệu chính xác
                                            await refetchDoor();
                                        }
                                    }}
                                />
                                {(!doorCoordinatesData?.data || doorCoordinatesData.data.length === 0) && (
                                    <div
                                        className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 rounded-lg">
                                        <p className="text-gray-700 font-medium">
                                            Chưa có tọa độ nào được thiết lập cho cửa này
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                                <p className="text-gray-500 mb-2">Chưa có sơ đồ tầng</p>
                                <p className="text-sm text-gray-400">
                                    Vui lòng tải lên sơ đồ tầng trong phần quản lý tầng
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoorDetail;