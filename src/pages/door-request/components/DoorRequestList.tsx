import React from 'react';
import {CheckCircleIcon, ClockIcon, EyeIcon, XCircleIcon} from '@heroicons/react/24/outline';
import {format} from 'date-fns';
import {DoorRequest} from "@/hooks/doorRequests/model";

interface DoorRequestListProps {
    requests: DoorRequest[];
    onView: (request: DoorRequest) => void;
    onApprove: (request: DoorRequest) => void;
    onReject: (request: DoorRequest) => void;
    isLoading: boolean;
}

const DoorRequestList: React.FC<DoorRequestListProps> = ({
                                                             requests,
                                                             onView,
                                                             onApprove,
                                                             onReject,
                                                             isLoading
                                                         }) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <ClockIcon className="mr-1 h-3 w-3"/>
                        Đang chờ
                    </span>
                );
            case 'approved':
                return (
                    <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="mr-1 h-3 w-3"/>
                        Đã phê duyệt
                    </span>
                );
            case 'rejected':
                return (
                    <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircleIcon className="mr-1 h-3 w-3"/>
                        Đã từ chối
                    </span>
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Không có yêu cầu mở cửa nào.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tòa nhà / Tầng / Cửa
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người yêu cầu
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mục đích
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian tạo
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Xử lý bởi
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {request.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900">{request.building_name}</span>
                                <span>{request.floor_name}</span>
                                <span>{request.door_name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900">{request.requester_name}</span>
                                {request.requester_phone && <span>{request.requester_phone}</span>}
                                {request.requester_email && <span>{request.requester_email}</span>}
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                            <div className="truncate">{request.purpose}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getStatusBadge(request.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.processed_by_name ? (
                                <div className="flex flex-col">
                                    <span>{request.processed_by_name}</span>
                                    {request.processed_at && (
                                        <span className="text-xs text-gray-400">
                                                {format(new Date(request.processed_at), 'dd/MM/yyyy HH:mm')}
                                            </span>
                                    )}
                                </div>
                            ) : (
                                <span>-</span>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onView(request)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                    title="Xem chi tiết"
                                >
                                    <EyeIcon className="h-5 w-5"/>
                                </button>

                                {request.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => onApprove(request)}
                                            className="text-green-600 hover:text-green-900"
                                            title="Phê duyệt"
                                        >
                                            <CheckCircleIcon className="h-5 w-5"/>
                                        </button>
                                        <button
                                            onClick={() => onReject(request)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Từ chối"
                                        >
                                            <XCircleIcon className="h-5 w-5"/>
                                        </button>
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DoorRequestList;