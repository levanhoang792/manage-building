import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {DoorFormData, useCreateDoor} from '@/hooks/doors';
import {useGetFloorDetail} from '@/hooks/floors';
import {useGetBuildingDetail} from '@/hooks/buildings';
import DoorForm from './components/DoorForm';
import {ArrowLeftIcon} from '@heroicons/react/24/outline';
import {toast} from 'sonner';

const CreateDoor: React.FC = () => {
    const {id, floorId} = useParams<{ id: string; floorId: string }>();
    const navigate = useNavigate();

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

    const handleCreateDoor = async (data: DoorFormData) => {
        try {
            setErrorMessage(undefined);
            const response = await createDoorMutation.mutateAsync(data);
            const newDoorId = response.data.id;
            toast.success('Thêm cửa mới thành công');
            navigate(`/buildings/${id}/floors/${floorId}/doors/${newDoorId}`);
        } catch (error) {
            console.error('Error creating door:', error);
            const message = 'Không thể tạo cửa mới. Vui lòng thử lại.';
            setErrorMessage(message);
            toast.error(message);
        }
    };

    const handleBack = () => {
        navigate(`/buildings/${id}/floors/${floorId}/doors`);
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