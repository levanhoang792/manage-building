export type ReqUserData = {
    q?: string,
    status?: string,
    page?: number,
    limit?: number,
}

export type ResUserData = {
    status: number,
    randomCode: number
}

export type ReqLogin = {
    email: string,
    password: string,
    isRemember: boolean
}

export type ResLogin = {
    token: string
    user: ResLoginUser
}

export type ResLoginUser = {
    id: number
    username: string
    email: string
    fullName: string
    name: string
    roles: Array<ResLoginUserRole>
}

export type ResLoginUserRole = {
    id: number
    name: string
}

export type ResLogout = {
    message: string
}

export type ResUserToken = {
    token: string
    user: ResUserTokenUser
}

export type ResUserTokenUser = {
    id: number
    username: string
    email: string
    fullName: string
    roles: Array<ResLoginUserRole>
}

export type UserFormData = {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    roles: number[];
}

export type EditUserFormData = {
    username: string;
    email: string;
    fullName: string;
    phone?: string;
    roles: number[];
    isActive?: boolean;
}

export type ChangePasswordFormData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export type User = {
    id: number
    username: string
    email: string
    fullName: string
    phone?: string
    isActive: boolean
    isApproved: boolean
    created_at: string
    updated_at: string
    roles: Role[]
}

export type UserListResponse = {
    users: User[]
    total: number
    page: number
    limit: number
}

export type UserApprovalAction = {
    userId: number
    comment?: string
}

// Role types
export type Role = {
    id: number
    name: string
    description?: string
    created_at: string
    updated_at: string
    permissions?: Permission[]
}

export type RoleFormData = {
    name: string
    description?: string
}

export type RoleListResponse = {
    roles: Role[]
    total: number
    page: number
    limit: number
}

// Permission types
export type Permission = {
    id: number
    name: string
    description?: string
    created_at: string
    updated_at: string
}

export type PermissionListResponse = {
    permissions: Permission[]
    total: number
    page: number
    limit: number
}

// Role-Permission types
export type RolePermissionAssignData = {
    roleId: number
    permissionIds: number[]
}

// User-Role types
export type UserRoleAssignData = {
    userId: number
    roleIds: number[]
}