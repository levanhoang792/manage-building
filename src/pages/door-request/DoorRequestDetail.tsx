import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {ROUTES} from '@/routes/routes';
import {ArrowLeftIcon, CheckCircleIcon, ClockIcon, XCircleIcon} from '@heroicons/react/24/outline';
import {format} from 'date-fns';
import {toast} from 'sonner';
import DoorRequestStatusModal from './components/DoorRequestStatusModal';
import {useGetDoorRequestDetail, useUpdateDoorRequestStatus} from "@/hooks/doorRequests/useDoorRequests";
import {DoorRequestStatusData} from "@/hooks/doorRequests/model";

const DoorRequestDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    const {data: requestData, isLoading, refetch} = useGetDoorRequestDetail(id || '');
    const updateStatusMutation = useUpdateDoorRequestStatus(id || '');

    const request = requestData?.data;

    const handleBack = () => {
        navigate(ROUTES.DOOR_REQUESTS);
    };

    const handleApprove = async (reason?: string) => {
        if (!id) return;

        try {
            const data: DoorRequestStatusData = {
                status: 'approved',
                reason
            };

            await updateStatusMutation.mutateAsync(data);
            toast.success('Yêu cầu đã được phê duyệt thành công');
            setIsApproveModalOpen(false);
            refetch();
        } catch (error) {
            console.error('Error approving request:', error);
            toast.error('Có lỗi xảy ra khi phê duyệt yêu cầu');
        }
    };

    const handleReject = async (reason?: string) => {
        if (!id) return;

        try {
            const data: DoorRequestStatusData = {
                status: 'rejected',
                reason
            };

            await updateStatusMutation.mutateAsync(data);
            toast.success('Yêu cầu đã bị từ chối');
            setIsRejectModalOpen(false);
            refetch();
        } catch (error) {
            console.error('Error rejecting request:', error);
            toast.error('Có lỗi xảy ra khi từ chối yêu cầu');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <ClockIcon className="mr-1 h-4 w-4"/>
                        Đang chờ
                    </span>
                );
            case 'approved':
                return (
                    <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="mr-1 h-4 w-4"/>
                        Đã phê duyệt
                    </span>
                );
            case 'rejected':
                return (
                    <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <XCircleIcon className="mr-1 h-4 w-4"/>
                        Đã từ chối
                    </span>
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="text-center py-8">
                    <p className="text-gray-500">Không tìm thấy yêu cầu mở cửa.</p>
                    <button
                        type="button"
                        onClick={handleBack}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="mr-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <ArrowLeftIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/>
                        Quay lại
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Chi tiết yêu cầu mở cửa #{request.id}</h1>
                </div>
                <div>
                    {getStatusBadge(request.status)}
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Thông tin yêu cầu</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Chi tiết về yêu cầu mở cửa và người yêu cầu
                        </p>
                    </div>

                    {request.status === 'pending' && (
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsApproveModalOpen(true)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <CheckCircleIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/>
                                Phê duyệt
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsRejectModalOpen(true)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <XCircleIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/>
                                Từ chối
                            </button>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Người yêu cầu</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.requester_name}</dd>
                        </div>

                        {request.requester_phone && (
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.requester_phone}</dd>
                            </div>
                        )}

                        {request.requester_email && (
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.requester_email}</dd>
                            </div>
                        )}

                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Tòa nhà</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.building_name}</dd>
                        </div>

                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Tầng</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.floor_name}</dd>
                        </div>

                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Cửa</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.door_name}</dd>
                        </div>

                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Mục đích</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.purpose}</dd>
                        </div>

                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Thời gian tạo</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm:ss')}
                            </dd>
                        </div>

                        {request.status !== 'pending' && (
                            <>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Người xử lý</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {request.processed_by_name || 'Không có thông tin'}
                                    </dd>
                                </div>

                                {request.processed_at && (
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Thời gian xử lý</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {format(new Date(request.processed_at), 'dd/MM/yyyy HH:mm:ss')}
                                        </dd>
                                    </div>
                                )}
                            </>
                        )}
                    </dl>
                </div>
            </div>

            {/* Approve Modal */}
            <DoorRequestStatusModal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                onConfirm={handleApprove}
                title="Phê duyệt yêu cầu mở cửa"
                description="Khi phê duyệt, cửa sẽ được mở tự động. Bạn có thể thêm lý do phê duyệt (không bắt buộc)."
                confirmText="Phê duyệt"
                confirmColor="green"
                request={request}
            />

            {/* Reject Modal */}
            <DoorRequestStatusModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onConfirm={handleReject}
                title="Từ chối yêu cầu mở cửa"
                description="Vui lòng cung cấp lý do từ chối yêu cầu này."
                confirmText="Từ chối"
                confirmColor="red"
                request={request}
                reasonRequired
            />
        </div>
    );
};

export default DoorRequestDetail;