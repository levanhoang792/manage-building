import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDeleteDoorType, useDoorTypes} from '@/hooks/doorTypes';
import {DoorType} from '@/hooks/doorTypes/model';
import {DoorTypeForm, DoorTypeList} from './components';
import {PlusIcon} from '@heroicons/react/20/solid';

const DoorTypeManagement: React.FC = () => {
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedDoorType, setSelectedDoorType] = useState<DoorType | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch door types
    const {data: doorTypesData, isLoading, isError, refetch} = useDoorTypes();
    const {mutate: deleteDoorType, isPending: isDeleting} = useDeleteDoorType();

    // Handle create door type
    const handleCreateClick = () => {
        setSelectedDoorType(null);
        setIsCreateModalOpen(true);
    };

    // Handle edit door type
    const handleEditClick = (doorType: DoorType) => {
        setSelectedDoorType(doorType);
        setIsEditModalOpen(true);
    };

    // Handle view door type
    const handleViewClick = (doorType: DoorType) => {
        setSelectedDoorType(doorType);
        setIsViewModalOpen(true);
    };

    // Handle delete door type
    const handleDeleteClick = (id: number) => {
        deleteDoorType(id, {
            onSuccess: () => {
                refetch();
            },
            onError: (error) => {
                setError(error.message || 'Failed to delete door type');
            }
        });
    };

    // Close all modals
    const closeAllModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsViewModalOpen(false);
        setSelectedDoorType(null);
        setError(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Door Types Management</h1>
                <button
                    type="button"
                    onClick={handleCreateClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                    Add Door Type
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            <DoorTypeList
                doorTypes={doorTypesData?.data?.doorTypes || []}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onView={handleViewClick}
                isLoading={isLoading || isDeleting}
            />

            {/* Create Modal */}
            {isCreateModalOpen && (
                <DoorTypeForm
                    isOpen={isCreateModalOpen}
                    onClose={closeAllModals}
                    isSubmitting={false}
                    mode="create"
                />
            )}

            {/* Edit Modal */}
            {isEditModalOpen && selectedDoorType && (
                <DoorTypeForm
                    isOpen={isEditModalOpen}
                    onClose={closeAllModals}
                    initialData={selectedDoorType}
                    isSubmitting={false}
                    mode="edit"
                />
            )}

            {/* View Modal */}
            {isViewModalOpen && selectedDoorType && (
                <DoorTypeForm
                    isOpen={isViewModalOpen}
                    onClose={closeAllModals}
                    initialData={selectedDoorType}
                    isSubmitting={false}
                    mode="view"
                />
            )}
        </div>
    );
};

export default DoorTypeManagement;