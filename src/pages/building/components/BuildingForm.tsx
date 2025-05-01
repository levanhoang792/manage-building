import {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Button, Field, Input, Label, Textarea} from '@headlessui/react';
import {cn} from '@/lib/utils';
import {Building, BuildingFormData} from '@/hooks/buildings/model';
import FieldError from '@/components/FieldError';
import Spinner from '@/components/commons/Spinner';

// Create a schema for form validation
const FormSchema: z.ZodType<BuildingFormData> = z.object({
    name: z.string().nonempty('Building name is required'),
    address: z.string().nonempty('Address is required'),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
});

interface BuildingFormProps {
    building?: Building;
    onSubmit: (data: BuildingFormData) => void;
    isSubmitting: boolean;
    submitButtonText?: string;
}

export default function BuildingForm({
                                         building,
                                         onSubmit,
                                         isSubmitting,
                                         submitButtonText = 'Save',
                                     }: BuildingFormProps) {
    const {control, handleSubmit, formState: {errors}, reset} = useForm<BuildingFormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: building?.name || '',
            address: building?.address || '',
            description: building?.description || '',
            status: building?.status || 'active',
        },
    });

    // Update form values when building data changes
    useEffect(() => {
        if (building) {
            reset({
                name: building.name,
                address: building.address,
                description: building.description || '',
                status: building.status,
            });
        }
    }, [building, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Controller
                control={control}
                name="name"
                render={({field}) => (
                    <Field>
                        <Label className="block text-gray-700 text-sm font-bold mb-2">
                            Building Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            {...field}
                            type="text"
                            className={cn(
                                "shadow appearance-none border rounded w-full py-2 px-3",
                                "text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
                                errors.name && "border-red-500"
                            )}
                            placeholder="Enter building name"
                        />
                        <FieldError error={errors.name}/>
                    </Field>
                )}
            />

            <Controller
                control={control}
                name="address"
                render={({field}) => (
                    <Field>
                        <Label className="block text-gray-700 text-sm font-bold mb-2">
                            Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            {...field}
                            type="text"
                            className={cn(
                                "shadow appearance-none border rounded w-full py-2 px-3",
                                "text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
                                errors.address && "border-red-500"
                            )}
                            placeholder="Enter building address"
                        />
                        <FieldError error={errors.address}/>
                    </Field>
                )}
            />

            <Controller
                control={control}
                name="description"
                render={({field}) => (
                    <Field>
                        <Label className="block text-gray-700 text-sm font-bold mb-2">
                            Description
                        </Label>
                        <Textarea
                            {...field}
                            className={cn(
                                "shadow appearance-none border rounded w-full py-2 px-3",
                                "text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
                                errors.description && "border-red-500"
                            )}
                            placeholder="Enter building description"
                            rows={4}
                        />
                        <FieldError error={errors.description}/>
                    </Field>
                )}
            />

            <Controller
                control={control}
                name="status"
                render={({field}) => (
                    <Field>
                        <Label className="block text-gray-700 text-sm font-bold mb-2">
                            Status
                        </Label>
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                                <input
                                    id="status-active"
                                    type="radio"
                                    value="active"
                                    checked={field.value === 'active'}
                                    onChange={() => field.onChange('active')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="status-active" className="ml-2 block text-sm text-gray-700">
                                    Active
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="status-inactive"
                                    type="radio"
                                    value="inactive"
                                    checked={field.value === 'inactive'}
                                    onChange={() => field.onChange('inactive')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="status-inactive" className="ml-2 block text-sm text-gray-700">
                                    Inactive
                                </label>
                            </div>
                        </div>
                        <FieldError error={errors.status}/>
                    </Field>
                )}
            />

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                        "inline-flex items-center gap-2 rounded-md bg-gray-700 py-2 px-5 text-white text-sm",
                        "transition-all shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-600",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                >
                    {isSubmitting && <Spinner className="h-4 w-4"/>}
                    {submitButtonText}
                </Button>
            </div>
        </form>
    );
}