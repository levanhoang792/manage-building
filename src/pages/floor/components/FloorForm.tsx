import {useEffect, useRef, useState} from 'react';
import {Floor, FloorFormData} from '@/hooks/floors/model';
import {Button, Field, Input, Label, Textarea} from '@headlessui/react';
import ErrorMessage from '@/components/commons/ErrorMessage';
import {ArrowLeftIcon, PhotoIcon} from '@heroicons/react/24/outline';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {cn} from '@/lib/utils';
import FieldError from '@/components/FieldError';

// Create a schema for form validation
const FormSchema: z.ZodType<FloorFormData> = z.object({
    name: z.string().nonempty('Floor name is required'),
    floor_number: z.number()
        .positive('Floor number must be a positive number')
        .int('Floor number must be an integer'),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
});

interface FloorFormProps {
    initialData?: Floor;
    onSubmit: (data: FloorFormData) => void;
    isSubmitting: boolean;
    error?: string;
    buildingName?: string;
    onBack?: () => void;
    title?: string;
}

export default function FloorForm({
    initialData, 
    onSubmit, 
    isSubmitting, 
    error, 
    buildingName, 
    onBack,
    title = initialData ? 'Edit Floor' : 'Create Floor'
}: FloorFormProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {control, handleSubmit, formState: {errors}, reset} = useForm<FloorFormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: initialData?.name || '',
            floor_number: initialData?.floor_number || 1,
            description: initialData?.description || '',
            status: initialData?.status || 'active',
        },
    });

    // Update form values when initialData changes
    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                floor_number: initialData.floor_number,
                description: initialData.description || '',
                status: initialData.status,
            });

            // Set preview URL if floor plan image exists
            if (initialData.floor_plan_image) {
                setPreviewUrl(initialData.floor_plan_image);
            }
        }
    }, [initialData, reset]);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            // Create preview URL for the selected file
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
        }
    };

    // Handle click on "Choose File" button
    const handleChooseFile = () => {
        fileInputRef.current?.click();
    };

    // Handle removing selected file
    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Form submission handler
    const onFormSubmit = (data: FloorFormData) => {
        // Add file to formData if selected
        if (selectedFile) {
            data.floorPlan = selectedFile;
        }
        onSubmit(data);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {onBack && (
                <div className="mb-6">
                    <Button
                        onClick={onBack}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <ArrowLeftIcon className="-ml-1 mr-1 h-4 w-4"/>
                        Back to Floors
                    </Button>
                </div>
            )}

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                        {buildingName && (
                            <p className="text-gray-600 mt-1">
                                Building: <span className="font-medium">{buildingName}</span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="px-6 py-5">
                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                        {error && <ErrorMessage error={{message: error, type: "API Response"}}/>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="space-y-6">
                                    <Controller
                                        control={control}
                                        name="name"
                                        render={({field}) => (
                                            <Field>
                                                <Label className="block text-sm font-medium text-gray-700">
                                                    Floor Name <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    className={cn(
                                                        "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                                                        errors.name && "border-red-500"
                                                    )}
                                                    placeholder="e.g., Floor 1, Ground Floor, etc."
                                                />
                                                <FieldError error={errors.name}/>
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        control={control}
                                        name="floor_number"
                                        render={({field}) => (
                                            <Field>
                                                <Label className="block text-sm font-medium text-gray-700">
                                                    Floor Number <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value);
                                                        field.onChange(isNaN(value) ? 0 : value);
                                                    }}
                                                    className={cn(
                                                        "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                                                        errors.floor_number && "border-red-500"
                                                    )}
                                                    min="1"
                                                    placeholder="e.g., 1, 2, 3, etc."
                                                />
                                                <FieldError error={errors.floor_number}/>
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        control={control}
                                        name="status"
                                        render={({field}) => (
                                            <Field>
                                                <Label className="block text-sm font-medium text-gray-700">
                                                    Status
                                                </Label>
                                                <select
                                                    {...field}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                                <FieldError error={errors.status}/>
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        control={control}
                                        name="description"
                                        render={({field}) => (
                                            <Field>
                                                <Label className="block text-sm font-medium text-gray-700">
                                                    Description
                                                </Label>
                                                <Textarea
                                                    {...field}
                                                    rows={3}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    placeholder="Enter floor description (optional)"
                                                />
                                                <FieldError error={errors.description}/>
                                            </Field>
                                        )}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Floor Plan Image</h3>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />

                                {previewUrl ? (
                                    <div className="border rounded-lg overflow-hidden relative">
                                        <img
                                            src={previewUrl}
                                            alt="Floor plan preview"
                                            className="w-full h-auto object-contain max-h-80"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                                            title="Remove image"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                                fill="currentColor">
                                                <path fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"/>
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={handleChooseFile}
                                        className="border border-dashed rounded-lg p-8 text-center text-gray-500 cursor-pointer hover:border-indigo-500"
                                    >
                                        <div className="space-y-1 text-center">
                                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400"/>
                                            <div className="flex justify-center text-sm text-gray-600">
                                                <label
                                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                                                    <span>Upload a file</span>
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-200 mt-8">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Saving...' : initialData ? 'Update Floor' : 'Create Floor'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}