import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {DoorCoordinateFormData} from '@/hooks/doorCoordinates';

// Components từ @headlessui/react
import {Dialog, DialogPanel, DialogTitle, Transition, TransitionChild} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';

// Validation schema
const coordinateSchema = z.object({
    x_coordinate: z.number({
        required_error: 'Tọa độ X là bắt buộc',
        invalid_type_error: 'Tọa độ X phải là số'
    }),
    y_coordinate: z.number({
        required_error: 'Tọa độ Y là bắt buộc',
        invalid_type_error: 'Tọa độ Y phải là số'
    }),
    z_coordinate: z.number({
        invalid_type_error: 'Tọa độ Z phải là số'
    }).optional(),
    rotation: z.number({
        invalid_type_error: 'Góc quay phải là số'
    }).optional()
});

// Type inference from zod schema
type CoordinateFormValues = z.infer<typeof coordinateSchema>;

interface DoorCoordinateFormProps {
    initialData?: DoorCoordinateFormData;
    onSubmit: (data: DoorCoordinateFormData) => void;
    isOpen: boolean;
    onClose: () => void;
    isSubmitting: boolean;
}

const DoorCoordinateForm: React.FC<DoorCoordinateFormProps> = ({
                                                                   initialData,
                                                                   onSubmit,
                                                                   isOpen,
                                                                   onClose,
                                                                   isSubmitting
                                                               }) => {
    const {control, handleSubmit, reset, formState: {errors}} = useForm<CoordinateFormValues>({
        resolver: zodResolver(coordinateSchema),
        defaultValues: {
            x_coordinate: initialData?.x_coordinate || 0,
            y_coordinate: initialData?.y_coordinate || 0,
            z_coordinate: initialData?.z_coordinate,
            rotation: initialData?.rotation
        }
    });

    // Reset form khi initialData thay đổi
    useEffect(() => {
        if (initialData) {
            reset({
                x_coordinate: initialData.x_coordinate,
                y_coordinate: initialData.y_coordinate,
                z_coordinate: initialData.z_coordinate,
                rotation: initialData.rotation
            });
        }
    }, [initialData, reset]);

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
                                            {initialData ? 'Chỉnh sửa tọa độ' : 'Thêm tọa độ mới'}
                                        </DialogTitle>
                                        <div className="mt-4">
                                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="x_coordinate"
                                                               className="block text-sm font-medium text-gray-700">
                                                            Tọa độ X <span className="text-red-500">*</span>
                                                        </label>
                                                        <Controller
                                                            name="x_coordinate"
                                                            control={control}
                                                            render={({field}) => (
                                                                <input
                                                                    {...field}
                                                                    type="number"
                                                                    id="x_coordinate"
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                                />
                                                            )}
                                                        />
                                                        {errors.x_coordinate && (
                                                            <p className="mt-1 text-sm text-red-600">{errors.x_coordinate.message}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label htmlFor="y_coordinate"
                                                               className="block text-sm font-medium text-gray-700">
                                                            Tọa độ Y <span className="text-red-500">*</span>
                                                        </label>
                                                        <Controller
                                                            name="y_coordinate"
                                                            control={control}
                                                            render={({field}) => (
                                                                <input
                                                                    {...field}
                                                                    type="number"
                                                                    id="y_coordinate"
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                                />
                                                            )}
                                                        />
                                                        {errors.y_coordinate && (
                                                            <p className="mt-1 text-sm text-red-600">{errors.y_coordinate.message}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="z_coordinate"
                                                               className="block text-sm font-medium text-gray-700">
                                                            Tọa độ Z (nếu cần)
                                                        </label>
                                                        <Controller
                                                            name="z_coordinate"
                                                            control={control}
                                                            render={({field}) => (
                                                                <input
                                                                    {...field}
                                                                    type="number"
                                                                    id="z_coordinate"
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                                />
                                                            )}
                                                        />
                                                        {errors.z_coordinate && (
                                                            <p className="mt-1 text-sm text-red-600">{errors.z_coordinate.message}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label htmlFor="rotation"
                                                               className="block text-sm font-medium text-gray-700">
                                                            Góc quay (độ)
                                                        </label>
                                                        <Controller
                                                            name="rotation"
                                                            control={control}
                                                            render={({field}) => (
                                                                <input
                                                                    {...field}
                                                                    type="number"
                                                                    id="rotation"
                                                                    min="0"
                                                                    max="360"
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                                />
                                                            )}
                                                        />
                                                        {errors.rotation && (
                                                            <p className="mt-1 text-sm text-red-600">{errors.rotation.message}</p>
                                                        )}
                                                    </div>
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

export default DoorCoordinateForm;