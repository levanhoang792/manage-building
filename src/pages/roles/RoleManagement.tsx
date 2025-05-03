import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDeleteRole, useRoles} from '@/hooks/users/useUsers';
import {ROUTES} from '@/routes/routes';
import Pagination from '@/components/commons/Pagination';
import Spinner from '@/components/commons/Spinner';
import {Role} from '@/hooks/users/model';
import {PlusIcon} from "@heroicons/react/24/outline";
import {cn} from "@/lib/utils";
import {toast} from 'sonner';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';

const RoleManagement: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const {data: rolesData, isLoading, refetch} = useRoles({
        q: searchTerm,
        page: currentPage,
        limit
    });

    const deleteRoleMutation = useDeleteRole();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        refetch();
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleDeleteClick = (role: Role) => {
        setSelectedRole(role);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setSelectedRole(null);
    };

    const handleDeleteRole = async () => {
        if (!selectedRole) return;

        try {
            await deleteRoleMutation.mutateAsync(selectedRole.id);
            toast.success('Xóa vai trò thành công!');
            refetch();
        } catch (error) {
            console.error('Error deleting role:', error);
            toast.error(`Xóa vai trò thất bại: ${error || 'Đã xảy ra lỗi'}`);
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedRole(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý vai trò</h1>
                <Link
                    to={ROUTES.ROLE_CREATE}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-between gap-1"
                >
                    <PlusIcon className={cn("size-5")}/>
                    Thêm vai trò
                </Link>
            </div>

            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm vai trò..."
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
                                <th className="py-2 px-4 border-b text-left">Tên vai trò</th>
                                <th className="py-2 px-4 border-b text-left">Mô tả</th>
                                <th className="py-2 px-4 border-b text-left">Ngày tạo</th>
                                <th className="py-2 px-4 border-b text-left">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rolesData?.data?.roles.map((role: Role) => (
                                <tr key={role.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{role.id}</td>
                                    <td className="py-2 px-4 border-b font-medium">{role.name}</td>
                                    <td className="py-2 px-4 border-b">{role.description || '-'}</td>
                                    <td className="py-2 px-4 border-b">
                                        {new Date(role.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => navigate(`${ROUTES.ROLE_EDIT.replace(':id', role.id.toString())}`)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => navigate(`${ROUTES.ROLE_PERMISSIONS.replace(':id', role.id.toString())}`)}
                                                className="text-green-500 hover:text-green-700"
                                            >
                                                Phân quyền
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(role)}
                                                className="text-red-500 hover:text-red-700"
                                                disabled={['super_admin', 'admin', 'manager', 'user'].includes(role.name)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {(!rolesData?.data?.roles || rolesData.data.roles.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center">
                                        Không có vai trò nào
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {rolesData && (rolesData?.data?.total || 0) > 0 && (
                        <div className="mt-4 flex justify-end">
                            <Pagination
                                currentPage={currentPage}
                                totalPage={Math.ceil(rolesData.data.total / limit)}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteRole}
                title="Xóa vai trò"
                message={`Bạn có chắc chắn muốn xóa vai trò "${selectedRole?.name}"? Hành động này sẽ ảnh hưởng đến tất cả người dùng có vai trò này.`}
                isDeleting={deleteRoleMutation.isPending}
            />
        </div>
    );
};

export default RoleManagement;