import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useGetBuildings} from '@/hooks/buildings';
import {useGetFloors} from '@/hooks/floors';
import {useGetDoors} from '@/hooks/doors';
import {ROUTES} from '@/routes/routes';
import {ArrowLeftIcon} from '@heroicons/react/24/outline';
import {toast} from 'sonner';
import {useCreateDoorRequest} from "@/hooks/doorRequests/useDoorRequests";
import {DoorRequestFormData} from "@/hooks/doorRequests/model";

const CreateDoorRequest: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<DoorRequestFormData>({
        door_id: 0,
        requester_name: '',
        requester_phone: '',
        requester_email: '',
        purpose: ''
    });

    const [selectedBuildingId, setSelectedBuildingId] = useState<string>('');
    const [selectedFloorId, setSelectedFloorId] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch data
    const {data: buildingsData} = useGetBuildings();
    const {data: floorsData} = useGetFloors(selectedBuildingId || '');
    const {data: doorsData} = useGetDoors(
        selectedBuildingId || '',
        selectedFloorId || ''
    );

    const buildings = buildingsData?.data?.data || [];
    const floors = floorsData?.data?.data || [];
    const doors = doorsData?.data?.data || [];

    // Mutations
    const createDoorRequestMutation = useCreateDoorRequest();

    // Reset dependent fields when parent fields change
    useEffect(() => {
        if (selectedBuildingId) {
            setSelectedFloorId('');
            setFormData(prev => ({
                ...prev,
                door_id: 0
            }));
        }
    }, [selectedBuildingId]);

    useEffect(() => {
        if (selectedFloorId) {
            setFormData(prev => ({
                ...prev,
                door_id: 0
            }));
        }
    }, [selectedFloorId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;

        if (name === 'buildingId') {
            setSelectedBuildingId(value);
        } else if (name === 'floorId') {
            setSelectedFloorId(value);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.door_id) {
            newErrors.door_id = 'Vui lòng chọn cửa';
        }

        if (!formData.requester_name.trim()) {
            newErrors.requester_name = 'Vui lòng nhập tên người yêu cầu';
        }

        if (formData.requester_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.requester_email)) {
            newErrors.requester_email = 'Email không hợp lệ';
        }

        if (formData.requester_phone && !/^[0-9]{10,11}$/.test(formData.requester_phone)) {
            newErrors.requester_phone = 'Số điện thoại không hợp lệ';
        }

        if (!formData.purpose.trim()) {
            newErrors.purpose = 'Vui lòng nhập mục đích yêu cầu mở cửa';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await createDoorRequestMutation.mutateAsync(formData);
            toast.success('Yêu cầu mở cửa đã được gửi thành công');
            navigate(ROUTES.DOOR_REQUESTS);
        } catch (error) {
            console.error('Error creating door request:', error);
            toast.error('Có lỗi xảy ra khi gửi yêu cầu mở cửa');
        }
    };

    const handleCancel = () => {
        navigate(ROUTES.DOOR_REQUESTS);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6 flex items-center">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="mr-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <ArrowLeftIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/>
                    Quay lại
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Tạo yêu cầu mở cửa mới</h1>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="buildingId" className="block text-sm font-medium text-gray-700">
                                    Tòa nhà <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="buildingId"
                                        name="buildingId"
                                        value={selectedBuildingId}
                                        onChange={handleInputChange}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        required
                                    >
                                        <option value="">Chọn tòa nhà</option>
                                        {buildings.map(building => (
                                            <option key={building.id} value={building.id}>
                                                {building.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="floorId" className="block text-sm font-medium text-gray-700">
                                    Tầng <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="floorId"
                                        name="floorId"
                                        value={selectedFloorId}
                                        onChange={handleInputChange}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        disabled={!selectedBuildingId}
                                        required
                                    >
                                        <option value="">Chọn tầng</option>
                                        {floors.map(floor => (
                                            <option key={floor.id} value={floor.id}>
                                                {floor.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="door_id" className="block text-sm font-medium text-gray-700">
                                    Cửa <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="door_id"
                                        name="door_id"
                                        value={formData.door_id || ''}
                                        onChange={handleInputChange}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        disabled={!selectedFloorId}
                                        required
                                    >
                                        <option value="">Chọn cửa</option>
                                        {doors.map(door => (
                                            <option key={door.id} value={door.id}>
                                                {door.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.door_id && (
                                        <p className="mt-2 text-sm text-red-600">{errors.door_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="requester_name" className="block text-sm font-medium text-gray-700">
                                    Tên người yêu cầu <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="requester_name"
                                        name="requester_name"
                                        value={formData.requester_name}
                                        onChange={handleInputChange}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        required
                                    />
                                    {errors.requester_name && (
                                        <p className="mt-2 text-sm text-red-600">{errors.requester_name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="requester_phone" className="block text-sm font-medium text-gray-700">
                                    Số điện thoại
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="tel"
                                        id="requester_phone"
                                        name="requester_phone"
                                        value={formData.requester_phone || ''}
                                        onChange={handleInputChange}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    />
                                    {errors.requester_phone && (
                                        <p className="mt-2 text-sm text-red-600">{errors.requester_phone}</p>
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="requester_email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        id="requester_email"
                                        name="requester_email"
                                        value={formData.requester_email || ''}
                                        onChange={handleInputChange}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    />
                                    {errors.requester_email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.requester_email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                                    Mục đích yêu cầu mở cửa <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="purpose"
                                        name="purpose"
                                        rows={4}
                                        value={formData.purpose}
                                        onChange={handleInputChange}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        required
                                    />
                                    {errors.purpose && (
                                        <p className="mt-2 text-sm text-red-600">{errors.purpose}</p>
                                    )}
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Mô tả chi tiết lý do bạn cần mở cửa này.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={createDoorRequestMutation.isPending}
                            >
                                {createDoorRequestMutation.isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateDoorRequest;