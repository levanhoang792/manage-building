import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {PlusIcon} from '@heroicons/react/24/outline';
import {Button} from '@headlessui/react';
import {
    Floor,
    FloorQueryParams,
    useDeleteFloor,
    useGetFloors,
    useUpdateFloorStatus,
    useUploadFloorPlan
} from '@/hooks/floors';
import {useGetBuildings} from "@/hooks/buildings";
import FloorList from './components/FloorList';
import FloorFilter from './components/FloorFilter';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';
import FloorPlanUploader from './components/FloorPlanUploader';
import Pagination from '@/components/commons/Pagination';
import Spinner from '@/components/commons/Spinner';
import {toast} from 'sonner';

export default function FloorManagement() {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();

    const [queryParams, setQueryParams] = useState<FloorQueryParams>({
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc',
    });

    // State for delete confirmation dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [floorToDelete, setFloorToDelete] = useState<Floor | undefined>(undefined);

    // State for floor plan uploader dialog
    const [isUploaderOpen, setIsUploaderOpen] = useState(false);
    const [floorToUpload, setFloorToUpload] = useState<Floor | undefined>(undefined);

    // State for status updating
    const [statusUpdatingId, setStatusUpdatingId] = useState<number | undefined>(undefined);

    // Fetch building details to show building name
    const {data: buildingData, isLoading: isBuildingLoading} = useGetBuildings();
    const building = buildingData?.data.data.find(b => b.id === Number(id));

    // Fetch floors
    const {
        data: floorsData,
        isLoading: isFloorsLoading,
        refetch: refetchFloors
    } = useGetFloors(id || '', queryParams);

    // Mutations
    const deleteFloorMutation = useDeleteFloor(id || '');
    // Không cần khởi tạo với ID tầng cụ thể vì sẽ được cập nhật khi gọi
    const updateFloorStatusMutation = useUpdateFloorStatus(id || '');
    const uploadFloorPlanMutation = useUploadFloorPlan(id || '');

    // Handle filter changes
    const handleFilterChange = (filters: FloorQueryParams) => {
        setQueryParams({...queryParams, ...filters, page: 1});
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        setQueryParams({...queryParams, page});
    };

    // Navigate to create floor page
    const handleCreateFloor = () => {
        navigate(`/buildings/${id}/floors/create`);
    };

    // Navigate to edit floor page
    const handleEditFloor = (floor: Floor) => {
        navigate(`/buildings/${id}/floors/edit/${floor.id}`);
    };

    // Open delete confirmation dialog
    const handleDeleteClick = (floor: Floor) => {
        setFloorToDelete(floor);
        setIsDeleteDialogOpen(true);
    };

    // Confirm floor deletion
    const handleDeleteConfirm = async () => {
        if (!floorToDelete) return;

        try {
            await deleteFloorMutation.mutateAsync(floorToDelete.id);
            toast.success('Floor deleted successfully');
            setIsDeleteDialogOpen(false);
            refetchFloors();
        } catch (error) {
            toast.error('Failed to delete floor');
            console.error('Delete error:', error);
        }
    };

    // Handle status change
    const handleStatusChange = async (floor: Floor) => {
        setStatusUpdatingId(floor.id);

        try {
            await updateFloorStatusMutation.mutateAsync({
                floorId: floor.id,
                status: floor.status === 'active' ? 'inactive' : 'active'
            });
            toast.success(`Floor ${floor.status === 'active' ? 'deactivated' : 'activated'} successfully`);
            refetchFloors();
        } catch (error) {
            toast.error('Failed to update floor status');
            console.error('Status update error:', error);
        } finally {
            setStatusUpdatingId(undefined);
        }
    };

    // Open floor plan uploader
    const handleUploadPlanClick = (floor: Floor) => {
        setFloorToUpload(floor);
        setIsUploaderOpen(true);
    };

    // Handle floor plan upload
    const handleUploadPlan = async (file: File) => {
        if (!floorToUpload) return;

        try {
            await uploadFloorPlanMutation.mutateAsync({
                floorId: floorToUpload.id,
                file
            });
            toast.success('Floor plan uploaded successfully');
            setIsUploaderOpen(false);
            refetchFloors();
        } catch (error) {
            toast.error('Failed to upload floor plan');
            console.error('Upload error:', error);
        }
    };

    // Navigate to view floor details
    const handleViewFloor = (floor: Floor) => {
        navigate(`/buildings/${id}/floors/${floor.id}`);
    };

    // Navigate to view doors for this floor
    const handleViewDoors = (floor: Floor) => {
        navigate(`/buildings/${id}/floors/${floor.id}/doors`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Floor Management</h1>
                    {building && (
                        <p className="text-gray-600 mt-1">
                            Building: <span className="font-medium">{building.name}</span>
                        </p>
                    )}
                </div>
                <Button
                    onClick={handleCreateFloor}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                    Add Floor
                </Button>
            </div>

            <FloorFilter onFilter={handleFilterChange} initialFilters={queryParams}/>

            {isFloorsLoading || isBuildingLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner className="h-8 w-8 text-indigo-500"/>
                </div>
            ) : floorsData?.data.data.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-500">No floors found. Create your first floor!</p>
                </div>
            ) : (
                <>
                    <FloorList
                        floors={floorsData?.data.data || []}
                        onEdit={handleEditFloor}
                        onDelete={handleDeleteClick}
                        onStatusChange={handleStatusChange}
                        onView={handleViewFloor}
                        onViewDoors={handleViewDoors}
                        onUploadPlan={handleUploadPlanClick}
                        isStatusUpdating={!!statusUpdatingId}
                        statusUpdatingId={statusUpdatingId}
                    />

                    {floorsData && floorsData.data.total > queryParams.limit! && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={queryParams.page || 1}
                                totalPage={Math.ceil(floorsData.data.total / queryParams.limit!)}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                floor={floorToDelete}
                isOpen={isDeleteDialogOpen}
                isDeleting={deleteFloorMutation.isPending}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
            />

            {/* Floor Plan Uploader Dialog */}
            <FloorPlanUploader
                floor={floorToUpload}
                isOpen={isUploaderOpen}
                isUploading={uploadFloorPlanMutation.isPending}
                onClose={() => setIsUploaderOpen(false)}
                onUpload={handleUploadPlan}
                error={uploadFloorPlanMutation.error?.message}
            />
        </div>
    );
}