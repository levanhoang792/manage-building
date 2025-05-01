import {Button, Field, Input, Label} from '@headlessui/react';
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import {FloorQueryParams} from '@/hooks/floors/model';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {cn} from '@/lib/utils';

// Define the schema for filter form
const FilterSchema = z.object({
    search: z.string().optional(),
    status: z.string().optional(),
    sortBy: z.string().default('created_at'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Type for the form data
type FilterFormData = z.infer<typeof FilterSchema>;

interface FloorFilterProps {
    onFilter: (filters: FloorQueryParams) => void;
    initialFilters?: FloorQueryParams;
}

export default function FloorFilter({onFilter, initialFilters}: FloorFilterProps) {
    const defaultValues: FilterFormData = {
        search: initialFilters?.search || '',
        status: initialFilters?.status || '',
        sortBy: initialFilters?.sortBy || 'created_at',
        sortOrder: initialFilters?.sortOrder || 'desc',
    };

    const {control, handleSubmit, reset} = useForm<FilterFormData>({
        resolver: zodResolver(FilterSchema),
        defaultValues,
    });

    const onSubmit = (data: FilterFormData) => {
        onFilter(data);
    };

    const handleReset = () => {
        const resetFilters = {
            search: '',
            status: '',
            sortBy: 'created_at',
            sortOrder: 'desc' as const,
        };
        reset(resetFilters);
        onFilter(resetFilters);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Controller
                    control={control}
                    name="search"
                    render={({field}) => (
                        <Field>
                            <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                Search
                            </Label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                </div>
                                <Input
                                    {...field}
                                    id="search"
                                    type="text"
                                    className={cn(
                                        "focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                    )}
                                    placeholder="Search by name"
                                />
                            </div>
                        </Field>
                    )}
                />

                <Controller
                    control={control}
                    name="status"
                    render={({field}) => (
                        <Field>
                            <Label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </Label>
                            <select
                                {...field}
                                id="status"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </Field>
                    )}
                />

                <Controller
                    control={control}
                    name="sortBy"
                    render={({field}) => (
                        <Field>
                            <Label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                                Sort By
                            </Label>
                            <select
                                {...field}
                                id="sortBy"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="name">Name</option>
                                <option value="created_at">Created Date</option>
                                <option value="status">Status</option>
                            </select>
                        </Field>
                    )}
                />

                <Controller
                    control={control}
                    name="sortOrder"
                    render={({field}) => (
                        <Field>
                            <Label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                                Sort Order
                            </Label>
                            <select
                                {...field}
                                id="sortOrder"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </Field>
                    )}
                />
            </div>

            <div className="mt-4 flex justify-end space-x-3">
                <Button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Reset
                </Button>
                <Button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Apply Filters
                </Button>
            </div>
        </form>
    );
}