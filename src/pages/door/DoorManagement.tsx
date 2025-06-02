import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Door, DoorFormData, DoorQueryParams, useCreateDoor, useDeleteDoor, useGetDoors} from '@/hooks/doors';
import DoorList from './components/DoorList';
import DoorForm from './components/DoorForm';
import DoorFilter from './components/DoorFilter';
import Pagination from '@/components/commons/Pagination';
import {ArrowDownTrayIcon, PlusIcon} from '@heroicons/react/24/outline';
import {useGetFloorDetail} from '@/hooks/floors';
import {useGetBuildingDetail} from '@/hooks/buildings';

export const DoorManagement: React.FC = () => {
    const {id, floorId} = useParams<{ id: string; floorId: string }>();
    const navigate = useNavigate();

    const generateDoorScript = (door: Door, buildingId: string, floorId: string) => {
        return `#!/usr/bin/env node
/**
 * Door Control Script
 * Door ID: ${door.id}
 * Door Name: ${door.name}
 * Building ID: ${buildingId}
 * Floor ID: ${floorId}
 *
 * Hướng dẫn sử dụng:
 * 1. Cài đặt Node.js phiên bản >= 18 từ https://nodejs.org/
 * 2. Thêm token xác thực vào biến AUTH_TOKEN bên dưới (không bắt buộc)
 * 3. Để yêu cầu truy cập cửa: node door_${door.id}_control.js "Tên người yêu cầu" "Số điện thoại" "Email" "Lý do"
 */

const API_URL = '${window.location.origin}';
const DOOR_ID = ${door.id};
const AUTH_TOKEN = ''; // Token không bắt buộc vì API hỗ trợ guest access

async function requestDoorAccess(requesterName, requesterPhone, requesterEmail = '', purpose) {
    if (!requesterName || !requesterPhone || !purpose) {
        console.error('Thiếu thông tin. Vui lòng cung cấp đầy đủ tên, số điện thoại và lý do.');
        console.log('Cách sử dụng: node door_${door.id}_control.js "Tên" "SĐT" "Email" "Lý do"');
        return;
    }

    try {
        const response = await fetch(\`\${API_URL}/api/door-requests\`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...AUTH_TOKEN ? {'Authorization': \`Bearer \${AUTH_TOKEN}\`} : {}
            },
            body: JSON.stringify({
                door_id: DOOR_ID,
                requester_name: requesterName,
                requester_phone: requesterPhone,
                requester_email: requesterEmail,
                purpose: purpose
            })
        });

        if (!response.ok) {
            throw new Error(\`Lỗi khi gửi yêu cầu: \${response.statusText}\`);
        }

        const result = await response.json();
        console.log('[SUCCESS] Đã gửi yêu cầu truy cập cửa thành công');
        console.log('Chi tiết:', result);
        return result;
    } catch (error) {
        console.error('[ERROR] Lỗi khi gửi yêu cầu:', error.message);
        throw error;
    }
}

// Xử lý tham số dòng lệnh
const [requesterName, requesterPhone, requesterEmail, ...purposeParts] = process.argv.slice(2);
const purpose = purposeParts.join(' ');

if (!requesterName || !requesterPhone || !purpose) {
    console.log('Cách sử dụng:');
    console.log('  node door_${door.id}_control.js "Tên người yêu cầu" "Số điện thoại" "Email" "Lý do truy cập"');
    console.log('');
    console.log('Ví dụ:');
    console.log('  node door_${door.id}_control.js "Nguyễn Văn A" "0123456789" "email@example.com" "Gặp khách hàng"');
    process.exit(1);
}

requestDoorAccess(requesterName, requesterPhone, requesterEmail, purpose)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));`;
    };

    const handleDownloadScript = (door: Door) => {
        if (!id || !floorId) return;
        const script = generateDoorScript(door, id, floorId);
        const blob = new Blob([script], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `door_${door.id}_control.js`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Kiểm tra nếu không có id hoặc floorId, chuyển hướng về trang buildings
    useEffect(() => {
        if (!id || !floorId) {
            navigate('/buildings');
        }
    }, [id, floorId, navigate]);

    const [filters, setFilters] = useState<DoorQueryParams>({
        page: 1,
        limit: 10,
        search: '',
        type: '',
        status: '',
        sortBy: 'created_at',
        sortOrder: 'desc'
    });

    const [isFormOpen, setIsFormOpen] = useState(false);

    // Fetch data chỉ khi có id và floorId
    const {data: doorsData, isLoading: isLoadingDoors, refetch: refetchDoors} =
        useGetDoors(id || undefined, floorId || undefined, filters);
    const {data: floorData, isLoading: isLoadingFloor} =
        useGetFloorDetail(id || '0', floorId || '0');
    const {data: buildingData, isLoading: isLoadingBuilding} =
        useGetBuildingDetail(id || '0');

    // Mutations
    const createDoorMutation = useCreateDoor(id || '0', floorId || '0');
    const deleteDoorMutation = useDeleteDoor(id || '0', floorId || '0');

    // Refetch when filters change
    useEffect(() => {
        refetchDoors().then(r => r);
    }, [filters, refetchDoors]);

    // Listen for door:create event
    useEffect(() => {
        const handleCreateEvent = () => setIsFormOpen(true);
        window.addEventListener('door:create', handleCreateEvent);
        return () => {
            window.removeEventListener('door:create', handleCreateEvent);
        };
    }, []);

    const handleFilterChange = (newFilters: DoorQueryParams) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1 // Reset to first page when filters change
        }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({
            ...prev,
            page
        }));
    };

    const handleCreateDoor = async (data: DoorFormData) => {
        try {
            await createDoorMutation.mutateAsync(data);
            setIsFormOpen(false);
            refetchDoors();
        } catch (error) {
            console.error('Error creating door:', error);
        }
    };

    const handleDeleteDoor = async (id: number) => {
        try {
            await deleteDoorMutation.mutateAsync(id);
            refetchDoors();
        } catch (error) {
            console.error('Error deleting door:', error);
        }
    };

    const handleEditDoor = (door: Door) => {
        // Thêm tham số returnTo để quay về trang danh sách cửa sau khi chỉnh sửa
        const currentPath = `/buildings/${id}/floors/${floorId}/doors`;
        const encodedReturnTo = encodeURIComponent(currentPath);
        navigate(`/buildings/${id}/floors/${floorId}/doors/edit/${door.id}?returnTo=${encodedReturnTo}`);
    };

    const handleViewDoor = (door: Door) => {
        navigate(`/buildings/${id}/floors/${floorId}/doors/${door.id}`);
    };

    const isLoading = isLoadingDoors || isLoadingFloor || isLoadingBuilding;
    const doors = doorsData?.data?.data || [];
    const totalItems = doorsData?.data?.total || 0;
    const totalPages = Math.ceil(totalItems / filters.limit!);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý cửa</h1>
                        {!isLoading && (
                            <p className="mt-1 text-sm text-gray-500">
                                Tòa nhà: {buildingData?.data?.name} | Tầng: {floorData?.data?.name}
                            </p>
                        )}
                    </div>
                    <div className="mt-4 md:mt-0">
                        <button
                            type="button"
                            onClick={() => {
                                // Chuyển đến trang tạo cửa mới với tham số returnTo
                                const currentPath = `/buildings/${id}/floors/${floorId}/doors`;
                                const encodedReturnTo = encodeURIComponent(currentPath);
                                navigate(`/buildings/${id}/floors/${floorId}/doors/create?returnTo=${encodedReturnTo}`);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                            Thêm cửa mới
                        </button>
                    </div>
                </div>
            </div>

            <DoorFilter onFilterChange={handleFilterChange} initialFilters={filters}/>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <DoorList
                    doors={doors}
                    onEdit={handleEditDoor}
                    onDelete={handleDeleteDoor}
                    onView={handleViewDoor}
                    onDownloadScript={handleDownloadScript}
                    isLoading={isLoading}
                />

                {totalPages > 1 && (
                    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <Pagination
                            currentPage={filters.page || 1}
                            totalPage={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            <DoorForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleCreateDoor}
                isSubmitting={createDoorMutation.isPending}
                error={createDoorMutation.error?.message}
            />
        </div>
    );
};

export default DoorManagement;

















