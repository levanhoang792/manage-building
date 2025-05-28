import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {cn} from "@/lib/utils";
import {Dialog} from "@headlessui/react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {ROUTES} from "@/routes/routes";
import {ArrowLeftIcon, DocumentTextIcon, BuildingOffice2Icon, MapIcon, XMarkIcon, ClockIcon} from '@heroicons/react/24/outline';
import {Door} from '@/hooks/doors/model';
import {DoorCoordinate} from '@/hooks/doorCoordinates/model';
import {useVirtualizer} from '@tanstack/react-virtual';
import {motion} from 'framer-motion';
import Spinner from '@/components/commons/Spinner';
import {ExclamationTriangleIcon} from '@heroicons/react/24/solid';
import type {Floor} from '@/hooks/floors/model';
import {toast} from 'sonner';
import {
    useGetGuestBuildingsInfinite,
    useGetGuestFloors,
    useGetGuestDoors,
    useGetGuestDoorCoordinates
} from '@/hooks/guest/useGuestData';
import {useCreateDoorRequest, useGetDoorRequestStatus} from '@/hooks/doorRequests/useDoorRequests';
import FloorPlanVisualizer from '../door/components/FloorPlanVisualizer';

interface GuestDoorRequestFormData {
    requesterName: string;
    requesterPhone: string;
    requesterEmail: string;
    purpose: string;
}

const FormSchema = z.object({
    requesterName: z.string().nonempty("Name is required"),
    requesterPhone: z.string().nonempty("Phone number is required"),
    requesterEmail: z.string().email("Invalid email format").optional().or(z.literal('')),
    purpose: z.string().nonempty("Purpose is required")
});

// Helper function to format current time
const getCurrentTimeString = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

// Helper function to format current date
const getCurrentDateString = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
};

interface DoorStatusProps {
    buildingId: string;
    floorId: string;
    doorId: string;
}

const DoorRequestStatus: React.FC<DoorStatusProps> = ({buildingId, floorId, doorId}) => {
    const {data: statusData, isLoading} = useGetDoorRequestStatus(buildingId, floorId, doorId);

    if (isLoading) return null;

    if (!statusData?.data?.hasPendingRequest) return null;

    return (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-yellow-50 border border-yellow-200 rounded-md px-2 py-1 shadow-sm">
            <div className="flex items-center gap-1 text-xs text-yellow-800">
                <ClockIcon className="h-3 w-3" />
                <span>Đang chờ duyệt</span>
                {statusData.data.requestDetails && (
                    <span className="ml-1">
                        - {statusData.data.requestDetails.requester_name}
                    </span>
                )}
            </div>
        </div>
    );
};

// Add MemoizedFloorPlanVisualizer before the GuestDoorRequest component
const MemoizedFloorPlanVisualizer = React.memo(FloorPlanVisualizer, (prevProps, nextProps) => {
    // Check primitive props first
    if (
        prevProps.floorPlanImage !== nextProps.floorPlanImage ||
        prevProps.buildingId !== nextProps.buildingId ||
        prevProps.floorId !== nextProps.floorId ||
        prevProps.onDoorSelect !== nextProps.onDoorSelect
    ) {
        return false;
    }

    // Check doors array length first
    if (prevProps.doors.length !== nextProps.doors.length) {
        return false;
    }

    // Check door coordinates array length
    const prevCoordinates = prevProps.doorCoordinates || [];
    const nextCoordinates = nextProps.doorCoordinates || [];
    
    if (prevCoordinates.length !== nextCoordinates.length) {
        return false;
    }

    // Deep compare doors only if needed
    const doorsChanged = prevProps.doors.some((door, index) => {
        const nextDoor = nextProps.doors[index];
        return (
            door.id !== nextDoor.id ||
            door.name !== nextDoor.name ||
            door.lock_status !== nextDoor.lock_status
        );
    });

    if (doorsChanged) {
        return false;
    }

    // Deep compare coordinates only if needed
    const coordinatesChanged = prevCoordinates.some((item, index) => {
        const nextItem = nextCoordinates[index];
        if (item.door.id !== nextItem.door.id) {
            return true;
        }
        if (item.coordinates.length !== nextItem.coordinates.length) {
            return true;
        }
        return item.coordinates.some((coord, coordIndex) => {
            const nextCoord = nextItem.coordinates[coordIndex];
            return (
                coord.x_coordinate !== nextCoord.x_coordinate ||
                coord.y_coordinate !== nextCoord.y_coordinate
            );
        });
    });

    return !coordinatesChanged;
});

function GuestDoorRequest() {
    const navigate = useNavigate();
    const {id: buildingIdParam, floorId: floorIdParam} = useParams<{ id: string; floorId: string }>();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedBuildingId, setSelectedBuildingId] = useState<string>('');
    const [selectedFloorId, setSelectedFloorId] = useState<string>('');
    const [selectedDoor, setSelectedDoor] = useState<Door | null>(null);
    const [floors, setFloors] = useState<Floor[]>([]);
    const [doorCoordinates, setDoorCoordinates] = useState<{ door: Door, coordinates: DoorCoordinate[] }[]>([]);
    const [showPurposeWarning] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // References for virtualization
    const buildingListRef = useRef<HTMLDivElement>(null);

    const {handleSubmit, formState: {errors}, register} = useForm<GuestDoorRequestFormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            requesterName: "",
            requesterPhone: "",
            requesterEmail: "",
            purpose: `Yêu cầu mở cửa - Thời gian: ${getCurrentTimeString()} ${getCurrentDateString()}`
        }
    });

    // Add createDoorRequest mutation
    const createDoorRequestMutation = useCreateDoorRequest();

    // Fetch buildings data
    const {
        data: buildingsData,
        fetchNextPage: fetchNextBuildings,
        hasNextPage: hasNextBuildings,
        isFetchingNextPage: isFetchingNextBuildings
    } = useGetGuestBuildingsInfinite({
        limit: 20
    });

    // Fetch floors data
    const {
        data: floorsData,
        isLoading: isLoadingFloors
    } = useGetGuestFloors(selectedBuildingId, {
        limit: 100
    });

    // Fetch doors data
    const {
        data: doorsData,
        isLoading: isLoadingDoors
    } = useGetGuestDoors(
        selectedBuildingId,
        selectedFloorId,
        {limit: 100}
    );

    // Fetch coordinates for all doors
    const doorIds = doorsData?.data?.data?.map(door => door.id.toString()) || [];
    const {
        data: doorCoordinatesData,
        isLoading: isLoadingCoordinates
    } = useGetGuestDoorCoordinates(selectedBuildingId, selectedFloorId, doorIds);

    // Get door request status
    useGetDoorRequestStatus(
        selectedBuildingId,
        selectedFloorId,
        selectedDoor?.id?.toString()
    );

    // Set floors data when it's loaded
    useEffect(() => {
        if (floorsData?.data) {
            if (floorsData.data.data && Array.isArray(floorsData.data.data)) {
                setFloors(floorsData.data.data);

                // Only set default floor if we have floors and no floor is selected
                if (!selectedFloorId && floorsData.data.data.length > 0) {
                    setSelectedFloorId(String(floorsData.data.data[0].id));
                }
            }
        }
    }, [floorsData, selectedFloorId]);

    // Update door coordinates when data changes
    useEffect(() => {
        // Skip if no building or floor selected
        if (!selectedBuildingId || !selectedFloorId) {
            if (doorCoordinates.length > 0) {
                setDoorCoordinates([]);
            }
            return;
        }

        // Skip if data is not ready
        if (!doorsData?.data?.data || !doorCoordinatesData) {
            return;
        }

        const doors = doorsData.data.data;
        const coordinates = doorCoordinatesData
            .map(item => {
                const door = doors.find(d => d.id === Number(item.doorId));
                const coordinateData = item.data;
                
                if (!door || !Array.isArray(coordinateData) || coordinateData.length === 0) {
                    return null;
                }

                return {
                    door,
                    coordinates: coordinateData
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);

        // Only update if coordinates have changed
        const newCoordinatesString = JSON.stringify(coordinates);
        const currentCoordinatesString = JSON.stringify(doorCoordinates);
        
        if (newCoordinatesString !== currentCoordinatesString) {
            setDoorCoordinates(coordinates);
        }
    }, [
        selectedBuildingId,
        selectedFloorId,
        doorsData?.data?.data,
        doorCoordinatesData
    ]);

    // Add debug log for render conditions
    useEffect(() => {
        if (selectedFloorId) {
            console.log('Render state:', {
                isLoadingDoors,
                isLoadingCoordinates,
                doorCoordinatesLength: doorCoordinates.length,
                selectedFloorId,
                floorPlanImage: floors.find(f => String(f.id) === selectedFloorId)?.floor_plan_image
            });
        }
    }, [isLoadingDoors, isLoadingCoordinates, doorCoordinates.length, selectedFloorId, floors]);

    const isLoading = isLoadingDoors || isLoadingCoordinates;
    const hasNoData = !doorsData?.data?.data || doorCoordinates.length === 0;

    // Combine all pages of buildings data
    const allBuildings = buildingsData?.pages.flatMap(page => page.data.data) || [];

    // Set up virtualizer for buildings
    useVirtualizer({
        count: hasNextBuildings ? allBuildings.length + 1 : allBuildings.length,
        getScrollElement: () => buildingListRef.current,
        estimateSize: () => 40,
        overscan: 5,
    });

    // Handle building scroll
    const handleBuildingScroll = () => {
        if (buildingListRef.current) {
            const {scrollHeight, scrollTop, clientHeight} = buildingListRef.current;
            if (scrollHeight - scrollTop - clientHeight < 100 && hasNextBuildings && !isFetchingNextBuildings) {
                fetchNextBuildings();
            }
        }
    };

    // Handle building selection
    const handleBuildingSelect = (buildingId: string) => {
        if (buildingId === selectedBuildingId) return;
        setSelectedBuildingId(buildingId);
        setSelectedFloorId('');
        setSelectedDoor(null);
        setDoorCoordinates([]); // Reset coordinates when building changes
    };

    // Handle floor selection
    const handleFloorSelect = (floorId: string) => {
        if (floorId === selectedFloorId) return;

        setSelectedFloorId(floorId);
        setSelectedDoor(null);
        setDoorCoordinates([]); // Reset coordinates when floor changes
    };

    // Handle door selection and open form
    const handleDoorSelect = useCallback((door: Door) => {
        // if (door.lock_status === 'open') {
        //     toast.warning(`Cửa ${door.name} đang mở`);
        //     return;
        // }

        setSelectedDoor(door);
        setIsFormOpen(true);
    }, []);

    const onSubmit = handleSubmit(async (data) => {
        if (!selectedDoor) {
            setSubmitError("Please select a door first");
            return;
        }

        setSubmitError(null);
        setIsSubmitting(true);
        
        try {
            const requestData = {
                door_id: selectedDoor.id,
                requester_name: data.requesterName,
                requester_phone: data.requesterPhone || undefined,
                requester_email: data.requesterEmail || undefined,
                purpose: data.purpose
            };

            await createDoorRequestMutation.mutateAsync(requestData);
            
            // Show success message
            toast.success('Yêu cầu đã được gửi thành công!', {
                description: 'Yêu cầu của bạn sẽ được xử lý bởi người quản lý. Vui lòng chờ phản hồi.'
            });

            // Close modal and reset form
            setIsFormOpen(false);
            
        } catch (err) {
            console.error('Error submitting request:', err);
            setSubmitError(err instanceof Error ? err.message : "Failed to submit request. Please try again.");
            toast.error('Có lỗi xảy ra', {
                description: err instanceof Error ? err.message : 'Không thể gửi yêu cầu. Vui lòng thử lại sau.'
            });
        } finally {
            setIsSubmitting(false);
        }
    });

    // Update URL when building or floor changes
    useEffect(() => {
        if (selectedBuildingId && selectedFloorId) {
            const url = ROUTES.GUEST_DOOR_REQUEST_BUILDING_FLOOR
                .replace(':id', selectedBuildingId)
                .replace(':floorId', selectedFloorId);
            navigate(url, {replace: true});
        } else if (selectedBuildingId) {
            const url = ROUTES.GUEST_DOOR_REQUEST_BUILDING
                .replace(':id', selectedBuildingId);
            navigate(url, {replace: true});
        }
    }, [selectedBuildingId, selectedFloorId, navigate]);

    // Initialize selected building and floor from URL params
    useEffect(() => {
        if (buildingIdParam) {
            setSelectedBuildingId(buildingIdParam);
        }
        if (floorIdParam) {
            setSelectedFloorId(floorIdParam);
        }
    }, [buildingIdParam, floorIdParam]);

    // Memoize values for FloorPlanVisualizer
    const memoizedFloorPlanImage = useMemo(() => {
        return floors.find(f => String(f.id) === selectedFloorId)?.floor_plan_image || '';
    }, [floors, selectedFloorId]);

    const memoizedDoors = useMemo(() => {
        return doorsData?.data?.data || [];
    }, [doorsData?.data?.data]);

    // Memoize the current floor
    const currentFloor = useMemo(() => {
        return floors.find(f => String(f.id) === selectedFloorId);
    }, [floors, selectedFloorId]);

    const isDataReady = !isLoading && !hasNoData && currentFloor;

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-white shadow-sm flex-shrink-0">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link
                                to={ROUTES.LOGIN}
                                className="mr-4 inline-flex items-center text-gray-500 hover:text-gray-700"
                            >
                                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                                Back to Login
                            </Link>
                            <h1 className="text-xl font-semibold text-gray-900">Guest Door Access Request</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col w-full">
                <div className="h-full w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4">
                    {/* Building Selection */}
                    <div className="h-[8.5rem] w-full flex flex-col overflow-visible group relative flex-shrink-0">
                        <h2 className="text-base font-medium text-gray-900 mb-1 flex items-center flex-shrink-0">
                            <BuildingOffice2Icon className="h-4 w-4 mr-1.5 text-indigo-600"/>
                            Select Building
                        </h2>
                        {/* Container mặc định hiển thị 1 hàng */}
                        <div className="flex-1 min-h-0 w-full bg-white rounded-lg">
                            <div className="h-full w-full grid grid-cols-5 gap-4 py-2 px-4">
                                {allBuildings.slice(0, 5).map((building) => (
                                    <motion.div
                                        key={building.id}
                                        initial={{ scale: 0.98, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 20
                                        }}
                                        className={cn(
                                            'h-[90px] p-2 rounded-lg shadow-md cursor-pointer flex flex-col justify-between transition',
                                            selectedBuildingId === building.id.toString()
                                                ? 'bg-indigo-100 border border-indigo-500'
                                                : 'bg-white hover:bg-gray-50 border border-gray-200'
                                        )}
                                        onClick={() => handleBuildingSelect(building.id.toString())}
                                    >
                                        <div>
                                            <div className="flex items-center overflow-hidden gap-1.5">
                                                <BuildingOffice2Icon className={cn(
                                                    'h-4 w-4 flex-shrink-0',
                                                    building.status === 'active' ? 'text-green-600' : 'text-red-600'
                                                )}/>
                                                <h3 className="font-medium text-sm text-gray-900 truncate">{building.name}</h3>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 truncate pl-5.5">{building.address}</p>
                                        </div>
                                        <div
                                            className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium w-fit",
                                                building.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            )}
                                        >
                                            {building.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Popup container khi hover */}
                        {allBuildings.length > 5 && (
                            <div
                                className="absolute left-0 right-0 top-full z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform -translate-y-2 group-hover:translate-y-0 bg-white rounded-lg shadow-xl border border-gray-200 mt-2">
                                <div
                                    className="overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                                    style={{
                                        maxHeight: 'min(calc(100vh - 350px), 400px)',
                                        overflowY: 'auto',
                                        overscrollBehavior: 'contain'
                                    }}
                                    ref={buildingListRef}
                                    onScroll={handleBuildingScroll}
                                >
                                    <div className="grid grid-cols-5 gap-3 auto-rows-[100px]">
                                        {allBuildings.slice(5).map((building) => (
                                            <motion.div
                                                key={building.id}
                                                initial={{ scale: 0.98, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 20
                                                }}
                                                className={cn(
                                                    'p-2 rounded-lg shadow-sm cursor-pointer flex flex-col justify-between transition',
                                                    selectedBuildingId === building.id.toString()
                                                        ? 'bg-indigo-100 border border-indigo-500'
                                                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                                                )}
                                                onClick={() => handleBuildingSelect(building.id.toString())}
                                            >
                                                <div>
                                                    <div className="flex items-center overflow-hidden gap-1">
                                                        <BuildingOffice2Icon className={cn(
                                                            'h-4 w-4 flex-shrink-0',
                                                            building.status === 'active' ? 'text-green-600' : 'text-red-600'
                                                        )}/>
                                                        <h3 className="font-medium text-xs text-gray-900 truncate">
                                                            {building.name}
                                                        </h3>
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 mt-0.5 truncate pl-5">{building.address}</p>
                                                </div>
                                                <div
                                                    className={cn(
                                                        'mt-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium w-fit',
                                                        building.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    )}>
                                                    {building.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Floor and Door Selection */}
                    <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
                        {/* Floor List */}
                        <div className="col-span-3 bg-white rounded-lg shadow overflow-hidden flex flex-col">
                            <div className="p-4 flex-shrink-0">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <MapIcon className="h-5 w-5 mr-2 text-indigo-600" />
                                    Select Floor
                                </h2>
                            </div>
                            <div className="flex-1 px-4 pb-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
                                {!selectedBuildingId ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                        <BuildingOffice2Icon className="h-12 w-12 text-gray-400 mb-4" />
                                        <p className="text-gray-500">Please select a building first</p>
                                    </div>
                                ) : isLoadingFloors ? (
                                    <div className="h-full flex justify-center items-center">
                                        <Spinner className="h-6 w-6 text-indigo-600" />
                                    </div>
                                ) : floors.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                        <MapIcon className="h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-gray-500">No floors available</p>
                                    </div>
                                ) : (
                                    floors.map((floor) => (
                                        <motion.div
                                            key={floor.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(
                                                'p-3 rounded-lg cursor-pointer transition-all',
                                                selectedFloorId === floor.id.toString()
                                                    ? 'bg-indigo-50 border-2 border-indigo-500'
                                                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                            )}
                                            onClick={() => handleFloorSelect(floor.id.toString())}
                                        >
                                            <h3 className="font-medium text-gray-900 truncate">{floor.name}</h3>
                                            <p className="text-sm text-gray-500 truncate">{floor.description}</p>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Floor Plan */}
                        <div className="col-span-9 bg-white rounded-lg shadow overflow-hidden flex flex-col">
                            <div className="p-2 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-4 text-xs">
                                        <div className="flex items-center">
                                            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                                            <span>Đang mở</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                                            <span>Đang đóng</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                                            <span>Chưa xác định</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                {!selectedFloorId ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                        <MapIcon className="h-12 w-12 text-gray-400 mb-4"/>
                                        <p className="text-gray-500 text-lg mb-2">Chọn tầng để xem sơ đồ</p>
                                    </div>
                                ) : isLoading ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="text-center">
                                            <Spinner className="h-8 w-8 text-indigo-600 mx-auto"/>
                                            <p className="mt-2 text-sm text-gray-500">Đang tải thông tin cửa và tọa độ...</p>
                                        </div>
                                    </div>
                                ) : !isDataReady ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="text-center max-w-sm mx-auto">
                                            <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Chưa có thông tin cửa
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Tầng này chưa có thông tin cửa hoặc tọa độ. Vui lòng liên hệ quản trị viên.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full relative">
                                        <div className="absolute inset-0">
                                            <MemoizedFloorPlanVisualizer
                                                floorPlanImage={memoizedFloorPlanImage}
                                                doors={memoizedDoors}
                                                onDoorSelect={handleDoorSelect}
                                                doorCoordinates={doorCoordinates}
                                                buildingId={selectedBuildingId}
                                                floorId={selectedFloorId}
                                            />
                                            {doorCoordinates.map(({door, coordinates}) => {
                                                if (!coordinates || coordinates.length === 0) return null;
                                                const firstCoordinate = coordinates[0];
                                                if (!firstCoordinate?.x_coordinate || !firstCoordinate?.y_coordinate) return null;

                                                return (
                                                    <div
                                                        key={`status-${door.id}`}
                                                        className="absolute"
                                                        style={{
                                                            left: `${firstCoordinate.x_coordinate}%`,
                                                            top: `${firstCoordinate.y_coordinate}%`,
                                                            transform: 'translate(-50%, -50%)'
                                                        }}
                                                    >
                                                        <DoorRequestStatus
                                                            buildingId={selectedBuildingId}
                                                            floorId={selectedFloorId}
                                                            doorId={door.id.toString()}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Form Modal */}
            <Dialog
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                className="fixed inset-0 z-10 overflow-y-auto"
            >
                <div className="flex min-h-screen items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" aria-hidden="true" />

                    <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                        {/* Header */}
                        <Dialog.Title
                            as="h3"
                            className="text-lg font-semibold leading-6 text-gray-900 flex items-center border-b border-gray-200 p-6"
                        >
                            <DocumentTextIcon className="h-5 w-5 text-indigo-600 mr-2"/>
                            Door Access Request
                            <button
                                type="button"
                                className="ml-auto text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full p-1 transition-colors"
                                onClick={() => setIsFormOpen(false)}
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </Dialog.Title>

                        {/* Form Content */}
                        <div className="p-6">
                            {submitError && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 mb-6">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
                                    <p className="text-sm text-red-700">{submitError}</p>
                                </div>
                            )}

                            {selectedDoor && (
                                <div className="bg-indigo-50 rounded-lg p-3 mb-6">
                                    <p className="text-sm text-indigo-700 flex items-center">
                                        <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
                                        Selected Door: <span className="font-medium ml-1">{selectedDoor.name}</span>
                                    </p>
                                </div>
                            )}

                            <form onSubmit={onSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="requesterName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="requesterName"
                                            {...register('requesterName')}
                                            className={cn(
                                                "block w-full rounded-md border-0 py-2.5 px-3",
                                                "text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",
                                                "placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600",
                                                "sm:text-sm sm:leading-6 transition-all duration-200"
                                            )}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.requesterName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.requesterName.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="requesterPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="requesterPhone"
                                            {...register('requesterPhone')}
                                            className={cn(
                                                "block w-full rounded-md border-0 py-2.5 px-3",
                                                "text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",
                                                "placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600",
                                                "sm:text-sm sm:leading-6 transition-all duration-200"
                                            )}
                                            placeholder="Enter your phone number"
                                        />
                                        {errors.requesterPhone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.requesterPhone.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="requesterEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email <span className="text-gray-400">(Optional)</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="requesterEmail"
                                            {...register('requesterEmail')}
                                            className={cn(
                                                "block w-full rounded-md border-0 py-2.5 px-3",
                                                "text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",
                                                "placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600",
                                                "sm:text-sm sm:leading-6 transition-all duration-200"
                                            )}
                                            placeholder="Enter your email"
                                        />
                                        {errors.requesterEmail && (
                                            <p className="mt-1 text-sm text-red-600">{errors.requesterEmail.message}</p>
                                        )}
                                        <p className="mt-1 text-sm text-gray-500">
                                            Used for notifications
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                                        Purpose <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            id="purpose"
                                            {...register('purpose')}
                                            rows={3}
                                            className={cn(
                                                "block w-full rounded-md border-0 py-2.5 px-3",
                                                "text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",
                                                "placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600",
                                                "sm:text-sm sm:leading-6 transition-all duration-200",
                                                showPurposeWarning && "pr-12"
                                            )}
                                            placeholder="Please describe your purpose for requesting door access..."
                                        />
                                        {showPurposeWarning && (
                                            <div className="absolute right-2 top-2">
                                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                                            </div>
                                        )}
                                    </div>
                                    {errors.purpose && (
                                        <p className="mt-1 text-sm text-red-600">{errors.purpose.message}</p>
                                    )}
                                    {showPurposeWarning && (
                                        <p className="mt-1 text-sm text-yellow-600 flex items-center gap-1">
                                            <ExclamationTriangleIcon className="h-4 w-4 inline flex-shrink-0" />
                                            Please provide more details about your door access request
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className={cn(
                                        "inline-flex justify-center rounded-md px-4 py-2.5",
                                        "text-sm font-semibold text-gray-900 bg-white",
                                        "border border-gray-300 hover:bg-gray-50",
                                        "focus:outline-none focus:ring-2 focus:ring-gray-500",
                                        "transition-all duration-200"
                                    )}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={() => document.querySelector('form')?.requestSubmit()}
                                    disabled={isSubmitting || !selectedDoor}
                                    className={cn(
                                        "inline-flex justify-center rounded-md px-4 py-2.5",
                                        "text-sm font-semibold text-white bg-indigo-600",
                                        "hover:bg-indigo-500 focus:outline-none",
                                        "focus:ring-2 focus:ring-indigo-600",
                                        "transition-all duration-200",
                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center space-x-2">
                                            <Spinner className="h-4 w-4" />
                                            <span>Submitting...</span>
                                        </span>
                                    ) : (
                                        'Submit Request'
                                    )}
                                </button>
                            </div>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}

export default GuestDoorRequest; 