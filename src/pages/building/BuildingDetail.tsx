import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    ArrowLeftIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    MapPinIcon,
    PencilIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import {Button} from '@headlessui/react';
import {cn} from '@/lib/utils';
import {useGetBuildingDetail, useUpdateBuildingStatus} from '@/hooks/buildings/useBuildings';
import {ROUTES} from '@/routes/routes';
import Spinner from '@/components/commons/Spinner';
import {toast} from 'sonner';
import {format} from 'date-fns';

export default function BuildingDetail() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    // Fetch building details
    const {
        data: buildingData,
        isLoading,
        isError,
        refetch
    } = useGetBuildingDetail(id || '');

    // Update building status mutation
    const updateBuildingStatusMutation = useUpdateBuildingStatus(id || '');

    // Handle status change
    const handleStatusChange = async () => {
        if (!buildingData?.data) return;

        setIsUpdatingStatus(true);
        const newStatus = buildingData.data.status === 'active' ? 'inactive' : 'active';

        try {
            await updateBuildingStatusMutation.mutateAsync({status: newStatus});
            toast.success(`Building ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
            refetch();
        } catch (error) {
            console.error('Error updating building status:', error);
            toast.error('Failed to update building status');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    // Navigate to edit building page
    const handleEditBuilding = () => {
        navigate(ROUTES.BUILDING_EDIT.replace(':id', id || ''));
    };

    // Navigate to floors page
    const handleViewFloors = () => {
        navigate(ROUTES.BUILDING_FLOORS.replace(':id', id || ''));
    };

    // Navigate back to buildings list
    const handleBackToList = () => {
        navigate(ROUTES.BUILDINGS);
    };

    // Format date
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
        } catch {
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner isLoading={true}/>
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

    const building = buildingData.data;

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
                <h1 className="text-2xl font-bold">Building Details</h1>
            </div>

            {/* Building Details Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header with status badge */}
                <div className="bg-gray-50 p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center">
                            <BuildingOfficeIcon className="h-10 w-10 text-gray-700 mr-4"/>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{building.name}</h2>
                                <div className="flex items-center mt-1">
                                    <MapPinIcon className="h-4 w-4 text-gray-500 mr-1"/>
                                    <p className="text-gray-600">{building.address}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
              <span
                  className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium mr-4",
                      building.status === 'active'
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                  )}
              >
                {building.status === 'active' ? 'Active' : 'Inactive'}
              </span>
                            <div className="flex space-x-2">
                                <Button
                                    onClick={handleEditBuilding}
                                    className={cn(
                                        "inline-flex items-center gap-2 rounded-md bg-gray-700 py-2 px-4 text-white",
                                        "transition-all shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-600"
                                    )}
                                >
                                    <PencilIcon className="h-5 w-5"/>
                                    Edit
                                </Button>
                                <Button
                                    onClick={handleStatusChange}
                                    disabled={isUpdatingStatus}
                                    className={cn(
                                        "inline-flex items-center gap-2 rounded-md py-2 px-4 text-white",
                                        "transition-all shadow-inner shadow-white/10 focus:outline-none",
                                        building.status === 'active'
                                            ? "bg-red-600 hover:bg-red-700"
                                            : "bg-green-600 hover:bg-green-700"
                                    )}
                                >
                                    {isUpdatingStatus ? (
                                        <Spinner className="h-5 w-5"/>
                                    ) : building.status === 'active' ? (
                                        <XCircleIcon className="h-5 w-5"/>
                                    ) : (
                                        <CheckCircleIcon className="h-5 w-5"/>
                                    )}
                                    {building.status === 'active' ? 'Deactivate' : 'Activate'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Building details */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Building Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium">{building.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-medium">{building.address}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Description</p>
                                    <p className="font-medium">{building.description || 'No description provided'}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <div className="flex items-center">
                    <span
                        className={cn(
                            "inline-block w-3 h-3 rounded-full mr-2",
                            building.status === 'active' ? "bg-green-500" : "bg-red-500"
                        )}
                    ></span>
                                        <p className="font-medium capitalize">{building.status}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Created At</p>
                                    <div className="flex items-center">
                                        <CalendarIcon className="h-4 w-4 text-gray-500 mr-1"/>
                                        <p className="font-medium">{formatDate(building.created_at)}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Last Updated</p>
                                    <div className="flex items-center">
                                        <ClockIcon className="h-4 w-4 text-gray-500 mr-1"/>
                                        <p className="font-medium">{formatDate(building.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* View Floors Button */}
                    <div className="mt-8">
                        <Button
                            onClick={handleViewFloors}
                            className={cn(
                                "inline-flex items-center gap-2 rounded-md bg-blue-600 py-2 px-4 text-white",
                                "transition-all shadow-inner shadow-white/10 focus:outline-none hover:bg-blue-700"
                            )}
                        >
                            View Floors
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}