import React, {useState} from 'react';
import {DoorType} from '@/hooks/doorTypes/model';
import {EyeIcon, PencilIcon, TrashIcon} from '@heroicons/react/24/outline';
import {PlusIcon} from "@heroicons/react/20/solid";
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

interface DoorTypeListProps {
    doorTypes: DoorType[];
    onEdit: (doorType: DoorType) => void;
    onDelete: (id: number) => void;
    onView: (doorType: DoorType) => void;
    isLoading: boolean;
}

const DoorTypeList: React.FC<DoorTypeListProps> = ({
                                                       doorTypes,
                                                       onEdit,
                                                       onDelete,
                                                       onView,
                                                       isLoading
                                                   }) => {
    const [doorTypeToDelete, setDoorTypeToDelete] = useState<DoorType | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDeleteClick = (doorType: DoorType) => {
        setDoorTypeToDelete(doorType);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (doorTypeToDelete) {
            onDelete(doorTypeToDelete.id);
            setIsDeleteDialogOpen(false);
            setDoorTypeToDelete(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (doorTypes.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500 mb-4">No door types found.</p>
                <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('doorType:create'))}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                    Add Door Type
                </button>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Description
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Created At
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {doorTypes.map((doorType) => (
                    <tr key={doorType.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {doorType.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {doorType.name}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {doorType.description || '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(doorType.created_at || '').toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => onView(doorType)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    <EyeIcon className="h-5 w-5" aria-hidden="true"/>
                                    <span className="sr-only">View</span>
                                </button>
                                <button
                                    onClick={() => onEdit(doorType)}
                                    className="text-yellow-600 hover:text-yellow-900"
                                >
                                    <PencilIcon className="h-5 w-5" aria-hidden="true"/>
                                    <span className="sr-only">Edit</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(doorType)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <TrashIcon className="h-5 w-5" aria-hidden="true"/>
                                    <span className="sr-only">Delete</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Door Type"
                message={`Are you sure you want to delete the door type "${doorTypeToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default DoorTypeList;