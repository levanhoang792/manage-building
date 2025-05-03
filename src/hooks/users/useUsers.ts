import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {httpDelete, httpGet, httpPost, httpPut} from "@/utils/api";
import {
    ChangePasswordFormData,
    EditUserFormData,
    Permission,
    PermissionListResponse,
    ReqLogin,
    ReqUserData,
    ResLogin,
    ResLogout,
    ResUserToken,
    Role,
    RoleFormData,
    RoleListResponse,
    RolePermissionAssignData,
    User,
    UserApprovalAction,
    UserFormData,
    UserListResponse,
    UserRoleAssignData
} from "@/hooks/users/model";

import {API_ROUTES} from "@/routes/api";
import {ResRequest} from "@/hooks/model";

const userQueryKey = "users";
const roleQueryKey = "roles";
const permissionQueryKey = "permissions";

/**
 * Hook để lấy danh sách người dùng
 * @param params Tham số tìm kiếm và phân trang
 * @returns Query object với danh sách người dùng
 */
const useUsers = (params: ReqUserData) => {
    return useQuery({
        queryKey: [userQueryKey, JSON.stringify(params)],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (params.q) queryParams.append('q', params.q);
            if (params.status) queryParams.append('status', params.status);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());

            const resp = await httpGet(
                {
                    uri: `${API_ROUTES.USERS}?${queryParams.toString()}`
                }
            );
            return await resp.json() as ResRequest<UserListResponse>;
        }
    });
};

/**
 * Hook để lấy danh sách người dùng đang chờ phê duyệt
 * @param params Tham số tìm kiếm và phân trang
 * @returns Query object với danh sách người dùng đang chờ phê duyệt
 */
const usePendingUsers = (params: ReqUserData) => {
    return useQuery({
        queryKey: ['pendingUsers', JSON.stringify(params)],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (params.q) queryParams.append('q', params.q);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());

            const resp = await httpGet(
                {
                    uri: `${API_ROUTES.USER_PENDING}?${queryParams.toString()}`
                }
            );
            return await resp.json() as ResRequest<UserListResponse>;
        }
    });
};

/**
 * Hook để lấy thông tin chi tiết người dùng
 * @param id ID của người dùng
 * @returns Query object với thông tin chi tiết người dùng
 */
const useUser = (id: number | string) => {
    return useQuery({
        queryKey: [userQueryKey, id],
        queryFn: async () => {
            const resp = await httpGet(
                {
                    uri: API_ROUTES.USER_DETAIL.replace(':id', id.toString())
                }
            );
            return await resp.json() as ResRequest<User>;
        },
        enabled: !!id
    });
};

/**
 * Hook để tạo người dùng mới
 * @returns Mutation object để tạo người dùng mới
 */
const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: UserFormData) => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.USER_CREATE,
                    options: {body: JSON.stringify(params)}
                }
            );
            return await resp.json() as ResRequest<User>;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [userQueryKey]});
        }
    });
};

/**
 * Hook để cập nhật thông tin người dùng
 * @returns Mutation object để cập nhật thông tin người dùng
 */
const useUpdateUser = (id: number | string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: EditUserFormData) => {
            const resp = await httpPut(
                {
                    uri: API_ROUTES.USER_UPDATE.replace(':id', id.toString()),
                    options: {body: JSON.stringify(params)}
                }
            );
            return await resp.json() as ResRequest<User>;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [userQueryKey, id]});
            queryClient.invalidateQueries({queryKey: [userQueryKey]});
        }
    });
};

/**
 * Hook để xóa người dùng
 * @returns Mutation object để xóa người dùng
 */
const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            const resp = await httpDelete(
                {
                    uri: API_ROUTES.USER_DELETE.replace(':id', id.toString())
                }
            );
            return await resp.json() as ResRequest<null>;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [userQueryKey]});
        }
    });
};

/**
 * Hook để phê duyệt người dùng
 * @returns Mutation object để phê duyệt người dùng
 */
const useApproveUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: UserApprovalAction) => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.USER_APPROVE.replace(':id', params.userId.toString()),
                    options: {body: JSON.stringify({comment: params.comment})}
                }
            );
            return await resp.json() as ResRequest<null>;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [userQueryKey]});
            queryClient.invalidateQueries({queryKey: ['pendingUsers']});
        }
    });
};

/**
 * Hook để từ chối người dùng
 * @returns Mutation object để từ chối người dùng
 */
const useRejectUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: UserApprovalAction) => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.USER_REJECT.replace(':id', params.userId.toString()),
                    options: {body: JSON.stringify({comment: params.comment})}
                }
            );
            return await resp.json() as ResRequest<null>;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [userQueryKey]});
            queryClient.invalidateQueries({queryKey: ['pendingUsers']});
        }
    });
};

/**
 * Hook để lấy danh sách vai trò
 * @param params Tham số tìm kiếm và phân trang
 * @returns Query object với danh sách vai trò
 */
const useRoles = (params: ReqUserData = {}) => {
    return useQuery({
        queryKey: [roleQueryKey, JSON.stringify(params)],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (params.q) queryParams.append('q', params.q);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());

            const resp = await httpGet(
                {
                    uri: `${API_ROUTES.ROLES}?${queryParams.toString()}`
                }
            );
            return await resp.json() as ResRequest<RoleListResponse>;
        }
    });
};

/**
 * Hook để lấy thông tin chi tiết vai trò
 * @param id ID của vai trò
 * @returns Query object với thông tin chi tiết vai trò
 */
const useRole = (id: number | string) => {
    return useQuery({
        queryKey: [roleQueryKey, id],
        queryFn: async () => {
            const resp = await httpGet(
                {
                    uri: API_ROUTES.ROLE_DETAIL.replace(':id', id.toString())
                }
            );
            return await resp.json() as ResRequest<Role>;
        },
        enabled: !!id
    });
};

/**
 * Hook để tạo vai trò mới
 * @returns Mutation object để tạo vai trò mới
 */
const useCreateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: RoleFormData) => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.ROLE_CREATE,
                    options: {body: JSON.stringify(params)}
                }
            );
            return await resp.json() as ResRequest<Role>;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [roleQueryKey]});
        }
    });
};

/**
 * Hook để cập nhật thông tin vai trò
 * @returns Mutation object để cập nhật thông tin vai trò
 */
const useUpdateRole = (id: number | string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: RoleFormData) => {
            const resp = await httpPut(
                {
                    uri: API_ROUTES.ROLE_UPDATE.replace(':id', id.toString()),
                    options: {body: JSON.stringify(params)}
                }
            );
            return await resp.json() as ResRequest<Role>;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [roleQueryKey, id]});
            queryClient.invalidateQueries({queryKey: [roleQueryKey]});
        }
    });
};

/**
 * Hook để xóa vai trò
 * @returns Mutation object để xóa vai trò
 */
const useDeleteRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            const resp = await httpDelete(
                {
                    uri: API_ROUTES.ROLE_DELETE.replace(':id', id.toString())
                }
            );
            return await resp.json() as ResRequest<null>;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [roleQueryKey]});
        }
    });
};

/**
 * Hook để lấy danh sách quyền hạn
 * @param params Tham số tìm kiếm và phân trang
 * @param fetchAll Nếu true, sẽ lấy tất cả quyền hạn (không phân trang)
 * @returns Query object với danh sách quyền hạn
 */
const usePermissions = (params: ReqUserData = {}, fetchAll: boolean = false) => {
    return useQuery({
        queryKey: [permissionQueryKey, JSON.stringify(params), fetchAll],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (params.q) queryParams.append('q', params.q);

            // Nếu fetchAll = true, sử dụng tham số all=true để lấy tất cả quyền hạn
            if (fetchAll) {
                queryParams.append('all', 'true');
            } else {
                if (params.page) queryParams.append('page', params.page.toString());
                if (params.limit) queryParams.append('limit', params.limit.toString());
            }

            const resp = await httpGet(
                {
                    uri: `${API_ROUTES.PERMISSIONS}?${queryParams.toString()}`
                }
            );
            return await resp.json() as ResRequest<PermissionListResponse>;
        }
    });
};

/**
 * Hook để lấy danh sách quyền hạn của vai trò
 * @param roleId ID của vai trò
 * @returns Query object với danh sách quyền hạn của vai trò
 */
const useRolePermissions = (roleId: number | string) => {
    return useQuery({
        queryKey: [roleQueryKey, roleId, 'permissions'],
        queryFn: async () => {
            const resp = await httpGet(
                {
                    uri: API_ROUTES.ROLE_PERMISSIONS.replace(':id', roleId.toString())
                }
            );
            return await resp.json() as ResRequest<Permission[]>;
        },
        enabled: !!roleId
    });
};

/**
 * Hook để gán quyền hạn cho vai trò
 * @returns Mutation object để gán quyền hạn cho vai trò
 */
const useAssignRolePermissions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: RolePermissionAssignData) => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.ROLE_PERMISSION_ASSIGN.replace(':id', params.roleId.toString()),
                    options: {body: JSON.stringify({permissionIds: params.permissionIds})}
                }
            );
            return await resp.json() as ResRequest<null>;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: [roleQueryKey, variables.roleId, 'permissions']});
            queryClient.invalidateQueries({queryKey: [roleQueryKey, variables.roleId]});
        }
    });
};

/**
 * Hook để lấy danh sách vai trò của người dùng
 * @param userId ID của người dùng
 * @returns Query object với danh sách vai trò của người dùng
 */
const useUserRoles = (userId: number | string) => {
    return useQuery({
        queryKey: [userQueryKey, userId, 'roles'],
        queryFn: async () => {
            const resp = await httpGet(
                {
                    uri: API_ROUTES.USER_ROLES.replace(':id', userId.toString())
                }
            );
            return await resp.json() as ResRequest<Role[]>;
        },
        enabled: !!userId
    });
};

/**
 * Hook để gán vai trò cho người dùng
 * @returns Mutation object để gán vai trò cho người dùng
 */
const useAssignUserRoles = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: UserRoleAssignData) => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.USER_ROLE_ASSIGN.replace(':id', params.userId.toString()),
                    options: {body: JSON.stringify({roleIds: params.roleIds})}
                }
            );
            return await resp.json() as ResRequest<null>;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: [userQueryKey, variables.userId, 'roles']});
            queryClient.invalidateQueries({queryKey: [userQueryKey, variables.userId]});
        }
    });
};

const useLogin = () => {
    return useMutation({
        mutationFn: async (params: ReqLogin) => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.AUTH_LOGIN,
                    options: {body: JSON.stringify(params)}
                },
            );
            return await resp.json() as ResRequest<ResLogin>;
        },
        onSuccess: (data) => {
            console.log('Login successful:', data);
        },
        onError: (error) => {
            console.error('Login mutation error:', error);
        }
    });
};

const useLogout = () => {
    return useMutation({
        mutationFn: async () => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.LOGOUT,
                },
            )
            return await resp.json() as ResLogout;
        },
        onSuccess: () => {
        },
        onError: () => {
        }
    });
};

const checkExpireToken = async () => {
    const resp = await httpPost(
        {uri: API_ROUTES.AUTH_REFRESH_TOKEN}
    )
    return await resp.json() as ResRequest<ResUserToken>;
};

/**
 * Hook để kiểm tra token còn hạn hay không khi F5 lại trang
 * @returns Query object với thông tin về token
 */
const useCheckExpireToken = () => {
    return useMutation({
        mutationFn: checkExpireToken,
        onSuccess: () => {
        },
        onError: () => {
        }
    });
};

/**
 * Hook để thay đổi mật khẩu người dùng
 * @returns Mutation object để thay đổi mật khẩu
 */
const useChangePassword = () => {
    return useMutation({
        mutationFn: async (params: ChangePasswordFormData) => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.PROFILE_CHANGE_PASSWORD,
                    options: {body: JSON.stringify(params)}
                },
            );
            return await resp.json() as ResRequest<null>;
        },
        onSuccess: (data) => {
            console.log('Password changed successfully:', data);
        },
        onError: (error) => {
            console.error('Change password mutation error:', error);
        }
    });
};

export {
    useUsers,
    useUser,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
    usePendingUsers,
    useApproveUser,
    useRejectUser,

    useRoles,
    useRole,
    useCreateRole,
    useUpdateRole,
    useDeleteRole,

    usePermissions,
    useRolePermissions,
    useAssignRolePermissions,

    useUserRoles,
    useAssignUserRoles,

    useLogin,
    useLogout,
    useCheckExpireToken,
    useChangePassword
};
