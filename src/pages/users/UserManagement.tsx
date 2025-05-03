import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDeleteUser, useUsers} from '@/hooks/users/useUsers';
import {ROUTES} from '@/routes/routes';
import Pagination from '@/components/commons/Pagination';
import Spinner from '@/components/commons/Spinner';
import {User} from '@/hooks/users/model';

const UserManagement: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);

    const {data: usersData, isLoading, refetch} = useUsers({
        q: searchTerm,
        page: currentPage,
        limit
    });

    const deleteUserMutation = useDeleteUser();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        refetch();
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleDeleteUser = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                await deleteUserMutation.mutateAsync(id);
                alert('Xóa người dùng thành công!');
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Xóa người dùng thất bại!');
            }
        }
    };

    const getRoleBadgeClass = (roleName: string) => {
        switch (roleName) {
            case 'super_admin':
                return 'bg-red-100 text-red-800';
            case 'admin':
                return 'bg-blue-100 text-blue-800';
            case 'manager':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
                <Link
                    to={ROUTES.USER_CREATE}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Thêm người dùng
                </Link>
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
                                <th className="py-2 px-4 border-b text-left">Vai trò</th>
                                <th className="py-2 px-4 border-b text-left">Trạng thái</th>
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
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map((role) => (
                                                <span
                                                    key={role.id}
                                                    className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeClass(role.name)}`}
                                                >
                            {role.name}
                          </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                      <span
                          className={`px-2 py-1 rounded-full text-xs ${
                              user.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => navigate(`${ROUTES.USER_EDIT.replace(':id', user.id.toString())}`)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {(!usersData?.data?.users || usersData.data.users.length === 0) && (
                                <tr>
                                    <td colSpan={7} className="py-4 text-center">
                                        Không có người dùng nào
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
        </div>
    );
};

export default UserManagement;