import React, {useEffect, useState} from 'react';
import DoorRequestList from './components/DoorRequestList';
import DoorRequestFilter from './components/DoorRequestFilter';
import Pagination from '@/components/commons/Pagination';
import {useNavigate} from 'react-router-dom';
import {ROUTES} from '@/routes/routes';
import {toast} from 'sonner';
import DoorRequestStatusModal from './components/DoorRequestStatusModal';
import {DoorRequest, DoorRequestQueryParams} from "@/hooks/doorRequests/model";
import {useGetAllDoorRequests, useUpdateDoorRequestStatus} from "@/hooks/doorRequests/useDoorRequests";

const DoorRequestManagement: React.FC = () => {
    const navigate = useNavigate();

    const [filters, setFilters] = useState<DoorRequestQueryParams>({
        page: 1,
        limit: 10,
        search: '',
        status: '',
        sortBy: 'created_at',
        sortOrder: 'desc'
    });

    const [selectedRequest, setSelectedRequest] = useState<DoorRequest | null>(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    // Fetch data
    const {data: requestsData, isLoading: isLoadingRequests, refetch: refetchRequests, error: requestsError} =
        useGetAllDoorRequests(filters);

    // Mutations
    const updateStatusMutation = useUpdateDoorRequestStatus(selectedRequest?.id || 0);

    // Refetch when filters change
    useEffect(() => {
        // Không cần gọi refetch ở đây vì useQuery sẽ tự động refetch khi queryKey thay đổi
        // và chúng ta đã đưa filters vào queryKey
    }, [filters]);

    const handleFilterChange = (newFilters: DoorRequestQueryParams) => {
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

    const handleViewRequest = (request: DoorRequest) => {
        navigate(`${ROUTES.DOOR_REQUESTS}/${request.id}`);
    };

    const handleApproveRequest = (request: DoorRequest) => {
        setSelectedRequest(request);
        setIsApproveModalOpen(true);
    };

    const handleRejectRequest = (request: DoorRequest) => {
        setSelectedRequest(request);
        setIsRejectModalOpen(true);
    };

    const handleConfirmApprove = async (reason?: string) => {
        if (!selectedRequest) return;

        try {
            await updateStatusMutation.mutateAsync({
                status: 'approved',
                reason
            });

            toast.success('Yêu cầu đã được phê duyệt thành công');
            setIsApproveModalOpen(false);
            refetchRequests();
        } catch (error) {
            console.error('Error approving request:', error);
            toast.error('Có lỗi xảy ra khi phê duyệt yêu cầu');
        }
    };

    const handleConfirmReject = async (reason?: string) => {
        if (!selectedRequest) return;

        try {
            await updateStatusMutation.mutateAsync({
                status: 'rejected',
                reason
            });

            toast.success('Yêu cầu đã bị từ chối');
            setIsRejectModalOpen(false);
            refetchRequests();
        } catch (error) {
            console.error('Error rejecting request:', error);
            toast.error('Có lỗi xảy ra khi từ chối yêu cầu');
        }
    };

    const requests = requestsData?.data?.data || [];
    const totalItems = requestsData?.data?.total || 0;
    const totalPages = Math.ceil(totalItems / filters.limit!);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý yêu cầu mở cửa</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Xem và xử lý các yêu cầu mở cửa từ người dùng
                </p>
            </div>

            <DoorRequestFilter onFilterChange={handleFilterChange} initialFilters={filters}/>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                {requestsError ? (
                    <div className="p-6 text-center">
                        <p className="text-red-500 mb-4">
                            Đã xảy ra lỗi khi tải dữ liệu: {(requestsError as any)?.message || 'Không thể kết nối đến máy chủ'}
                        </p>
                        <button
                            onClick={() => refetchRequests()}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : (
                    <>
                        <DoorRequestList
                            requests={requests}
                            onView={handleViewRequest}
                            onApprove={handleApproveRequest}
                            onReject={handleRejectRequest}
                            isLoading={isLoadingRequests}
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
                    </>
                )}
            </div>

            {/* Approve Modal */}
            <DoorRequestStatusModal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                onConfirm={handleConfirmApprove}
                title="Phê duyệt yêu cầu mở cửa"
                description="Khi phê duyệt, cửa sẽ được mở tự động. Bạn có thể thêm lý do phê duyệt (không bắt buộc)."
                confirmText="Phê duyệt"
                confirmColor="green"
                request={selectedRequest}
            />

            {/* Reject Modal */}
            <DoorRequestStatusModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onConfirm={handleConfirmReject}
                title="Từ chối yêu cầu mở cửa"
                description="Vui lòng cung cấp lý do từ chối yêu cầu này."
                confirmText="Từ chối"
                confirmColor="red"
                request={selectedRequest}
                reasonRequired
            />
        </div>
    );
};

export default DoorRequestManagement;