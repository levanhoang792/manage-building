import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useCreateRole, usePermissions} from '@/hooks/users/useUsers';
import {ROUTES} from '@/routes/routes';
import Spinner from '@/components/commons/Spinner';
import ErrorMessage from '@/components/commons/ErrorMessage';
import {toast} from 'sonner';
import {cn} from "@/lib/utils";
import {Permission} from '@/hooks/users/model';

const roleSchema = z.object({
    name: z.string()
        .min(3, 'Tên vai trò phải có ít nhất 3 ký tự')
        .max(50, 'Tên vai trò không được vượt quá 50 ký tự')
        .regex(/^[a-z0-9_]+$/, 'Tên vai trò chỉ được chứa chữ cái thường, số và dấu gạch dưới'),
    description: z.string().optional()
});

type RoleFormData = z.infer<typeof roleSchema>;

const CreateRole: React.FC = () => {
    const navigate = useNavigate();
    const createRoleMutation = useCreateRole();
    const {data: permissionsData, isLoading: isLoadingPermissions} = usePermissions({}, true); // Set fetchAll to true

    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [permissionGroups, setPermissionGroups] = useState<Record<string, Permission[]>>({});

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

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<RoleFormData>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: '',
            description: ''
        }
    });

    const handlePermissionChange = (permissionId: number) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permissionId)) {
                return prev.filter(id => id !== permissionId);
            } else {
                return [...prev, permissionId];
            }
        });
    };

    const handleGroupChange = (groupName: string, isChecked: boolean) => {
        const groupPermissionIds = permissionGroups[groupName].map(permission => permission.id);

        if (isChecked) {
            // Thêm tất cả quyền trong nhóm
            setSelectedPermissions(prev => {
                const newPermissions = [...prev];
                groupPermissionIds.forEach(id => {
                    if (!newPermissions.includes(id)) {
                        newPermissions.push(id);
                    }
                });
                return newPermissions;
            });
        } else {
            // Xóa tất cả quyền trong nhóm
            setSelectedPermissions(prev => prev.filter(id => !groupPermissionIds.includes(id)));
        }
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

    const onSubmit = async (data: RoleFormData) => {
        try {
            const result = await createRoleMutation.mutateAsync(data);

            // Nếu có quyền hạn được chọn và tạo vai trò thành công, chuyển hướng đến trang phân quyền
            if (selectedPermissions.length > 0 && result?.data?.id) {
                toast.success('Tạo vai trò thành công! Đang chuyển đến trang phân quyền...');
                navigate(`${ROUTES.ROLES}/${result.data.id}/permissions`);
            } else {
                toast.success('Tạo vai trò thành công!');
                navigate(ROUTES.ROLES);
            }
        } catch (error) {
            console.error('Error creating role:', error);
            toast.error(`Tạo vai trò thất bại: ${error || 'Đã xảy ra lỗi'}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Tạo vai trò mới</h1>

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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.name && <ErrorMessage error={errors.name}/>}
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
                                {errors.description && <ErrorMessage error={errors.description}/>}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-3">Phân quyền</h2>
                                <p className="text-sm text-gray-500 mb-3">
                                    Bạn có thể chọn quyền hạn cho vai trò này ngay bây giờ hoặc sau khi tạo vai trò.
                                </p>

                                {isLoadingPermissions ? (
                                    <div className="flex justify-center my-4">
                                        <Spinner/>
                                    </div>
                                ) : (
                                    <>
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
                                                    <div key={groupName}
                                                         className="border-b border-gray-200 last:border-b-0">
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
                                    </>
                                )}
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
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                        >
                            {isSubmitting ? <Spinner className={cn("size-5")}/> : 'Tạo vai trò'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRole;