import React, {Fragment, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {ArrowLeftIcon, LockClosedIcon, LockOpenIcon} from '@heroicons/react/24/outline';
import {useGetBuildings} from '@/hooks/buildings';
import {useGetFloors} from '@/hooks/floors';
import {Door, DoorLockStatusData, useGetDoors, useUpdateDoorLockStatus} from '@/hooks/doors';
import {ROUTES} from '@/routes/routes';
import {toast} from 'sonner';
import Spinner from '@/components/commons/Spinner';
import CoordinateVisualizer from '../door/components/CoordinateVisualizer';
import {Dialog, DialogPanel, DialogTitle, Transition, TransitionChild} from '@headlessui/react';

const DoorLockManagement: React.FC = () => {
    const navigate = useNavigate();
    const {id: buildingIdParam, floorId: floorIdParam} = useParams<{ id: string; floorId: string }>();

    const [selectedBuildingId, setSelectedBuildingId] = useState<string>(buildingIdParam || '');
    const [selectedFloorId, setSelectedFloorId] = useState<string>(floorIdParam || '');
    const [selectedDoor, setSelectedDoor] = useState<Door | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [actionType, setActionType] = useState<'open' | 'close'>('open');

    // Fetch data
    const {data: buildingsData, isLoading: isLoadingBuildings} = useGetBuildings();
    const {data: floorsData, isLoading: isLoadingFloors} = useGetFloors(selectedBuildingId || '');
    const {
        data: doorsData,
        isLoading: isLoadingDoors,
        refetch: refetchDoors
    } = useGetDoors(
        selectedBuildingId || '',
        selectedFloorId || '',
        {limit: 100}
    );

    // Get selected floor details
    const selectedFloor = floorsData?.data?.data?.find(
        (floor) => floor.id.toString() === selectedFloorId
    );

    // Mutation for updating door lock status
    const updateDoorLockStatusMutation = useUpdateDoorLockStatus(
        selectedBuildingId,
        selectedFloorId,
        selectedDoor?.id || 0
    );

    // Update URL when building or floor changes
    useEffect(() => {
        if (selectedBuildingId && selectedFloorId) {
            navigate(`/buildings/${selectedBuildingId}/floors/${selectedFloorId}/door-lock`, {replace: true});
        } else if (selectedBuildingId) {
            navigate(`/buildings/${selectedBuildingId}/door-lock`, {replace: true});
        }
    }, [selectedBuildingId, selectedFloorId, navigate]);

    // Handle building selection
    const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const buildingId = e.target.value;
        setSelectedBuildingId(buildingId);
        setSelectedFloorId('');
        setSelectedDoor(null);
    };

    // Handle floor selection
    const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const floorId = e.target.value;
        setSelectedFloorId(floorId);
        setSelectedDoor(null);
    };

    // Handle door selection from the floor plan
    const handleDoorSelect = (door: Door) => {
        setSelectedDoor(door);
        setActionType(door.lock_status === 'open' ? 'close' : 'open');
        setIsModalOpen(true);
    };

    // Handle door lock status update
    const handleUpdateDoorLockStatus = async () => {
        if (!selectedDoor) return;

        const newStatus: DoorLockStatusData = {
            lock_status: actionType === 'open' ? 'open' : 'closed',
            reason: reason
        };

        try {
            await updateDoorLockStatusMutation.mutateAsync(newStatus);
            toast.success(`Cửa đã được ${actionType === 'open' ? 'mở' : 'đóng'} thành công`);
            setIsModalOpen(false);
            setReason('');
            refetchDoors();
        } catch (error) {
            console.error('Error updating door lock status:', error);
            toast.error(`Có lỗi xảy ra khi ${actionType === 'open' ? 'mở' : 'đóng'} cửa`);
        }
    };

    // Loading state
    const isLoading = isLoadingBuildings || isLoadingFloors || isLoadingDoors;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.DASHBOARD)}
                        className="mr-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <ArrowLeftIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/>
                        Quay lại
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                        Quản lý đóng/mở cửa
                    </h1>
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="buildingId" className="block text-sm font-medium text-gray-700 mb-1">
                                Chọn tòa nhà
                            </label>
                            <select
                                id="buildingId"
                                name="buildingId"
                                value={selectedBuildingId}
                                onChange={handleBuildingChange}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                disabled={isLoading}
                            >
                                <option value="">Chọn tòa nhà</option>
                                {buildingsData?.data?.data?.map((building) => (
                                    <option key={building.id} value={building.id}>
                                        {building.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="floorId" className="block text-sm font-medium text-gray-700 mb-1">
                                Chọn tầng
                            </label>
                            <select
                                id="floorId"
                                name="floorId"
                                value={selectedFloorId}
                                onChange={handleFloorChange}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                disabled={!selectedBuildingId || isLoading}
                            >
                                <option value="">Chọn tầng</option>
                                {floorsData?.data?.data?.map((floor) => (
                                    <option key={floor.id} value={floor.id}>
                                        {floor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center items-center h-64">
                            <Spinner className="h-8 w-8 text-indigo-500"/>
                        </div>
                    )}

                    {!isLoading && selectedFloorId && selectedFloor?.floor_plan_image && (
                        <div className="mt-6">
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-inner">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Sơ đồ tầng: {selectedFloor.name}
                                </h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    Nhấp vào cửa trên sơ đồ để đóng/mở cửa. Màu xanh lá cây đại diện cho cửa đang mở,
                                    màu đỏ đại diện cho cửa đang đóng.
                                </p>
                                <div className="relative border rounded-lg overflow-hidden"
                                     style={{minHeight: '400px'}}>
                                    <CoordinateVisualizer
                                        floorPlanImage={selectedFloor.floor_plan_image}
                                        coordinates={[]}
                                        isEditable={false}
                                        allDoors={doorsData?.data?.data || []}
                                        onDoorSelect={handleDoorSelect}
                                        enableDrag={false}
                                        disableDoorNavigation={true}
                                    />
                                </div>

                                <div className="mt-4 flex items-center space-x-6">
                                    <div className="flex items-center">
                                        <span className="inline-block w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                                        <span className="text-sm text-gray-600">Cửa đang mở</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="inline-block w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                                        <span className="text-sm text-gray-600">Cửa đang đóng</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isLoading && selectedFloorId && !selectedFloor?.floor_plan_image && (
                        <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <p className="text-yellow-700">
                                Tầng này chưa có sơ đồ. Vui lòng tải lên sơ đồ tầng trước khi sử dụng tính năng này.
                            </p>
                        </div>
                    )}

                    {!isLoading && !selectedFloorId && selectedBuildingId && (
                        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-blue-700">
                                Vui lòng chọn tầng để xem sơ đồ và quản lý cửa.
                            </p>
                        </div>
                    )}

                    {!isLoading && !selectedBuildingId && (
                        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-blue-700">
                                Vui lòng chọn tòa nhà và tầng để bắt đầu.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for door lock action confirmation */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25"/>
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel
                                    className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <DialogTitle
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                                    >
                                        {actionType === 'open' ? (
                                            <LockOpenIcon className="h-5 w-5 text-green-500 mr-2"/>
                                        ) : (
                                            <LockClosedIcon className="h-5 w-5 text-red-500 mr-2"/>
                                        )}
                                        {actionType === 'open' ? 'Mở khóa cửa' : 'Đóng khóa cửa'}
                                    </DialogTitle>

                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Bạn có chắc chắn muốn {actionType === 'open' ? 'mở' : 'đóng'} khóa cửa
                                            "{selectedDoor?.name}"?
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                            Lý do (không bắt buộc)
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="reason"
                                                name="reason"
                                                rows={3}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                placeholder={`Nhập lý do ${actionType === 'open' ? 'mở' : 'đóng'} cửa...`}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="button"
                                            className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                                actionType === 'open'
                                                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                            }`}
                                            onClick={handleUpdateDoorLockStatus}
                                            disabled={updateDoorLockStatusMutation.isPending}
                                        >
                                            {updateDoorLockStatusMutation.isPending ? (
                                                <span className="flex items-center">
                                                    <Spinner className="h-4 w-4 mr-2"/>
                                                    Đang xử lý...
                                                </span>
                                            ) : (
                                                `Xác nhận ${actionType === 'open' ? 'mở' : 'đóng'} cửa`
                                            )}
                                        </button>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default DoorLockManagement;