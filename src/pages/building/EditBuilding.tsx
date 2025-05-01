import {useNavigate, useParams} from 'react-router-dom';
import {ArrowLeftIcon} from '@heroicons/react/24/outline';
import {Button} from '@headlessui/react';
import {cn} from '@/lib/utils';
import {useGetBuildingDetail, useUpdateBuilding} from '@/hooks/buildings/useBuildings';
import {BuildingFormData} from '@/hooks/buildings/model';
import {ROUTES} from '@/routes/routes';
import {toast} from 'sonner';
import BuildingForm from './components/BuildingForm';
import Spinner from '@/components/commons/Spinner';

export default function EditBuilding() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Fetch building details
    const {
        data: buildingData,
        isLoading,
        isError
    } = useGetBuildingDetail(id || '');

    // Update building mutation
    const updateBuildingMutation = useUpdateBuilding(id || '');

    // Handle form submission
    const handleSubmit = async (data: BuildingFormData) => {
        try {
            await updateBuildingMutation.mutateAsync(data);
            toast.success('Building updated successfully');
            navigate(ROUTES.BUILDINGS);
        } catch (error) {
            console.error('Error updating building:', error);
            toast.error('Failed to update building');
        }
    };

    // Navigate back to buildings list
    const handleBackToList = () => {
        navigate(ROUTES.BUILDINGS);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner/>
            </div>
        );
    }

    if (isError || !buildingData?.data) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>Error loading building details. Please try again.</p>
                </div>
                <Button
                    onClick={handleBackToList}
                    className={cn(
                        "inline-flex items-center gap-2 rounded-md bg-gray-700 py-2 px-4 text-white",
                        "transition-all shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-600"
                    )}
                >
                    <ArrowLeftIcon className="h-5 w-5"/>
                    Back to Buildings
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {/* Header with back button */}
            <div className="flex items-center mb-6">
                <Button
                    onClick={handleBackToList}
                    className={cn(
                        "inline-flex items-center gap-2 rounded-md bg-gray-200 py-2 px-3 text-gray-700 mr-4",
                        "transition-all focus:outline-none hover:bg-gray-300"
                    )}
                >
                    <ArrowLeftIcon className="h-5 w-5"/>
                    Back
                </Button>
                <h1 className="text-2xl font-bold">Edit Building</h1>
            </div>

            {/* Building Form Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <BuildingForm
                        building={buildingData.data}
                        onSubmit={handleSubmit}
                        isSubmitting={updateBuildingMutation.isPending}
                        submitButtonText="Update Building"
                    />
                </div>
            </div>
        </div>
    );
}