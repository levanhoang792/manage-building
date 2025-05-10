import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {DoorFormData, useCreateDoor} from '@/hooks/doors';
import {useGetFloorDetail} from '@/hooks/floors';
import {useGetBuildingDetail} from '@/hooks/buildings';
import DoorForm from './components/DoorForm';
import {ArrowLeftIcon} from '@heroicons/react/24/outline';
import {toast} from 'sonner';
import {API_ROUTES} from '@/routes/api';
import {httpPost} from '@/utils/api';

const CreateDoor: React.FC = () => {
    const {id, floorId} = useParams<{ id: string; floorId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy tọa độ từ URL query parameters (nếu có)
    const queryParams = new URLSearchParams(location.search);
    const xCoordinate = queryParams.get('x');
    const yCoordinate = queryParams.get('y');
    const returnTo = queryParams.get('returnTo'); // Lấy tham số returnTo để biết màn hình trước đó

    // Lưu trữ tọa độ để sử dụng sau khi tạo cửa
    const [coordinates, setCoordinates] = useState<{ x: number, y: number } | null>(
        xCoordinate && yCoordinate
            ? {x: parseFloat(xCoordinate), y: parseFloat(yCoordinate)}
            : null
    );

    // Kiểm tra nếu không có id hoặc floorId, chuyển hướng về trang buildings
    useEffect(() => {
        if (!id || !floorId) {
            navigate('/buildings');
        }
    }, [id, floorId, navigate]);

    const [isFormOpen, setIsFormOpen] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    // Fetch data
    const {data: floorData, isLoading: isLoadingFloor} =
        useGetFloorDetail(id || '0', floorId || '0');
    const {data: buildingData, isLoading: isLoadingBuilding} =
        useGetBuildingDetail(id || '0');

    // Mutations
    const createDoorMutation = useCreateDoor(id || '0', floorId || '0');

    // Tạo một hàm để gọi API tạo tọa độ trực tiếp
    const createDoorCoordinate = async (buildingId: string, floorId: string, doorId: string, x: number, y: number) => {
        // Hàm helper để thay thế các tham số trong URL
        const replaceParams = (url: string, params: Record<string, string | number>) => {
            let result = url;
            Object.entries(params).forEach(([key, value]) => {
                result = result.replace(`:${key}`, String(value));
            });
            return result;
        };

        const uri = replaceParams(API_ROUTES.DOOR_COORDINATE_CREATE, {buildingId, floorId, doorId});

        try {
            const response = await httpPost({
                uri,
                options: {
                    body: JSON.stringify({
                        x_coordinate: x,
                        y_coordinate: y
                    })
                }
            });

            return await response.json();
        } catch (error) {
            console.error('Error creating door coordinate:', error);
            throw error;
        }
    };

    const handleCreateDoor = async (data: DoorFormData) => {
        try {
            setErrorMessage(undefined);

            // Tạo cửa mới
            const response = await createDoorMutation.mutateAsync(data);
            const newDoorId = response.data.id;

            // Nếu có tọa độ từ URL, tự động tạo tọa độ cho cửa
            if (coordinates) {
                try {
                    // Tạo tọa độ mới
                    await createDoorCoordinate(
                        id || '0',
                        floorId || '0',
                        newDoorId.toString(),
                        coordinates.x,
                        coordinates.y
                    );

                    toast.success('Thêm cửa mới và tọa độ thành công');
                } catch (coordError) {
                    console.error('Error creating door coordinate:', coordError);
                    toast.error('Đã tạo cửa mới nhưng không thể tạo tọa độ. Vui lòng thêm tọa độ thủ công.');
                }
            } else {
                toast.success('Thêm cửa mới thành công');
            }

            // Nếu có tham số returnTo, quay về màn hình đó
            if (returnTo) {
                // Giải mã URL đã được mã hóa
                const decodedReturnTo = decodeURIComponent(returnTo);
                navigate(decodedReturnTo);
            } else {
                // Mặc định chuyển đến trang chi tiết cửa
                navigate(`/buildings/${id}/floors/${floorId}/doors/${newDoorId}`);
            }
        } catch (error) {
            console.error('Error creating door:', error);
            const message = 'Không thể tạo cửa mới. Vui lòng thử lại.';
            setErrorMessage(message);
            toast.error(message);
        }
    };

    const handleBack = () => {
        // Nếu có tham số returnTo, quay về màn hình đó
        if (returnTo) {
            const decodedReturnTo = decodeURIComponent(returnTo);
            navigate(decodedReturnTo);
        } else {
            // Mặc định quay về trang danh sách cửa
            navigate(`/buildings/${id}/floors/${floorId}/doors`);
        }
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        handleBack();
    };

    const isLoading = isLoadingFloor || isLoadingBuilding;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

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
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Thêm cửa mới</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Tòa nhà: {buildingData?.data?.name} | Tầng: {floorData?.data?.name}
                    </p>
                    {coordinates && (
                        <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md">
                            <p>Bạn đang tạo cửa mới tại tọa độ: X: {coordinates.x.toFixed(2)},
                                Y: {coordinates.y.toFixed(2)}</p>
                            <p className="text-sm mt-1">Sau khi tạo cửa, bạn sẽ được chuyển đến trang quản lý tọa độ để
                                xác nhận vị trí.</p>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <DoorForm
                        onSubmit={handleCreateDoor}
                        isOpen={isFormOpen}
                        onClose={handleFormClose}
                        isSubmitting={createDoorMutation.isPending}
                        error={errorMessage}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateDoor;