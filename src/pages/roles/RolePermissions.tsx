import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useAssignRolePermissions, usePermissions, useRole, useRolePermissions} from '@/hooks/users/useUsers';
import {ROUTES} from '@/routes/routes';
import Spinner from '@/components/commons/Spinner';
import {Permission} from '@/hooks/users/model';
import {toast} from 'sonner';
import {cn} from "@/lib/utils";

const RolePermissions: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {data: roleData, isLoading: isLoadingRole} = useRole(id || '');
    const {data: permissionsData, isLoading: isLoadingPermissions} = usePermissions({}, true); // Set fetchAll to true
    const {data: rolePermissionsData, isLoading: isLoadingRolePermissions} = useRolePermissions(id || '');

    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [permissionGroups, setPermissionGroups] = useState<Record<string, Permission[]>>({});

    const assignPermissionsMutation = useAssignRolePermissions();

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
            console.log(`Loaded ${permissionsData.data.permissions.length} permissions out of ${permissionsData.data.total} total`);
        }
    }, [permissionsData]);

    // Thiết lập quyền hạn đã được gán cho vai trò
    useEffect(() => {
        if (rolePermissionsData?.data) {
            setSelectedPermissions(rolePermissionsData.data.map(permission => permission.id));
        }
    }, [rolePermissionsData]);

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

    const handleSavePermissions = async () => {
        try {
            await assignPermissionsMutation.mutateAsync({
                roleId: Number(id),
                permissionIds: selectedPermissions
            });
            toast.success('Cập nhật quyền hạn thành công!');
        } catch (error) {
            console.error('Error assigning permissions:', error);
            toast.error(`Cập nhật quyền hạn thất bại: ${error || 'Đã xảy ra lỗi'}`);
        }
    };

    const filterPermissions = (permissions: Permission[]) => {
        if (!searchTerm) return permissions;
        return permissions.filter(permission =>
            permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (permission.description && permission.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Phân quyền cho vai trò: {roleData.data.name}</h1>
                    <button
                        onClick={() => navigate(ROUTES.ROLES)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        Quay lại danh sách vai trò
                    </button>
                </div>

                {roleData.data.description && (
                    <div className="mb-6">
                        <p className="text-gray-600">{roleData.data.description}</p>
                    </div>
                )}

                {/* Warning message removed since we're now fetching all permissions */}

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Tìm kiếm quyền hạn..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-6">
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

                                <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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

                <div className="flex justify-end">
                    <button
                        onClick={handleSavePermissions}
                        disabled={assignPermissionsMutation.isPending}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                    >
                        {assignPermissionsMutation.isPending ? <Spinner className={cn("size-5")}/> : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RolePermissions;