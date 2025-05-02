import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {DoorFormData} from '@/hooks/doors';

// Components từ @headlessui/react
import {Dialog, DialogPanel, DialogTitle, Transition, TransitionChild} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {useDoorTypes} from "@/hooks/doorTypes";

// Validation schema
const doorSchema = z.object({
    name: z.string().min(1, {message: 'Tên cửa là bắt buộc'}),
    description: z.string().optional(),
    door_type_id: z.number({
        required_error: 'Loại cửa là bắt buộc',
        invalid_type_error: 'Loại cửa phải là số'
    }),
    status: z.enum(['active', 'inactive', 'maintenance'], {
        errorMap: () => ({message: 'Trạng thái không hợp lệ'})
    })
});

// Type inference from zod schema
type DoorFormValues = z.infer<typeof doorSchema>;

interface DoorFormProps {
    initialData?: DoorFormData;
    onSubmit: (data: DoorFormData) => void;
    isOpen: boolean;
    onClose: () => void;
    isSubmitting: boolean;
    error?: string;
}

const DoorForm: React.FC<DoorFormProps> = (
    {
        initialData,
        onSubmit,
        isOpen,
        onClose,
        isSubmitting,
        error
    }
) => {
    const {control, handleSubmit, reset, formState: {errors}} = useForm<DoorFormValues>({
        resolver: zodResolver(doorSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            door_type_id: initialData?.door_type_id || 1,
            status: initialData?.status || 'active'
        }
    });

    // Reset form khi initialData thay đổi
    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || '',
                description: initialData.description || '',
                door_type_id: initialData.door_type_id || 1,
                status: initialData.status || 'active'
            });
        }
    }, [initialData, reset]);

    // Fetch door types from API
    const {data: configData, isLoading: isLoadingConfig} = useDoorTypes();

    // Fallback door types in case API fails or is loading
    const fallbackDoorTypes = [
        {value: 1, label: 'Cửa thông thường'},
        {value: 2, label: 'Cửa thoát hiểm'},
        {value: 3, label: 'Cửa hạn chế'},
        {value: 4, label: 'Thang máy'},
        {value: 5, label: 'Cầu thang'}
    ];

    // Use door types from API if available, otherwise use fallback
    const doorTypes = configData?.data?.doorTypes
        ? configData.data.doorTypes.map(type => ({value: type.id, label: `${type.name} - ${type.description || ''}`}))
        : fallbackDoorTypes;

    const doorStatuses = [
        {value: 'active', label: 'Hoạt động'},
        {value: 'inactive', label: 'Không hoạt động'},
        {value: 'maintenance', label: 'Bảo trì'}
    ];

    return (
        <Transition show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <TransitionChild
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                </TransitionChild>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <TransitionChild
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <DialogPanel
                                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Đóng</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                                    </button>
                                </div>

                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                        <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                                            {initialData ? 'Chỉnh sửa cửa' : 'Thêm cửa mới'}
                                        </DialogTitle>
                                        <div className="mt-4">
                                            {error && (
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                                    <p className="text-sm text-red-600">{error}</p>
                                                </div>
                                            )}
                                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                                <div>
                                                    <label htmlFor="name"
                                                           className="block text-sm font-medium text-gray-700">
                                                        Tên cửa <span className="text-red-500">*</span>
                                                    </label>
                                                    <Controller
                                                        name="name"
                                                        control={control}
                                                        render={({field}) => (
                                                            <input
                                                                {...field}
                                                                type="text"
                                                                id="name"
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                            />
                                                        )}
                                                    />
                                                    {errors.name && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="description"
                                                           className="block text-sm font-medium text-gray-700">
                                                        Mô tả
                                                    </label>
                                                    <Controller
                                                        name="description"
                                                        control={control}
                                                        render={({field}) => (
                                                            <textarea
                                                                {...field}
                                                                id="description"
                                                                rows={3}
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                            />
                                                        )}
                                                    />
                                                    {errors.description && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="door_type_id"
                                                           className="block text-sm font-medium text-gray-700">
                                                        Loại cửa <span className="text-red-500">*</span>
                                                    </label>
                                                    <Controller
                                                        name="door_type_id"
                                                        control={control}
                                                        render={({field}) => (
                                                            <>
                                                                {isLoadingConfig ? (
                                                                    <div className="mt-1 flex items-center">
                                                                        <div
                                                                            className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                                                                        <span className="text-sm text-gray-500">Đang tải loại cửa...</span>
                                                                    </div>
                                                                ) : (
                                                                    <select
                                                                        {...field}
                                                                        id="door_type_id"
                                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                        value={field.value}
                                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                    >
                                                                        {doorTypes.map((type) => (
                                                                            <option key={type.value} value={type.value}>
                                                                                {type.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                )}
                                                            </>
                                                        )}
                                                    />
                                                    {errors.door_type_id && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.door_type_id.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="status"
                                                           className="block text-sm font-medium text-gray-700">
                                                        Trạng thái <span className="text-red-500">*</span>
                                                    </label>
                                                    <Controller
                                                        name="status"
                                                        control={control}
                                                        render={({field}) => (
                                                            <select
                                                                {...field}
                                                                id="status"
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                            >
                                                                {doorStatuses.map((status) => (
                                                                    <option key={status.value} value={status.value}>
                                                                        {status.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    />
                                                    {errors.status && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                                                    )}
                                                </div>

                                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                                    >
                                                        {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Thêm mới'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                                                        onClick={onClose}
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DoorForm;