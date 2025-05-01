import {useNavigate} from 'react-router-dom';
import {ArrowLeftIcon} from '@heroicons/react/24/outline';
import {Button} from '@headlessui/react';
import {cn} from '@/lib/utils';
import {useCreateBuilding} from '@/hooks/buildings/useBuildings';
import {BuildingFormData} from '@/hooks/buildings/model';
import {ROUTES} from '@/routes/routes';
import {toast} from 'sonner';
import BuildingForm from './components/BuildingForm';

export default function CreateBuilding() {
    const navigate = useNavigate();
    const createBuildingMutation = useCreateBuilding();

    // Handle form submission
    const handleSubmit = async (data: BuildingFormData) => {
        try {
            await createBuildingMutation.mutateAsync(data);
            toast.success('Building created successfully');
            navigate(ROUTES.BUILDINGS);
        } catch (error) {
            console.error('Error creating building:', error);
            toast.error('Failed to create building');
        }
    };

    // Navigate back to buildings list
    const handleBackToList = () => {
        navigate(ROUTES.BUILDINGS);
    };

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
                <h1 className="text-2xl font-bold">Create New Building</h1>
            </div>

            {/* Building Form Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <BuildingForm
                        onSubmit={handleSubmit}
                        isSubmitting={createBuildingMutation.isPending}
                        submitButtonText="Create Building"
                    />
                </div>
            </div>
        </div>
    );
}