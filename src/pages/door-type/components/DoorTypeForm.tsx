import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Dialog, DialogPanel, DialogTitle, Transition, TransitionChild} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {CreateDoorTypeDto, DoorType, UpdateDoorTypeDto} from '@/hooks/doorTypes/model';
import {useCreateDoorType, useUpdateDoorType} from '@/hooks/doorTypes';

// Validation schema
const doorTypeSchema = z.object({
    name: z.string().min(1, {message: 'Name is required'}),
    description: z.string().optional(),
});

// Type inference from zod schema
type DoorTypeFormValues = z.infer<typeof doorTypeSchema>;

interface DoorTypeFormProps {
    initialData?: DoorType;
    isOpen: boolean;
    onClose: () => void;
    isSubmitting: boolean;
    error?: string;
    mode: 'create' | 'edit' | 'view';
}

const DoorTypeForm: React.FC<DoorTypeFormProps> = ({
                                                       initialData,
                                                       isOpen,
                                                       onClose,
                                                       isSubmitting: externalIsSubmitting,
                                                       error: externalError,
                                                       mode
                                                   }) => {
    const [error, setError] = useState<string | null>(externalError || null);
    const {mutate: createDoorType, isPending: isCreating} = useCreateDoorType();
    const {mutate: updateDoorType, isPending: isUpdating} = useUpdateDoorType();

    const isSubmitting = externalIsSubmitting || isCreating || isUpdating;
    const isViewMode = mode === 'view';

    const {control, handleSubmit, reset, formState: {errors}} = useForm<DoorTypeFormValues>({
        resolver: zodResolver(doorTypeSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
        }
    });

    // Reset form when initialData changes
    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || '',
                description: initialData.description || '',
            });
        }
    }, [initialData, reset]);

    const onSubmit = (data: DoorTypeFormValues) => {
        setError(null);

        if (mode === 'create') {
            const createData: CreateDoorTypeDto = {
                name: data.name,
                description: data.description,
            };

            createDoorType(createData, {
                onSuccess: () => {
                    onClose();
                },
                onError: (error) => {
                    setError(error.message || 'Failed to create door type');
                }
            });
        } else if (mode === 'edit' && initialData) {
            const updateData: UpdateDoorTypeDto = {
                id: initialData.id,
                name: data.name,
                description: data.description,
            };

            updateDoorType(updateData, {
                onSuccess: () => {
                    onClose();
                },
                onError: (error) => {
                    setError(error.message || 'Failed to update door type');
                }
            });
        }
    };

    return (
        <Transition show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-10" onClose={isViewMode ? onClose : () => {
            }}>
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
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                                    </button>
                                </div>

                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                        <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                                            {mode === 'create' ? 'Add Door Type' : mode === 'edit' ? 'Edit Door Type' : 'Door Type Details'}
                                        </DialogTitle>
                                        <div className="mt-4">
                                            {error && (
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                                    <p className="text-sm text-red-600">{error}</p>
                                                </div>
                                            )}
                                            <form
                                                onSubmit={isViewMode ? (e) => e.preventDefault() : handleSubmit(onSubmit)}
                                                className="space-y-4">
                                                <div>
                                                    <label htmlFor="name"
                                                           className="block text-sm font-medium text-gray-700">
                                                        Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <Controller
                                                        name="name"
                                                        control={control}
                                                        render={({field}) => (
                                                            <input
                                                                {...field}
                                                                type="text"
                                                                id="name"
                                                                disabled={isViewMode}
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
                                                        Description
                                                    </label>
                                                    <Controller
                                                        name="description"
                                                        control={control}
                                                        render={({field}) => (
                                                            <textarea
                                                                {...field}
                                                                id="description"
                                                                rows={3}
                                                                disabled={isViewMode}
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                            />
                                                        )}
                                                    />
                                                    {errors.description && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                                    )}
                                                </div>

                                                {initialData && (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Created At
                                                            </label>
                                                            <div className="mt-1 text-sm text-gray-900">
                                                                {new Date(initialData.created_at || '').toLocaleString()}
                                                            </div>
                                                        </div>
                                                        {initialData.updated_at && (
                                                            <div>
                                                                <label
                                                                    className="block text-sm font-medium text-gray-700">
                                                                    Updated At
                                                                </label>
                                                                <div className="mt-1 text-sm text-gray-900">
                                                                    {new Date(initialData.updated_at).toLocaleString()}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                    {!isViewMode && (
                                                        <button
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                                                        >
                                                            {isSubmitting ? (
                                                                <>
                                                                    <span
                                                                        className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                                                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                                                                </>
                                                            ) : (
                                                                mode === 'create' ? 'Create' : 'Update'
                                                            )}
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                        onClick={onClose}
                                                    >
                                                        {isViewMode ? 'Close' : 'Cancel'}
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

export default DoorTypeForm;