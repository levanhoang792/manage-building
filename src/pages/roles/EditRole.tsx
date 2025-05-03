import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {
    useAssignRolePermissions,
    usePermissions,
    useRole,
    useRolePermissions,
    useUpdateRole
} from '@/hooks/users/useUsers';
import {ROUTES} from '@/routes/routes';
import Spinner from '@/components/commons/Spinner';
import ErrorMessage from '@/components/commons/ErrorMessage';
import {toast} from 'sonner';
import {Permission} from '@/hooks/users/model';
import {cn} from "@/lib/utils";

const roleSchema = z.object({
    name: z.string()
        .min(3, 'Tên vai trò phải có ít nhất 3 ký tự')
        .max(50, 'Tên vai trò không được vượt quá 50 ký tự')
        .regex(/^[a-z0-9_]+$/, 'Tên vai trò chỉ được chứa chữ cái thường, số và dấu gạch dưới'),
    description: z.string().optional()
});

type RoleFormData = z.infer<typeof roleSchema>;

const EditRole: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {data: roleData, isLoading: isLoadingRole} = useRole(id || '');
    const updateRoleMutation = useUpdateRole(id || '');
    const {data: permissionsData, isLoading: isLoadingPermissions} = usePermissions({}, true); // Set fetchAll to true
    const {data: rolePermissionsData, isLoading: isLoadingRolePermissions} = useRolePermissions(id || '');
    const assignPermissionsMutation = useAssignRolePermissions();

    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [permissionGroups, setPermissionGroups] = useState<Record<string, Permission[]>>({});
    const [isPermissionsChanged, setIsPermissionsChanged] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting}
    } = useForm<RoleFormData>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: '',
            description: ''
        }
    });

    // Nhóm quyền hạn theo nhóm (user., role., building., v.v.)
    useEffect(() => {
        if (permissionsData?.data?.permissions) {
            const groups: Record<string, Permission[]> = {};

            permissionsData.data.permissions.forEach(permission => {
                const groupName = permission.name.split('.')[0];
                if (!groups[groupName]) {
                    groups[groupName] = [];
                }
                groups[groupName].push(permission);
            });

            setPermissionGroups(groups);
        }
    }, [permissionsData]);

    // Thiết lập quyền hạn đã được gán cho vai trò
    useEffect(() => {
        if (rolePermissionsData?.data) {
            const permissionIds = rolePermissionsData.data.map(permission => permission.id);
            setSelectedPermissions(permissionIds);
            // Reset trạng thái thay đổi quyền hạn
            setIsPermissionsChanged(false);
        }
    }, [rolePermissionsData]);

    useEffect(() => {
        if (roleData?.data) {
            reset({
                name: roleData.data.name,
                description: roleData.data.description || ''
            });
        }
    }, [roleData, reset]);

    const handlePermissionChange = (permissionId: number) => {
        setSelectedPermissions(prev => {
            const newPermissions = prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId];

            // Đánh dấu là đã thay đổi quyền hạn
            setIsPermissionsChanged(true);
            return newPermissions;
        });
    };

    const handleGroupChange = (groupName: string, isChecked: boolean) => {
        const groupPermissionIds = permissionGroups[groupName].map(permission => permission.id);

        setSelectedPermissions(prev => {
            let newPermissions;
            if (isChecked) {
                // Thêm tất cả quyền trong nhóm
                newPermissions = [...prev];
                groupPermissionIds.forEach(id => {
                    if (!newPermissions.includes(id)) {
                        newPermissions.push(id);
                    }
                });
            } else {
                // Xóa tất cả quyền trong nhóm
                newPermissions = prev.filter(id => !groupPermissionIds.includes(id));
            }

            // Đánh dấu là đã thay đổi quyền hạn
            setIsPermissionsChanged(true);
            return newPermissions;
        });
    };

    const isGroupChecked = (groupName: string) => {
        const groupPermissionIds = permissionGroups[groupName].map(permission => permission.id);
        return groupPermissionIds.every(id => selectedPermissions.includes(id));
    };

    const isGroupIndeterminate = (groupName: string) => {
        const groupPermissionIds = permissionGroups[groupName].map(permission => permission.id);
        const hasSelected = groupPermissionIds.some(id => selectedPermissions.includes(id));
        return hasSelected && !isGroupChecked(groupName);
    };

    const filterPermissions = (permissions: Permission[]) => {
        if (!searchTerm) return permissions;
        return permissions.filter(permission =>
            permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (permission.description && permission.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    const handleSavePermissions = async () => {
        try {
            await assignPermissionsMutation.mutateAsync({
                roleId: Number(id),
                permissionIds: selectedPermissions
            });
            toast.success('Cập nhật quyền hạn thành công!');
            setIsPermissionsChanged(false);
        } catch (error) {
            console.error('Error assigning permissions:', error);
            toast.error(`Cập nhật quyền hạn thất bại: ${error || 'Đã xảy ra lỗi'}`);
        }
    };

    const onSubmit = async (data: RoleFormData) => {
        try {
            await updateRoleMutation.mutateAsync(data);

            // Nếu có thay đổi quyền hạn, cập nhật quyền hạn
            if (isPermissionsChanged) {
                await handleSavePermissions();
            }

            toast.success('Cập nhật vai trò thành công!');
            navigate(ROUTES.ROLES);
        } catch (error: any) {
            console.error('Error updating role:', error);
            toast.error(`Cập nhật vai trò thất bại: ${error.message || 'Đã xảy ra lỗi'}`);
        }
    };

    if (isLoadingRole || isLoadingPermissions || isLoadingRolePermissions) {
        return (
            <div className="flex justify-center my-8">
                <Spinner/>
            </div>
        );
    }

    if (!roleData?.data) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-500">
                    Không tìm thấy thông tin vai trò
                </div>
            </div>
        );
    }

    // Kiểm tra xem có phải vai trò mặc định không
    const isDefaultRole = ['super_admin', 'admin', 'manager', 'user'].includes(roleData.data.name);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Chỉnh sửa vai trò</h1>

                {isDefaultRole && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd"
                                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                          clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Đây là vai trò mặc định của hệ thống. Bạn chỉ có thể chỉnh sửa mô tả, không thể thay
                                    đổi tên vai trò.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên vai trò <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('name')}
                                    disabled={isDefaultRole}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isDefaultRole ? 'bg-gray-100' : ''}`}
                                />
                                {errors.name && <ErrorMessage message={errors.name.message}/>}
                                <p className="mt-1 text-sm text-gray-500">
                                    Tên vai trò chỉ được chứa chữ cái thường, số và dấu gạch dưới (ví dụ: admin_level1)
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả
                                </label>
                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.description && <ErrorMessage message={errors.description.message}/>}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-3">Phân quyền</h2>
                                <p className="text-sm text-gray-500 mb-3">
                                    Chọn quyền hạn cho vai trò này. Bạn cũng có thể quản lý quyền hạn chi tiết hơn ở
                                    trang phân quyền.
                                </p>

                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm quyền hạn..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div
                                    className="bg-white border border-gray-200 rounded-md shadow-sm max-h-96 overflow-y-auto">
                                    {Object.keys(permissionGroups).sort().map(groupName => {
                                        const filteredPermissions = filterPermissions(permissionGroups[groupName]);
                                        if (filteredPermissions.length === 0) return null;

                                        return (
                                            <div key={groupName} className="border-b border-gray-200 last:border-b-0">
                                                <div className="px-4 py-3 bg-gray-50 flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`group-${groupName}`}
                                                        checked={isGroupChecked(groupName)}
                                                        ref={el => {
                                                            if (el) {
                                                                el.indeterminate = isGroupIndeterminate(groupName);
                                                            }
                                                        }}
                                                        onChange={(e) => handleGroupChange(groupName, e.target.checked)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label
                                                        htmlFor={`group-${groupName}`}
                                                        className="ml-2 block text-sm font-medium text-gray-900 capitalize"
                                                    >
                                                        {groupName}
                                                    </label>
                                                </div>

                                                <div className="px-4 py-3 grid grid-cols-1 gap-3">
                                                    {filteredPermissions.map(permission => (
                                                        <div key={permission.id} className="flex items-start">
                                                            <input
                                                                type="checkbox"
                                                                id={`permission-${permission.id}`}
                                                                checked={selectedPermissions.includes(permission.id)}
                                                                onChange={() => handlePermissionChange(permission.id)}
                                                                className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                            />
                                                            <label
                                                                htmlFor={`permission-${permission.id}`}
                                                                className="ml-2 block text-sm text-gray-900"
                                                            >
                                                                <div>{permission.name}</div>
                                                                {permission.description && (
                                                                    <div
                                                                        className="text-xs text-gray-500">{permission.description}</div>
                                                                )}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-4 flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`${ROUTES.ROLES}/${id}/permissions`)}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Quản lý quyền hạn chi tiết
                                    </button>

                                    {isPermissionsChanged && (
                                        <span className="text-xs text-orange-500">
                                            * Quyền hạn đã thay đổi và sẽ được lưu khi bạn cập nhật vai trò
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.ROLES)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || assignPermissionsMutation.isPending}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                        >
                            {isSubmitting || assignPermissionsMutation.isPending ?
                                <Spinner className={cn("size-5")}/> : 'Cập nhật'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRole;