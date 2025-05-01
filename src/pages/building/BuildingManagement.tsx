import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {PlusIcon} from '@heroicons/react/24/outline';
import {Button} from '@headlessui/react';
import {cn} from '@/lib/utils';
import {useDeleteBuilding, useGetBuildings, useUpdateBuildingStatus} from '@/hooks/buildings/useBuildings';
import {Building, BuildingQueryParams} from '@/hooks/buildings/model';
import {ROUTES} from '@/routes/routes';
import Pagination from '@/components/commons/Pagination';
import Spinner from '@/components/commons/Spinner';
import {toast} from 'sonner';
import BuildingFilter from './components/BuildingFilter';
import BuildingList from './components/BuildingList';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';

export default function BuildingManagement() {
    const navigate = useNavigate();
    const [queryParams, setQueryParams] = useState<BuildingQueryParams>({
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc'
    });
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Fetch buildings data
    const {
        data: buildingsData,
        isLoading,
        isError,
        refetch
    } = useGetBuildings(queryParams);

    // Delete building mutation
    const deleteBuildingMutation = useDeleteBuilding();

    // Update building status mutation
    const updateBuildingStatusMutation = useUpdateBuildingStatus(
        selectedBuilding?.id.toString() || ''
    );

    // Handle page change
    const handlePageChange = (page: number) => {
        setQueryParams(prev => ({...prev, page}));
    };

    // Handle filter change
    const handleFilterChange = (filters: Partial<BuildingQueryParams>) => {
        setQueryParams(prev => ({...prev, ...filters, page: 1}));
    };

    // Navigate to create building page
    const handleCreateBuilding = () => {
        navigate(ROUTES.BUILDING_CREATE);
    };

    // Navigate to edit building page
    const handleEditBuilding = (building: Building) => {
        navigate(ROUTES.BUILDING_EDIT.replace(':id', building.id.toString()));
    };

    // Open delete confirmation dialog
    const handleDeleteClick = (building: Building) => {
        setSelectedBuilding(building);
        setIsDeleteDialogOpen(true);
    };

    // Close delete confirmation dialog
    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setSelectedBuilding(null);
    };

    // Confirm delete building
    const handleConfirmDelete = async () => {
        if (!selectedBuilding) return;

        try {
            await deleteBuildingMutation.mutateAsync(selectedBuilding.id);
            toast.success('Building deleted successfully');
            refetch();
        } catch (error) {
            console.error('Error deleting building:', error);
            toast.error('Failed to delete building');
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedBuilding(null);
        }
    };

    // Handle status change
    const handleStatusChange = async (building: Building) => {
        setSelectedBuilding(building);

        const newStatus = building.status === 'active' ? 'inactive' : 'active';

        try {
            await updateBuildingStatusMutation.mutateAsync({status: newStatus});
            toast.success(`Building ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
            refetch();
        } catch (error) {
            console.error('Error updating building status:', error);
            toast.error('Failed to update building status');
        } finally {
            setSelectedBuilding(null);
        }
    };

    // View building details
    const handleViewBuilding = (building: Building) => {
        navigate(ROUTES.BUILDING_DETAIL.replace(':id', building.id.toString()));
    };

    // Handle view floors
    const handleViewFloors = (building: Building) => {
        navigate(ROUTES.BUILDING_FLOORS.replace(':id', building.id.toString()));
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Building Management</h1>
                <Button
                    onClick={handleCreateBuilding}
                    className={cn(
                        "inline-flex items-center gap-2 rounded-md bg-gray-700 py-2 px-4 text-white",
                        "transition-all shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-600"
                    )}
                >
                    <PlusIcon className="h-5 w-5"/>
                    Add Building
                </Button>
            </div>

            {/* Filter Section */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <BuildingFilter onFilterChange={handleFilterChange}/>
            </div>

            {/* Buildings List */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner/>
                </div>
            ) : isError ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>Error loading buildings. Please try again.</p>
                </div>
            ) : (
                <>
                    <BuildingList
                        buildings={buildingsData?.data.data || []}
                        onEdit={handleEditBuilding}
                        onDelete={handleDeleteClick}
                        onStatusChange={handleStatusChange}
                        onView={handleViewBuilding}
                        onViewFloors={handleViewFloors}
                        isStatusUpdating={updateBuildingStatusMutation.isPending}
                        statusUpdatingId={selectedBuilding?.id}
                    />

                    {/* Pagination */}
                    {buildingsData && buildingsData.data.total > 0 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={buildingsData.data.page}
                                totalPage={Math.ceil(buildingsData.data.total / buildingsData.data.limit)}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}

                    {/* No buildings message */}
                    {buildingsData && buildingsData.data.data.length === 0 && (
                        <div className="bg-gray-100 p-8 rounded-lg text-center">
                            <p className="text-gray-600 mb-4">No buildings found</p>
                            <Button
                                onClick={handleCreateBuilding}
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-md bg-gray-700 py-2 px-4 text-white",
                                    "transition-all shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-600"
                                )}
                            >
                                <PlusIcon className="h-5 w-5"/>
                                Add Your First Building
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                title="Delete Building"
                message={`Are you sure you want to delete the building "${selectedBuilding?.name}"? This action cannot be undone.`}
                isDeleting={deleteBuildingMutation.isPending}
            />
        </div>
    );
}