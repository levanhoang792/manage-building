import {BuildingOfficeIcon, EyeIcon, PencilIcon, TrashIcon} from '@heroicons/react/24/outline';
import {Button} from '@headlessui/react';
import {cn} from '@/lib/utils';
import {Floor} from '@/hooks/floors/model';
import Spinner from '@/components/commons/Spinner';
import {format} from 'date-fns';

interface FloorListProps {
    floors: Floor[];
    onEdit: (floor: Floor) => void;
    onDelete: (floor: Floor) => void;
    onStatusChange: (floor: Floor) => void;
    onView: (floor: Floor) => void;
    onViewDoors: (floor: Floor) => void;
    onUploadPlan: (floor: Floor) => void;
    isStatusUpdating: boolean;
    statusUpdatingId?: number;
}

export default function FloorList(
    {
        floors,
        onEdit,
        onDelete,
        onStatusChange,
        onView,
        onViewDoors,
        onUploadPlan,
        isStatusUpdating,
        statusUpdatingId,
    }: FloorListProps
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
                            Floor
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Floor Number
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
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
                    {floors.map((floor) => (
                        <tr key={floor.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div
                                        className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                                        <BuildingOfficeIcon className="h-6 w-6 text-gray-600"/>
                                    </div>
                                    <div className="ml-4">
                                        <div
                                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                            onClick={() => onView(floor)}>
                                            {floor.name}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 font-medium">{floor.floor_number}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{floor.description || '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
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
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(floor.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                    <Button
                                        onClick={() => onView(floor)}
                                        className="text-blue-600 hover:text-blue-900 p-1"
                                        title="View Details"
                                    >
                                        <EyeIcon className="h-5 w-5"/>
                                    </Button>
                                    <Button
                                        onClick={() => onEdit(floor)}
                                        className="text-indigo-600 hover:text-indigo-900 p-1"
                                        title="Edit Floor"
                                    >
                                        <PencilIcon className="h-5 w-5"/>
                                    </Button>
                                    <Button
                                        onClick={() => onDelete(floor)}
                                        className="text-red-600 hover:text-red-900 p-1"
                                        title="Delete Floor"
                                    >
                                        <TrashIcon className="h-5 w-5"/>
                                    </Button>
                                    <Button
                                        onClick={() => onStatusChange(floor)}
                                        disabled={isStatusUpdating && statusUpdatingId === floor.id}
                                        className={cn(
                                            "px-3 py-1 rounded text-xs font-medium",
                                            floor.status === 'active'
                                                ? "bg-red-100 text-red-800 hover:bg-red-200"
                                                : "bg-green-100 text-green-800 hover:bg-green-200",
                                            (isStatusUpdating && statusUpdatingId === floor.id) && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {isStatusUpdating && statusUpdatingId === floor.id ? (
                                            <Spinner className="h-4 w-4"/>
                                        ) : floor.status === 'active' ? (
                                            'Deactivate'
                                        ) : (
                                            'Activate'
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => onViewDoors(floor)}
                                        className={cn(
                                            "px-3 py-1 rounded text-xs font-medium",
                                            "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                        )}
                                    >
                                        View Doors
                                    </Button>
                                    <Button
                                        onClick={() => onUploadPlan(floor)}
                                        className={cn(
                                            "px-3 py-1 rounded text-xs font-medium",
                                            "bg-purple-100 text-purple-800 hover:bg-purple-200"
                                        )}
                                    >
                                        {floor.floor_plan_image ? 'Update Plan' : 'Upload Plan'}
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