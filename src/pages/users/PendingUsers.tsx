import React, {useState} from 'react';
import {useApproveUser, usePendingUsers, useRejectUser} from '@/hooks/users/useUsers';
import Pagination from '@/components/commons/Pagination';
import Spinner from '@/components/commons/Spinner';
import {User} from '@/hooks/users/model';
import Modal from '@/components/commons/Modal';
import {cn} from "@/lib/utils";

const PendingUsers: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [comment, setComment] = useState('');

    const {data: usersData, isLoading, refetch} = usePendingUsers({
        q: searchTerm,
        page: currentPage,
        limit
    });

    const approveUserMutation = useApproveUser();
    const rejectUserMutation = useRejectUser();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        refetch();
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleApproveClick = (userId: number) => {
        setSelectedUserId(userId);
        setComment('');
        setShowApproveModal(true);
    };

    const handleRejectClick = (userId: number) => {
        setSelectedUserId(userId);
        setComment('');
        setShowRejectModal(true);
    };

    const handleApproveUser = async () => {
        if (selectedUserId) {
            try {
                await approveUserMutation.mutateAsync({
                    userId: selectedUserId,
                    comment
                });
                setShowApproveModal(false);
                alert('Phê duyệt người dùng thành công!');
            } catch (error) {
                console.error('Error approving user:', error);
                alert('Phê duyệt người dùng thất bại!');
            }
        }
    };

    const handleRejectUser = async () => {
        if (selectedUserId) {
            try {
                await rejectUserMutation.mutateAsync({
                    userId: selectedUserId,
                    comment
                });
                setShowRejectModal(false);
                alert('Từ chối người dùng thành công!');
            } catch (error) {
                console.error('Error rejecting user:', error);
                alert('Từ chối người dùng thất bại!');
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Người dùng đang chờ phê duyệt</h1>
                <p className="text-gray-600 mt-2">
                    Quản lý và phê duyệt các tài khoản người dùng mới đăng ký
                </p>
            </div>

            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        className="border rounded px-4 py-2 flex-grow"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Tìm kiếm
                    </button>
                </form>
            </div>

            {isLoading ? (
                <div className="flex justify-center my-8">
                    <Spinner/>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b text-left">ID</th>
                                <th className="py-2 px-4 border-b text-left">Tên người dùng</th>
                                <th className="py-2 px-4 border-b text-left">Email</th>
                                <th className="py-2 px-4 border-b text-left">Họ tên</th>
                                <th className="py-2 px-4 border-b text-left">Ngày đăng ký</th>
                                <th className="py-2 px-4 border-b text-left">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {usersData?.data?.users.map((user: User) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{user.id}</td>
                                    <td className="py-2 px-4 border-b">{user.username}</td>
                                    <td className="py-2 px-4 border-b">{user.email}</td>
                                    <td className="py-2 px-4 border-b">{user.fullName}</td>
                                    <td className="py-2 px-4 border-b">
                                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleApproveClick(user.id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Phê duyệt
                                            </button>
                                            <button
                                                onClick={() => handleRejectClick(user.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Từ chối
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {(!usersData?.data?.users || usersData.data.users.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="py-4 text-center">
                                        Không có người dùng nào đang chờ phê duyệt
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {usersData && usersData?.data?.total > 0 && (
                        <div className="mt-4 flex justify-end">
                            <Pagination
                                currentPage={currentPage}
                                totalPage={Math.ceil(usersData.data.total / limit)}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Modal phê duyệt người dùng */}
            <Modal
                show={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                title="Phê duyệt người dùng"
            >
                <div className="p-4">
                    <p className="mb-4">Bạn có chắc chắn muốn phê duyệt người dùng này?</p>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ghi chú (tùy chọn)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setShowApproveModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleApproveUser}
                            disabled={approveUserMutation.isPending}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium disabled:bg-green-300"
                        >
                            {approveUserMutation.isPending ? <Spinner className={cn("size-5")}/> : 'Xác nhận phê duyệt'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal từ chối người dùng */}
            <Modal
                show={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                title="Từ chối người dùng"
            >
                <div className="p-4">
                    <p className="mb-4">Bạn có chắc chắn muốn từ chối người dùng này?</p>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lý do từ chối <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setShowRejectModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleRejectUser}
                            disabled={rejectUserMutation.isPending || !comment.trim()}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium disabled:bg-red-300"
                        >
                            {rejectUserMutation.isPending ? <Spinner className={cn("size-5")}/> : 'Xác nhận từ chối'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PendingUsers;