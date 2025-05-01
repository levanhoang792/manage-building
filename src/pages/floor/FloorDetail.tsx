import {useNavigate, useParams} from 'react-router-dom';
import {ArrowLeftIcon, PencilIcon} from '@heroicons/react/24/outline';
import {Button} from '@headlessui/react';
import {useGetFloorDetail} from '@/hooks/floors';
import Spinner from '@/components/commons/Spinner';
import {format} from 'date-fns';
import {cn} from '@/lib/utils';
import {useGetBuildings} from "@/hooks/buildings";

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
                                        <img
                                            src={floor.floor_plan_image}
                                            alt={`Floor plan for ${floor.name}`}
                                            className="w-full h-auto object-contain max-h-80"
                                        />
                                    </div>
                                ) : (
                                    <div className="border border-dashed rounded-lg p-8 text-center text-gray-500">
                                        No floor plan uploaded
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}