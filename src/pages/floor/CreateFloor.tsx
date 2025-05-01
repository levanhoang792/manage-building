import {useNavigate, useParams} from 'react-router-dom';
import {ArrowLeftIcon} from '@heroicons/react/24/outline';
import {Button} from '@headlessui/react';
import {FloorFormData, useCreateFloor} from '@/hooks/floors';
import {useGetBuildings} from '@/hooks/buildings/useBuildings';
import FloorForm from './components/FloorForm';
import {toast} from 'sonner';
import Spinner from '@/components/commons/Spinner';

export default function CreateFloor() {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();

    // Fetch building details to show building name
    const {data: buildingData, isLoading: isBuildingLoading} = useGetBuildings();
    const building = buildingData?.data.data.find(b => b.id === Number(id));

    // Create floor mutation
    const createFloorMutation = useCreateFloor(id || '');

    // Handle form submission
    const handleSubmit = async (data: FloorFormData) => {
        try {
            await createFloorMutation.mutateAsync(data);
            toast.success('Floor created successfully');
            navigate(`/buildings/${id}/floors`);
        } catch (error) {
            toast.error('Failed to create floor');
            console.error('Create error:', error);
        }
    };

    // Navigate back to floor list
    const handleBack = () => {
        navigate(`/buildings/${id}/floors`);
    };

    if (isBuildingLoading) {
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
                    <h1 className="text-2xl font-bold text-gray-900">Create New Floor</h1>
                    {building && (
                        <p className="text-gray-600 mt-1">
                            Building: <span className="font-medium">{building.name}</span>
                        </p>
                    )}
                </div>

                <FloorForm
                    onSubmit={handleSubmit}
                    isSubmitting={createFloorMutation.isPending}
                    error={createFloorMutation.error?.message}
                />
            </div>
        </div>
    );
}