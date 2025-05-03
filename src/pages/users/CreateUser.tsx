import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useCreateUser, useRoles} from '@/hooks/users/useUsers';
import {ROUTES} from '@/routes/routes';
import Spinner from '@/components/commons/Spinner';
import ErrorMessage from '@/components/commons/ErrorMessage';

const userSchema = z.object({
    username: z.string().min(3, 'Tên người dùng phải có ít nhất 3 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string(),
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    phone: z.string().optional(),
    roles: z.array(z.number()).min(1, 'Phải chọn ít nhất một vai trò')
}).refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
});

type UserFormData = z.infer<typeof userSchema>;

const CreateUser: React.FC = () => {
    const navigate = useNavigate();
    const {data: rolesData, isLoading: isLoadingRoles} = useRoles();
    const createUserMutation = useCreateUser();

    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting}
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            fullName: '',
            phone: '',
            roles: []
        }
    });

    const onSubmit = async (data: UserFormData) => {
        try {
            const {confirmPassword, ...userData} = data;
            await createUserMutation.mutateAsync(userData);
            alert('Tạo người dùng thành công!');
            navigate(ROUTES.USERS);
        } catch (error: any) {
            console.error('Error creating user:', error);
            alert(`Tạo người dùng thất bại: ${error.message || 'Đã xảy ra lỗi'}`);
        }
    };

    if (isLoadingRoles) {
        return (
            <div className="flex justify-center my-8">
                <Spinner/>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Tạo người dùng mới</h1>

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
                        {errors.username && <ErrorMessage message={errors.username.message}/>}
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
                        {errors.email && <ErrorMessage message={errors.email.message}/>}
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
                        {errors.fullName && <ErrorMessage message={errors.fullName.message}/>}
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
                        {errors.phone && <ErrorMessage message={errors.phone.message}/>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            {...register('password')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.password && <ErrorMessage message={errors.password.message}/>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Xác nhận mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            {...register('confirmPassword')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword.message}/>}
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
                        {errors.roles && <ErrorMessage message={errors.roles.message}/>}
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
                            {isSubmitting ? <Spinner size="sm"/> : 'Tạo người dùng'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;