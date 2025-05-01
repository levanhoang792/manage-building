import {useNavigate, useParams} from 'react-router-dom';
import {ArrowLeftIcon} from '@heroicons/react/24/outline';
import {Button} from '@headlessui/react';
import {useGetBuildings} from '@/hooks/buildings/useBuildings';
import FloorForm from './components/FloorForm';
import {toast} from 'sonner';
import Spinner from '@/components/commons/Spinner';
import {FloorFormData, useGetFloorDetail, useUpdateFloor} from "@/hooks/floors";

export default function EditFloor() {
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

    // Update floor mutation
    const updateFloorMutation = useUpdateFloor(id || '', floorId || '');

    // Handle form submission
    const handleSubmit = async (data: FloorFormData) => {
        try {
            await updateFloorMutation.mutateAsync(data);
            toast.success('Floor updated successfully');
            navigate(`/buildings/${id}/floors`);
        } catch (error) {
            toast.error('Failed to update floor');
            console.error('Update error:', error);
        }
    };

    // Navigate back to floor list
    const handleBack = () => {
        navigate(`/buildings/${id}/floors`);
    };

    if (isFloorLoading || isBuildingLoading) {
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
                    Back
                </Button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Floor</h1>
                    {building && (
                        <p className="text-gray-600 mt-1">
                            Building: <span className="font-medium">{building.name}</span>
                        </p>
                    )}
                </div>

                {floorData?.data && (
                    <FloorForm
                        initialData={floorData.data}
                        onSubmit={handleSubmit}
                        isSubmitting={updateFloorMutation.isPending}
                        error={updateFloorMutation.error?.message}
                    />
                )}
            </div>
        </div>
    );
}