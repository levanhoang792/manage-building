import React, {Fragment, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {ArrowLeftIcon, DocumentTextIcon} from '@heroicons/react/24/outline';
import {useGetBuildings} from '@/hooks/buildings';
import {useGetFloors} from '@/hooks/floors';
import {useGetDoors} from '@/hooks/doors';
import {Door} from '@/hooks/doors/model';
import {ROUTES} from '@/routes/routes';
import {toast} from 'sonner';
import Spinner from '@/components/commons/Spinner';
import CoordinateVisualizer from '../door/components/CoordinateVisualizer';
import {Dialog, DialogPanel, DialogTitle, Transition, TransitionChild} from '@headlessui/react';
import {useCreateDoorRequest} from "@/hooks/doorRequests/useDoorRequests";
import {DoorRequestFormData} from "@/hooks/doorRequests/model";

const CreateDoorLockRequest: React.FC = () => {
    const navigate = useNavigate();
    const {id: buildingIdParam, floorId: floorIdParam} = useParams<{ id: string; floorId: string }>();

    const [selectedBuildingId, setSelectedBuildingId] = useState<string>(buildingIdParam || '');
    const [selectedFloorId, setSelectedFloorId] = useState<string>(floorIdParam || '');
    const [selectedDoor, setSelectedDoor] = useState<Door | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        requesterName: '',
        requesterEmail: '',
        requesterPhone: '',
        purpose: ''
    });

    // Fetch data
    const {data: buildingsData, isLoading: isLoadingBuildings} = useGetBuildings();
    const {data: floorsData, isLoading: isLoadingFloors} = useGetFloors(
        selectedBuildingId ? selectedBuildingId : '',
        {limit: 100}
    );

    // Log trước khi gọi useGetDoors
    console.log('Before useGetDoors - selectedBuildingId:', selectedBuildingId);
    console.log('Before useGetDoors - selectedFloorId:', selectedFloorId);

    const {
        data: doorsData,
        isLoading: isLoadingDoors
    } = useGetDoors(
        selectedBuildingId ? selectedBuildingId : '',
        selectedFloorId ? selectedFloorId : '',
        {limit: 100}
    );

    // Log sau khi gọi useGetDoors
    console.log('After useGetDoors - doorsData:', doorsData?.data?.data?.length || 0);

    // Log doors data for debugging
    useEffect(() => {
        if (doorsData) {
            console.log('Doors data loaded:', doorsData);
            console.log('Number of doors:', doorsData?.data?.data?.length || 0);

            // Check if doors have lock_status
            const doorsWithStatus = doorsData?.data?.data?.filter(door => door.lock_status);
            console.log('Doors with lock_status:', doorsWithStatus?.length || 0);
            if (doorsWithStatus && doorsWithStatus.length > 0) {
                console.log('Sample door with status:', doorsWithStatus[0]);
            }
        }
    }, [doorsData]);

    // Get selected floor details
    const selectedFloor = floorsData?.data?.data?.find(
        (floor) => floor.id.toString() === selectedFloorId
    );

    // Log để debug
    console.log('CreateDoorLockRequest - selectedBuildingId:', selectedBuildingId);
    console.log('CreateDoorLockRequest - selectedFloorId:', selectedFloorId);
    console.log('CreateDoorLockRequest - selectedFloor:', selectedFloor);

    // Mutation for creating door request
    const createDoorRequestMutation = useCreateDoorRequest();

    // Update URL when building or floor changes
    useEffect(() => {
        if (selectedBuildingId && selectedFloorId) {
            navigate(`/buildings/${selectedBuildingId}/floors/${selectedFloorId}/door-request`, {replace: true});
        } else if (selectedBuildingId) {
            navigate(`/buildings/${selectedBuildingId}/door-request`, {replace: true});
        }
    }, [selectedBuildingId, selectedFloorId, navigate]);

    // Handle building selection
    const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const buildingId = e.target.value;
        console.log('handleBuildingChange - buildingId:', buildingId);
        setSelectedBuildingId(buildingId);
        setSelectedFloorId('');
        setSelectedDoor(null);
    };

    // Handle floor selection
    const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const floorId = e.target.value;
        console.log('handleFloorChange - floorId:', floorId);
        setSelectedFloorId(floorId);
        setSelectedDoor(null);
    };

    // Handle door selection from the floor plan
    const handleDoorSelect = (door: Door) => {
        console.log('handleDoorSelect called with door:', door); // Thêm log để debug

        try {
            // Kiểm tra xem door có tồn tại không
            if (!door || !door.id) {
                console.error('Invalid door object:', door);
                toast.error('Không thể chọn cửa. Dữ liệu cửa không hợp lệ.');
                return;
            }

            console.log('Setting selected door:', door, 'door.id type:', typeof door.id);
            setSelectedDoor(door);

            // Không cần xác định loại yêu cầu nữa vì đã loại bỏ trường requestType

            // Hiển thị thông báo về trạng thái hiện tại của cửa
            if (door.lock_status) {
                toast.info(`Cửa "${door.name}" hiện đang ${door.lock_status === 'open' ? 'mở' : 'đóng'}`);
            } else {
                toast.info(`Cửa "${door.name}" chưa có trạng thái`);
            }

            console.log('Opening modal...');
            setIsModalOpen(true);
            console.log('Modal state set to:', true);
        } catch (error) {
            console.error('Error in handleDoorSelect:', error);
            toast.error('Có lỗi xảy ra khi chọn cửa. Vui lòng thử lại.');
        }
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDoor) {
            toast.error('Vui lòng chọn cửa từ sơ đồ tầng');
            return;
        }

        try {

            // Đảm bảo door_id là số
            const doorId = selectedDoor.id;

            console.log('Submitting door request with door_id:', doorId, 'type:', typeof doorId);

            const requestData: DoorRequestFormData = {
                door_id: doorId,
                requester_name: formData.requesterName,
                requester_email: formData.requesterEmail || undefined,
                requester_phone: formData.requesterPhone || undefined,
                purpose: formData.purpose
            };

            await createDoorRequestMutation.mutateAsync(requestData);
            toast.success('Yêu cầu đóng/mở cửa đã được gửi thành công');
            setIsModalOpen(false);

            // Reset form
            setFormData({
                requesterName: '',
                requesterEmail: '',
                requesterPhone: '',
                purpose: ''
            });

            // Navigate to door requests list
            navigate(ROUTES.DOOR_REQUESTS);
        } catch (error) {
            console.error('Error creating door request:', error);
            toast.error('Có lỗi xảy ra khi gửi yêu cầu');
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
                        Gửi yêu cầu đóng/mở cửa
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
                                    Nhấp vào cửa trên sơ đồ để gửi yêu cầu đóng/mở cửa. Màu xanh lá cây đại diện cho cửa
                                    đang mở, màu đỏ đại diện cho cửa đang đóng.
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
                                        disableDoorNavigation={false} // Sửa thành false để cho phép click vào cửa
                                        buildingId={selectedBuildingId}
                                        floorId={selectedFloorId}
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
                                Tầng này chưa có sơ đồ. Vui lòng liên hệ quản trị viên để cập nhật sơ đồ tầng.
                            </p>
                        </div>
                    )}

                    {!isLoading && !selectedFloorId && selectedBuildingId && (
                        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-blue-700">
                                Vui lòng chọn tầng để xem sơ đồ và chọn cửa.
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

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => {
                    console.log('Dialog onClose triggered');
                    setIsModalOpen(false);
                }}>
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
                                    className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <DialogTitle
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                                    >
                                        <DocumentTextIcon className="h-5 w-5 text-indigo-500 mr-2"/>
                                        Gửi yêu cầu đóng/mở cửa
                                    </DialogTitle>

                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Bạn đang gửi yêu cầu cho cửa: <span
                                            className="font-medium">{selectedDoor?.name}</span>
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="mt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="requesterName"
                                                       className="block text-sm font-medium text-gray-700">
                                                    Họ tên người yêu cầu <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="requesterName"
                                                    name="requesterName"
                                                    value={formData.requesterName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="requesterEmail"
                                                       className="block text-sm font-medium text-gray-700">
                                                    Email <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    id="requesterEmail"
                                                    name="requesterEmail"
                                                    value={formData.requesterEmail}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="requesterPhone"
                                                       className="block text-sm font-medium text-gray-700">
                                                    Số điện thoại <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="requesterPhone"
                                                    name="requesterPhone"
                                                    value={formData.requesterPhone}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>

                                            {/* Đã loại bỏ các trường không cần thiết */}
                                        </div>

                                        <div className="mt-4">
                                            <label htmlFor="purpose"
                                                   className="block text-sm font-medium text-gray-700">
                                                Mục đích <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                id="purpose"
                                                name="purpose"
                                                rows={3}
                                                value={formData.purpose}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                placeholder="Nhập mục đích yêu cầu đóng/mở cửa..."
                                            />
                                        </div>

                                        {/* Đã loại bỏ trường ghi chú */}

                                        <div className="mt-6 flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                onClick={() => setIsModalOpen(false)}
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                disabled={createDoorRequestMutation.isPending}
                                            >
                                                {createDoorRequestMutation.isPending ? (
                                                    <span className="flex items-center">
                                                        <Spinner className="h-4 w-4 mr-2"/>
                                                        Đang xử lý...
                                                    </span>
                                                ) : (
                                                    'Gửi yêu cầu'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default CreateDoorLockRequest;