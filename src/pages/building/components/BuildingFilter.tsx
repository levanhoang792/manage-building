import {useEffect, useState} from 'react';
import {ArrowsUpDownIcon, FunnelIcon, MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import {Button} from '@headlessui/react';
import {cn} from '@/lib/utils';
import {BuildingQueryParams} from '@/hooks/buildings/model';

interface BuildingFilterProps {
    onFilterChange: (filters: Partial<BuildingQueryParams>) => void;
}

export default function BuildingFilter({onFilterChange}: BuildingFilterProps) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

    // Apply filters when search input changes (with debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange({search});
        }, 500);

        return () => clearTimeout(timer);
    }, [search, onFilterChange]);

    // Handle status change
    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        onFilterChange({status: newStatus || undefined});
    };

    // Handle sort change
    const handleSortChange = (field: string) => {
        if (sortBy === field) {
            // Toggle sort order if clicking the same field
            const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            setSortOrder(newOrder);
            onFilterChange({sortOrder: newOrder});
        } else {
            // Set new sort field with default desc order
            setSortBy(field);
            setSortOrder('desc');
            onFilterChange({sortBy: field, sortOrder: 'desc'});
        }
    };

    // Reset all filters
    const handleResetFilters = () => {
        setSearch('');
        setStatus('');
        setSortBy('created_at');
        setSortOrder('desc');
        onFilterChange({
            search: '',
            status: undefined,
            sortBy: 'created_at',
            sortOrder: 'desc',
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search input */}
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search buildings by name or address..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                {/* Advanced filter toggle */}
                <Button
                    onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
                    className={cn(
                        "inline-flex items-center gap-2 rounded-md py-2 px-4",
                        "transition-all focus:outline-none",
                        isAdvancedFilterOpen
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    )}
                >
                    <FunnelIcon className="h-5 w-5"/>
                    Filters
                </Button>

                {/* Reset filters */}
                <Button
                    onClick={handleResetFilters}
                    className={cn(
                        "inline-flex items-center gap-2 rounded-md bg-red-100 py-2 px-4 text-red-700",
                        "transition-all focus:outline-none hover:bg-red-200"
                    )}
                >
                    Reset
                </Button>
            </div>

            {/* Advanced filters */}
            {isAdvancedFilterOpen && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    {/* Status filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Sort by filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option value="name">Name</option>
                                <option value="address">Address</option>
                                <option value="status">Status</option>
                                <option value="created_at">Created Date</option>
                                <option value="updated_at">Updated Date</option>
                            </select>
                        </div>
                    </div>

                    {/* Sort order */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                        <Button
                            onClick={() => {
                                const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                                setSortOrder(newOrder);
                                onFilterChange({sortOrder: newOrder});
                            }}
                            className={cn(
                                "inline-flex items-center gap-2 rounded-md py-2 px-4 w-full justify-between",
                                "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                            <ArrowsUpDownIcon className="h-5 w-5"/>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}