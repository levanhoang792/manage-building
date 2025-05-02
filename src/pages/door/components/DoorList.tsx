import React, {useState} from 'react';
import {Door} from '@/hooks/doors';
import {EyeIcon, PencilIcon, TrashIcon} from '@heroicons/react/24/outline';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import {PlusIcon} from "@heroicons/react/20/solid";
import {useDoorTypes} from '@/hooks/doorTypes';

interface DoorListProps {
    doors: Door[];
    onEdit: (door: Door) => void;
    onDelete: (id: number) => void;
    onView: (door: Door) => void;
    isLoading: boolean;
}

const DoorList: React.FC<DoorListProps> = ({
                                               doors,
                                               onEdit,
                                               onDelete,
                                               onView,
                                               isLoading
                                           }) => {
    const [doorToDelete, setDoorToDelete] = useState<Door | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const {data: doorTypesData, isLoading: isLoadingDoorTypes} = useDoorTypes();

    const handleDeleteClick = (door: Door) => {
        setDoorToDelete(door);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (doorToDelete) {
            onDelete(doorToDelete.id);
            setIsDeleteDialogOpen(false);
            setDoorToDelete(null);
        }
    };

    const getDoorTypeLabel = (doorTypeId: number) => {
        // Fallback door types in case API fails or is loading
        const fallbackDoorTypes = [
            {id: 1, name: 'Cửa thông thường'},
            {id: 2, name: 'Cửa thoát hiểm'},
            {id: 3, name: 'Cửa hạn chế'},
            {id: 4, name: 'Thang máy'},
            {id: 5, name: 'Cầu thang'}
        ];

        // Use door types from API if available
        if (doorTypesData?.data?.doorTypes) {
            const doorType = doorTypesData.data.doorTypes.find(type => type.id === doorTypeId);
            if (doorType) {
                return `${doorType.name} - ${doorType.description}`;
            }
        }

        // Fallback if API data is not available
        const fallbackDoorType = fallbackDoorTypes.find(type => type.id === doorTypeId);
        return fallbackDoorType ? fallbackDoorType.name : 'Khác';
    };

    const getDoorStatusLabel = (status: string) => {
        switch (status) {
            case 'active':
                return <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Hoạt động</span>;
            case 'inactive':
                return <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Không hoạt động</span>;
            case 'maintenance':
                return <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Bảo trì</span>;
            default:
                return <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Không xác định</span>;
        }
    };

    if (isLoading || isLoadingDoorTypes) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (doors.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500 mb-4">Không có cửa nào.</p>
                <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('door:create'))}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                    Thêm cửa mới
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
                        Tên cửa
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Loại cửa
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Trạng thái
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Mô tả
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Thao tác</span>
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {doors.map((door) => (
                    <tr key={door.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {door.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {getDoorTypeLabel(door.door_type_id)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {getDoorStatusLabel(door.status)}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {door.description || '-'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => onView(door)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    <EyeIcon className="h-5 w-5" aria-hidden="true"/>
                                    <span className="sr-only">Xem</span>
                                </button>
                                <button
                                    onClick={() => onEdit(door)}
                                    className="text-yellow-600 hover:text-yellow-900"
                                >
                                    <PencilIcon className="h-5 w-5" aria-hidden="true"/>
                                    <span className="sr-only">Sửa</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(door)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <TrashIcon className="h-5 w-5" aria-hidden="true"/>
                                    <span className="sr-only">Xóa</span>
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
                title="Xóa cửa"
                message={`Bạn có chắc chắn muốn xóa cửa "${doorToDelete?.name}" không? Hành động này không thể hoàn tác.`}
            />
        </div>
    );
};

export default DoorList;