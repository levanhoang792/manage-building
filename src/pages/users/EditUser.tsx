import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useRoles, useUpdateUser, useUser} from '@/hooks/users/useUsers';
import {ROUTES} from '@/routes/routes';
import Spinner from '@/components/commons/Spinner';
import ErrorMessage from '@/components/commons/ErrorMessage';
import {toast} from 'sonner';
import {cn} from "@/lib/utils";

const userSchema = z.object({
    username: z.string().min(3, 'Tên người dùng phải có ít nhất 3 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    phone: z.string().optional(),
    isActive: z.boolean().optional(),
    roles: z.array(z.number()).min(1, 'Phải chọn ít nhất một vai trò')
});

type UserFormData = z.infer<typeof userSchema>;

const EditUser: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {data: userData, isLoading: isLoadingUser} = useUser(id || '');
    const {data: rolesData, isLoading: isLoadingRoles} = useRoles();
    const updateUserMutation = useUpdateUser(id || '');

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: {errors, isSubmitting}
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: '',
            email: '',
            fullName: '',
            phone: '',
            isActive: true,
            roles: []
        }
    });

    useEffect(() => {
        if (userData?.data) {
            reset({
                username: userData.data.username,
                email: userData.data.email,
                fullName: userData.data.fullName,
                phone: userData.data.phone || '',
                isActive: userData.data.isActive,
                roles: userData.data.roles.map(role => role.id)
            });
        }
    }, [userData, reset]);

    const onSubmit = async (data: UserFormData) => {
        try {
            await updateUserMutation.mutateAsync(data);
            toast.success('Cập nhật người dùng thành công!');
            navigate(ROUTES.USERS);
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error(`Cập nhật người dùng thất bại: Đã xảy ra lỗi`);
        }
    };

    if (isLoadingUser || isLoadingRoles) {
        return (
            <div className="flex justify-center my-8">
                <Spinner/>
            </div>
        );
    }

    if (!userData?.data) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-500">
                    Không tìm thấy thông tin người dùng
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Chỉnh sửa người dùng</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên người dùng <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('username')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.username && <ErrorMessage error={errors.username}/>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            {...register('email')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.email && <ErrorMessage error={errors.email}/>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Họ tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('fullName')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.fullName && <ErrorMessage error={errors.fullName}/>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại
                        </label>
                        <input
                            type="text"
                            {...register('phone')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.phone && <ErrorMessage error={errors.phone}/>}
                    </div>

                    <div>
                        <label className="flex items-center">
                            <Controller
                                control={control}
                                name="isActive"
                                render={({field}) => (
                                    <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                )}
                            />
                            <span className="ml-2 text-sm text-gray-700">Kích hoạt tài khoản</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vai trò <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            control={control}
                            name="roles"
                            render={({field}) => (
                                <div className="space-y-2">
                                    {rolesData?.data?.roles.map((role) => (
                                        <div key={role.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`role-${role.id}`}
                                                value={role.id}
                                                checked={field.value.includes(role.id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    const value = Number(e.target.value);
                                                    const newValues = checked
                                                        ? [...field.value, value]
                                                        : field.value.filter((id) => id !== value);
                                                    field.onChange(newValues);
                                                }}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label
                                                htmlFor={`role-${role.id}`}
                                                className="ml-2 block text-sm text-gray-900"
                                            >
                                                {role.name} {role.description && `- ${role.description}`}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        />
                        {errors.roles && <ErrorMessage error={errors.roles}/>}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.USERS)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                        >
                            {isSubmitting ? <Spinner className={cn("size-5")}/> : 'Cập nhật'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;