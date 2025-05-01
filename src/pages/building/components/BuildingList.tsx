import {BuildingOfficeIcon, EyeIcon, PencilIcon, TrashIcon} from '@heroicons/react/24/outline';
import {Button} from '@headlessui/react';
import {cn} from '@/lib/utils';
import {Building} from '@/hooks/buildings/model';
import Spinner from '@/components/commons/Spinner';
import {format} from 'date-fns';

interface BuildingListProps {
    buildings: Building[];
    onEdit: (building: Building) => void;
    onDelete: (building: Building) => void;
    onStatusChange: (building: Building) => void;
    onView: (building: Building) => void;
    onViewFloors: (building: Building) => void;
    isStatusUpdating: boolean;
    statusUpdatingId?: number;
}

export default function BuildingList(
    {
        buildings,
        onEdit,
        onDelete,
        onStatusChange,
        onView,
        onViewFloors,
        isStatusUpdating,
        statusUpdatingId,
    }: BuildingListProps
) {
    // Format date
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
        } catch {
            return dateString;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Building
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Address
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created At
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {buildings.map((building) => (
                        <tr key={building.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div
                                        className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                                        <BuildingOfficeIcon className="h-6 w-6 text-gray-600"/>
                                    </div>
                                    <div className="ml-4">
                                        <div
                                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                            onClick={() => onView(building)}>
                                            {building.name}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{building.address}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <span
                                className={cn(
                                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                    building.status === 'active'
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                )}
                            >
                                {building.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(building.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                    <Button
                                        onClick={() => onView(building)}
                                        className="text-blue-600 hover:text-blue-900 p-1"
                                        title="View Details"
                                    >
                                        <EyeIcon className="h-5 w-5"/>
                                    </Button>
                                    <Button
                                        onClick={() => onEdit(building)}
                                        className="text-indigo-600 hover:text-indigo-900 p-1"
                                        title="Edit Building"
                                    >
                                        <PencilIcon className="h-5 w-5"/>
                                    </Button>
                                    <Button
                                        onClick={() => onDelete(building)}
                                        className="text-red-600 hover:text-red-900 p-1"
                                        title="Delete Building"
                                    >
                                        <TrashIcon className="h-5 w-5"/>
                                    </Button>
                                    <Button
                                        onClick={() => onStatusChange(building)}
                                        disabled={isStatusUpdating && statusUpdatingId === building.id}
                                        className={cn(
                                            "px-3 py-1 rounded text-xs font-medium",
                                            building.status === 'active'
                                                ? "bg-red-100 text-red-800 hover:bg-red-200"
                                                : "bg-green-100 text-green-800 hover:bg-green-200",
                                            (isStatusUpdating && statusUpdatingId === building.id) && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {isStatusUpdating && statusUpdatingId === building.id ? (
                                            <Spinner className="h-4 w-4"/>
                                        ) : building.status === 'active' ? (
                                            'Deactivate'
                                        ) : (
                                            'Activate'
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => onViewFloors(building)}
                                        className={cn(
                                            "px-3 py-1 rounded text-xs font-medium",
                                            "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                        )}
                                    >
                                        View Floors
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}