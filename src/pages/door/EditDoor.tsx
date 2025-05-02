import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {DoorFormData, useGetDoorDetail, useUpdateDoor} from '@/hooks/doors';
import {useGetFloorDetail} from '@/hooks/floors';
import {useGetBuildingDetail} from '@/hooks/buildings';
import DoorForm from './components/DoorForm';
import {ArrowLeftIcon} from '@heroicons/react/24/outline';
import {toast} from 'sonner';

const EditDoor: React.FC = () => {
    const {id, floorId, doorId} = useParams<{ id: string; floorId: string; doorId: string }>();
    const navigate = useNavigate();

    // Kiểm tra nếu không có id, floorId hoặc doorId, chuyển hướng về trang buildings
    useEffect(() => {
        if (!id || !floorId || !doorId) {
            navigate('/buildings');
        }
    }, [id, floorId, doorId, navigate]);

    const [isFormOpen, setIsFormOpen] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    // Fetch data
    const {data: doorData, isLoading: isLoadingDoor} =
        useGetDoorDetail(id || '0', floorId || '0', doorId || '0');
    const {data: floorData, isLoading: isLoadingFloor} =
        useGetFloorDetail(id || '0', floorId || '0');
    const {data: buildingData, isLoading: isLoadingBuilding} =
        useGetBuildingDetail(id || '0');

    // Mutations
    const updateDoorMutation = useUpdateDoor(id || '0', floorId || '0', doorId || '0');

    const handleUpdateDoor = async (data: DoorFormData) => {
        try {
            setErrorMessage(undefined);
            await updateDoorMutation.mutateAsync(data);
            toast.success('Cập nhật cửa thành công');
            navigate(`/buildings/${id}/floors/${floorId}/doors/${doorId}`);
        } catch (error) {
            console.error('Error updating door:', error);
            const message = 'Không thể cập nhật cửa. Vui lòng thử lại.';
            setErrorMessage(message);
            toast.error(message);
        }
    };

    const handleBack = () => {
        navigate(`/buildings/${id}/floors/${floorId}/doors/${doorId}`);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        handleBack();
    };

    const isLoading = isLoadingDoor || isLoadingFloor || isLoadingBuilding;
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

    const initialData: DoorFormData = {
        name: door.name,
        description: door.description,
        door_type_id: door.door_type_id,
        status: door.status
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
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Chỉnh sửa cửa</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Tòa nhà: {buildingData?.data?.name} | Tầng: {floorData?.data?.name}
                    </p>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <DoorForm
                        initialData={initialData}
                        onSubmit={handleUpdateDoor}
                        isOpen={isFormOpen}
                        onClose={handleFormClose}
                        isSubmitting={updateDoorMutation.isPending}
                        error={errorMessage}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditDoor;