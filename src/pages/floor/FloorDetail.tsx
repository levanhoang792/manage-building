import {useNavigate, useParams} from 'react-router-dom';
import {ArrowLeftIcon, PencilIcon, PlusIcon} from '@heroicons/react/24/outline';
import {Button} from '@headlessui/react';
import {useGetFloorDetail} from '@/hooks/floors';
import Spinner from '@/components/commons/Spinner';
import {format} from 'date-fns';
import {cn} from '@/lib/utils';
import {useGetBuildings} from "@/hooks/buildings";
import {useGetDoors} from '@/hooks/doors';
import CoordinateVisualizer from '../door/components/CoordinateVisualizer';
import {toast} from 'sonner';
import {useQueryClient} from "@tanstack/react-query";
import {httpPut} from '@/utils/api';

export default function FloorDetail() {
    const navigate = useNavigate();
    const {id, floorId} = useParams<{ id: string; floorId: string }>();

    // Fetch building details to show building name
    const {data: buildingData, isLoading: isBuildingLoading} = useGetBuildings();
    const building = buildingData?.data.data.find(b => b.id === Number(id));

    // Fetch floor details
    const {
        data: floorData,
        isLoading: isFloorLoading,
    } = useGetFloorDetail(id || '', floorId || '');

    // Fetch doors for this floor
    const {
        data: doorsData,
        isLoading: isDoorsLoading,
        refetch: refetchDoors
    } = useGetDoors(id || '', floorId || '', {limit: 100});

    // Mutation để cập nhật tọa độ cửa - không cần truyền doorId cụ thể ở đây
    // Chúng ta sẽ tạo mutation mới cho mỗi cửa khi cần
    const queryClient = useQueryClient();

    const floor = floorData?.data;

    // Navigate back to floor list
    const handleBack = () => {
        navigate(`/buildings/${id}/floors`);
    };

    // Navigate to edit floor
    const handleEdit = () => {
        navigate(`/buildings/${id}/floors/edit/${floorId}`);
    };

    // Navigate to view doors
    const handleViewDoors = () => {
        navigate(`/buildings/${id}/floors/${floorId}/doors`);
    };

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
        } catch {
            return dateString;
        }
    };

    if (isFloorLoading || isBuildingLoading || isDoorsLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner className="h-8 w-8 text-indigo-500"/>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button
                    onClick={handleBack}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <ArrowLeftIcon className="-ml-1 mr-1 h-4 w-4"/>
                    Back to Floors
                </Button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Floor Details</h1>
                        {building && (
                            <p className="text-gray-600 mt-1">
                                Building: <span className="font-medium">{building.name}</span>
                            </p>
                        )}
                    </div>
                    <div className="flex space-x-3">
                        <Button
                            onClick={handleEdit}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <PencilIcon className="-ml-1 mr-2 h-4 w-4 text-gray-500"/>
                            Edit
                        </Button>
                        <Button
                            onClick={handleViewDoors}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            View Doors
                        </Button>
                        <Button
                            onClick={() => {
                                const currentPath = `/buildings/${id}/floors/${floorId}`;
                                const encodedReturnTo = encodeURIComponent(currentPath);
                                navigate(`/buildings/${id}/floors/${floorId}/doors/create?returnTo=${encodedReturnTo}`);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-4 w-4 text-white"/>
                            Add Door
                        </Button>
                    </div>
                </div>

                {floor && (
                    <div className="px-6 py-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Floor Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{floor.name}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Floor Number</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{floor.floor_number}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            <span
                                                className={cn(
                                                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                                    floor.status === 'active'
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                )}
                                            >
                                                {floor.status === 'active' ? 'Active' : 'Inactive'}
                                            </span>
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Description</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{floor.description || '-'}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Created At</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{formatDate(floor.created_at)}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Updated At</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{formatDate(floor.updated_at)}</dd>
                                    </div>
                                </dl>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Floor Plan</h3>
                                {floor.floor_plan_image ? (
                                    <div className="border rounded-lg overflow-hidden">
                                        <div className="relative">
                                            <CoordinateVisualizer
                                                floorPlanImage={floor.floor_plan_image}
                                                coordinates={[]} // No specific coordinates to show
                                                isEditable={true} // Cho phép click để thêm tọa độ mới
                                                allDoors={doorsData?.data?.data || []}
                                                currentDoorId={0} // No current door selected
                                                onDoorSelect={(door) => navigate(`/buildings/${id}/floors/${floorId}/doors/${door.id}`)}
                                                onCoordinateAdd={(x, y) => {
                                                    // Chuyển đến trang tạo cửa mới với tọa độ đã chọn và tham số returnTo
                                                    const currentPath = `/buildings/${id}/floors/${floorId}`;
                                                    const encodedReturnTo = encodeURIComponent(currentPath);
                                                    navigate(`/buildings/${id}/floors/${floorId}/doors/create?x=${x}&y=${y}&returnTo=${encodedReturnTo}`);
                                                }}
                                                enableDrag={true} // Cho phép kéo thả các cửa
                                                onCoordinateUpdate={async (coordinate, x, y) => {
                                                    try {
                                                        // Lấy doorId từ coordinate thay vì từ URL
                                                        const coordinateDoorId = coordinate.door_id.toString();
                                                        
                                                        console.log('Updating coordinate in FloorDetail:', {
                                                            id: coordinate.id,
                                                            door_id: coordinate.door_id,
                                                            x_coordinate: x,
                                                            y_coordinate: y,
                                                            rotation: coordinate.rotation,
                                                            coordinateDoorId
                                                        });

                                                        // Cập nhật cache trước khi gọi API
                                                        // 1. Cập nhật cache cho multipleDoorCoordinates
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
                                                        
                                                        // 2. Cập nhật cache cho doorCoordinates
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

                                                        // Sử dụng API_ROUTES và replaceParams để tạo URI
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
                                                        await refetchDoors();

                                                        toast.success('Cập nhật vị trí cửa thành công');
                                                    } catch (error) {
                                                        console.error('Error updating coordinate:', error);
                                                        toast.error('Không thể cập nhật vị trí cửa. Vui lòng thử lại.');
                                                        
                                                        // Nếu có lỗi, refetch để lấy lại dữ liệu chính xác
                                                        await refetchDoors();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="mt-2 text-sm text-gray-500 p-2">
                                            <p>Click vào sơ đồ tầng để thêm cửa mới tại vị trí đó.</p>
                                            <p className="mt-1">Click vào điểm đánh dấu cửa để xem chi tiết cửa đó.</p>
                                            <p className="mt-1 text-green-600 font-medium">
                                                <span
                                                    className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                                                Bạn có thể kéo thả các điểm để di chuyển vị trí của cửa.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border border-dashed rounded-lg p-8 text-center text-gray-500">
                                        No floor plan uploaded
                                    </div>
                                )}

                                {/* Door List */}
                                <div className="mt-4">
                                    <h4 className="text-base font-medium text-gray-900 mb-2">Doors on this floor</h4>
                                    {doorsData?.data?.data && doorsData.data.data.length > 0 ? (
                                        <div className="overflow-hidden border border-gray-200 rounded-md">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col"
                                                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name
                                                    </th>
                                                    <th scope="col"
                                                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type
                                                    </th>
                                                    <th scope="col"
                                                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status
                                                    </th>
                                                    <th scope="col"
                                                        className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                {doorsData.data.data.map((door) => (
                                                    <tr key={door.id} className="hover:bg-gray-50">
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{door.name}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{door.door_type_id}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                                                                <span className={cn(
                                                                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                                                    door.status === 'active' ? "bg-green-100 text-green-800" :
                                                                        door.status === 'maintenance' ? "bg-yellow-100 text-yellow-800" :
                                                                            "bg-red-100 text-red-800"
                                                                )}>
                                                                    {door.status === 'active' ? 'Active' :
                                                                        door.status === 'maintenance' ? 'Maintenance' : 'Inactive'}
                                                                </span>
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => navigate(`/buildings/${id}/floors/${floorId}/doors/${door.id}`)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div
                                            className="text-sm text-gray-500 border border-dashed rounded-lg p-4 text-center">
                                            No doors found on this floor
                                        </div>
                                    )}
                                    <div className="mt-3 flex space-x-3">
                                        <button
                                            onClick={() => navigate(`/buildings/${id}/floors/${floorId}/doors`)}
                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Manage Doors
                                        </button>
                                        <button
                                            onClick={() => {
                                                const currentPath = `/buildings/${id}/floors/${floorId}`;
                                                const encodedReturnTo = encodeURIComponent(currentPath);
                                                navigate(`/buildings/${id}/floors/${floorId}/doors/create?returnTo=${encodedReturnTo}`);
                                            }}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <PlusIcon className="-ml-0.5 mr-1 h-4 w-4 text-white"/>
                                            Add Door
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}