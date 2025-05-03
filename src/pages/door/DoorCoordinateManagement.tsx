import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    DoorCoordinate,
    DoorCoordinateFormData,
    useCreateDoorCoordinate,
    useDeleteDoorCoordinate,
    useGetDoorCoordinates,
    useUpdateDoorCoordinate
} from '@/hooks/doorCoordinates';
import {Door, useGetDoorDetail, useGetDoors} from '@/hooks/doors';
import {useGetFloorDetail} from '@/hooks/floors';
import {useGetBuildingDetail} from '@/hooks/buildings';
import {ArrowLeftIcon, PencilIcon, PlusIcon, TrashIcon} from '@heroicons/react/24/outline';
import DoorCoordinateForm from './components/DoorCoordinateForm';
import CoordinateVisualizer from './components/CoordinateVisualizer';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';
import DoorChangeConfirmationDialog from './components/DoorChangeConfirmationDialog';

const DoorCoordinateManagement: React.FC = () => {
    const {id, floorId, doorId} = useParams<{ id: string; floorId: string; doorId: string }>();
    const navigate = useNavigate();

    // Kiểm tra nếu không có id, floorId hoặc doorId, chuyển hướng về trang buildings
    useEffect(() => {
        if (!id || !floorId || !doorId) {
            navigate('/buildings');
        }
    }, [id, floorId, doorId, navigate]);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCoordinate, setSelectedCoordinate] = useState<DoorCoordinate | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [coordinateToDelete, setCoordinateToDelete] = useState<DoorCoordinate | null>(null);
    const [isDoorChangeDialogOpen, setIsDoorChangeDialogOpen] = useState(false);
    const [selectedDoor, setSelectedDoor] = useState<Door | null>(null);
    const [isDoorChanging, setIsDoorChanging] = useState(false);

    // Fetch data
    const {data: coordinatesData, isLoading: isLoadingCoordinates, refetch: refetchCoordinates} =
        useGetDoorCoordinates(id || '0', floorId || '0', doorId || '0');
    const {data: doorData, isLoading: isLoadingDoor} =
        useGetDoorDetail(id || '0', floorId || '0', doorId || '0');
    const {data: floorData, isLoading: isLoadingFloor} =
        useGetFloorDetail(id || '0', floorId || '0');
    const {data: buildingData, isLoading: isLoadingBuilding} =
        useGetBuildingDetail(id || '0');
    // Lấy danh sách tất cả các cửa trên tầng
    const {data: doorsData, isLoading: isLoadingDoors} =
        useGetDoors(id || '0', floorId || '0', {limit: 100});

    // Mutations
    const createCoordinateMutation = useCreateDoorCoordinate(id || '0', floorId || '0', doorId || '0');
    const updateCoordinateMutation = useUpdateDoorCoordinate(
        id || '0',
        floorId || '0',
        doorId || '0',
        selectedCoordinate?.id.toString() || ''
    );
    const deleteCoordinateMutation = useDeleteDoorCoordinate(id || '0', floorId || '0', doorId || '0');

    const handleCreateCoordinate = async (data: DoorCoordinateFormData) => {
        try {
            await createCoordinateMutation.mutateAsync(data);
            setIsFormOpen(false);
            refetchCoordinates();
        } catch (error) {
            console.error('Error creating coordinate:', error);
        }
    };

    const handleUpdateCoordinate = async (data: DoorCoordinateFormData) => {
        if (!selectedCoordinate) return;

        try {
            await updateCoordinateMutation.mutateAsync(data);
            setIsFormOpen(false);
            setSelectedCoordinate(null);
            refetchCoordinates();
        } catch (error) {
            console.error('Error updating coordinate:', error);
        }
    };

    const handleDeleteCoordinate = async () => {
        if (!coordinateToDelete) return;

        try {
            await deleteCoordinateMutation.mutateAsync(coordinateToDelete.id);
            setIsDeleteDialogOpen(false);
            setCoordinateToDelete(null);
            if (selectedCoordinate?.id === coordinateToDelete.id) {
                setSelectedCoordinate(null);
            }
            refetchCoordinates();
        } catch (error) {
            console.error('Error deleting coordinate:', error);
        }
    };

    const handleCoordinateSelect = (coordinate: DoorCoordinate) => {
        setSelectedCoordinate(coordinate);
        setIsFormOpen(true);
    };

    const handleCoordinateAdd = (x: number, y: number) => {
        setSelectedCoordinate(null);
        setIsFormOpen(true);
        // Thiết lập giá trị mặc định cho form
        const initialData: DoorCoordinateFormData = {
            x_coordinate: Math.round(x),
            y_coordinate: Math.round(y),
            z_coordinate: undefined,
            rotation: 0
        };
        setInitialFormData(initialData);
    };

    const [initialFormData, setInitialFormData] = useState<DoorCoordinateFormData | undefined>(undefined);

    useEffect(() => {
        if (selectedCoordinate) {
            setInitialFormData({
                x_coordinate: selectedCoordinate.x_coordinate,
                y_coordinate: selectedCoordinate.y_coordinate,
                z_coordinate: selectedCoordinate.z_coordinate,
                rotation: selectedCoordinate.rotation
            });
        } else if (!isFormOpen) {
            setInitialFormData(undefined);
        }
    }, [selectedCoordinate, isFormOpen]);

    const handleBack = () => {
        navigate(`/buildings/${id}/floors/${floorId}/doors/${doorId}`);
    };

    const handleDeleteClick = (coordinate: DoorCoordinate) => {
        setCoordinateToDelete(coordinate);
        setIsDeleteDialogOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedCoordinate(null);
    };

    // Xử lý khi người dùng bấm vào cửa khác
    const handleDoorSelect = (door: Door) => {
        if (door.id.toString() === doorId) return; // Không làm gì nếu bấm vào cửa hiện tại
        
        setSelectedDoor(door);
        setIsDoorChangeDialogOpen(true);
    };

    // Xác nhận chuyển sang cửa khác
    const handleDoorChangeConfirm = () => {
        if (!selectedDoor) return;
        
        setIsDoorChanging(true);
        // Thêm timeout ngắn để hiển thị trạng thái loading
        setTimeout(() => {
            navigate(`/buildings/${id}/floors/${floorId}/doors/${selectedDoor.id}/coordinates`);
            setIsDoorChanging(false);
            setIsDoorChangeDialogOpen(false);
        }, 500);
    };

    const isLoading = isLoadingCoordinates || isLoadingDoor || isLoadingFloor || isLoadingBuilding || isLoadingDoors;
    const coordinates = coordinatesData?.data || [];
    const floorPlanImage = floorData?.data?.floor_plan_image || '';
    const doors = doorsData?.data?.data || [];

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

            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Quản lý tọa độ cửa</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Tòa nhà: {buildingData?.data?.name} | Tầng: {floorData?.data?.name} |
                            Cửa: {doorData?.data?.name}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedCoordinate(null);
                            setIsFormOpen(true);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                        Thêm tọa độ mới
                    </button>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-base font-medium text-gray-900 mb-4">Sơ đồ tầng và vị trí cửa</h4>
                                <CoordinateVisualizer
                                    floorPlanImage={floorPlanImage}
                                    coordinates={coordinates}
                                    onCoordinateSelect={handleCoordinateSelect}
                                    onCoordinateAdd={handleCoordinateAdd}
                                    isEditable={true}
                                    selectedCoordinateId={selectedCoordinate?.id}
                                    allDoors={doors}
                                    currentDoorId={parseInt(doorId || '0')}
                                    onDoorSelect={handleDoorSelect}
                                />
                                {!floorPlanImage && (
                                    <div className="mt-2 text-sm text-red-500">
                                        Chưa có sơ đồ tầng. Vui lòng tải lên sơ đồ tầng trong phần quản lý tầng.
                                    </div>
                                )}
                            </div>

                            <div>
                                <h4 className="text-base font-medium text-gray-900 mb-4">Danh sách tọa độ</h4>
                                {coordinates.length === 0 ? (
                                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500 mb-4">Chưa có tọa độ nào.</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedCoordinate(null);
                                                setIsFormOpen(true);
                                            }}
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                                            Thêm tọa độ mới
                                        </button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col"
                                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                    Tọa độ X
                                                </th>
                                                <th scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Tọa độ Y
                                                </th>
                                                <th scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Tọa độ Z
                                                </th>
                                                <th scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Góc quay
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Thao tác</span>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                            {coordinates.map((coordinate) => (
                                                <tr
                                                    key={coordinate.id}
                                                    className={selectedCoordinate?.id === coordinate.id ? 'bg-indigo-50' : ''}
                                                >
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {coordinate.x_coordinate}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {coordinate.y_coordinate}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {coordinate.z_coordinate || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {coordinate.rotation !== undefined && coordinate.rotation !== null
                                                            ? `${coordinate.rotation}°`
                                                            : '-'}
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleCoordinateSelect(coordinate)}
                                                                className="text-yellow-600 hover:text-yellow-900"
                                                            >
                                                                <PencilIcon className="h-5 w-5" aria-hidden="true"/>
                                                                <span className="sr-only">Sửa</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(coordinate)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <TrashIcon className="h-5 w-5" aria-hidden="true"/>
                                                                <span className="sr-only">Xóa</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <DoorCoordinateForm
                initialData={initialFormData}
                onSubmit={selectedCoordinate ? handleUpdateCoordinate : handleCreateCoordinate}
                isOpen={isFormOpen}
                onClose={handleFormClose}
                isSubmitting={selectedCoordinate ? updateCoordinateMutation.isPending : createCoordinateMutation.isPending}
            />

            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteCoordinate}
                title="Xóa tọa độ"
                message="Bạn có chắc chắn muốn xóa tọa độ này không? Hành động này không thể hoàn tác."
            />

            {/* Dialog xác nhận chuyển sang cửa khác */}
            <DoorChangeConfirmationDialog
                isOpen={isDoorChangeDialogOpen}
                onClose={() => setIsDoorChangeDialogOpen(false)}
                onConfirm={handleDoorChangeConfirm}
                doorName={selectedDoor?.name || ""}
                isLoading={isDoorChanging}
            />
        </div>
    );
};

export default DoorCoordinateManagement;