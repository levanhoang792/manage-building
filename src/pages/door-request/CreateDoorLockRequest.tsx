import React, {Fragment, useEffect, useMemo, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {ArrowLeftIcon, BuildingOffice2Icon, DocumentTextIcon, MapIcon} from '@heroicons/react/24/outline';
import {useGetBuildingsInfinite} from '@/hooks/buildings';
import {useGetFloors} from '@/hooks/floors';
import {useGetDoors} from '@/hooks/doors';
import {Door} from '@/hooks/doors/model';
import {DoorCoordinate} from '@/hooks/doorCoordinates/model';
import {useGetMultipleDoorCoordinates} from '@/hooks/doorCoordinates/useDoorCoordinates';
import {ROUTES} from '@/routes/routes';
import {toast} from 'sonner';
import Spinner from '@/components/commons/Spinner';
import FloorPlanVisualizer from '../door/components/FloorPlanVisualizer';
import {useVirtualizer} from '@tanstack/react-virtual';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Field,
    Input,
    Label,
    Textarea,
    Transition,
    TransitionChild
} from '@headlessui/react';
import {useCreateDoorRequest} from "@/hooks/doorRequests/useDoorRequests";
import {DoorRequestFormData} from "@/hooks/doorRequests/model";
import {AnimatePresence, motion} from 'framer-motion';
import {cn} from "@/lib/utils";
import type {Floor} from '@/hooks/floors/model';
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import FieldError from "@/components/FieldError.tsx";

type FormData = {
    requesterName: string;
    requesterPhone: string;
    requesterEmail: string;
    purpose: string;
}

const Schema: z.ZodType<FormData> = z.object({
    requesterName: z.string().nonempty("Request name is required"),
    requesterPhone: z.string(),
    requesterEmail: z.string(),
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

const CreateDoorLockRequest: React.FC = () => {
    const navigate = useNavigate();
    const {id: buildingIdParam, floorId: floorIdParam} = useParams<{ id: string; floorId: string }>();
    const authUser = useSelector((state: RootState) => state.auth.user);

    // State for buildings
    const [selectedBuildingId, setSelectedBuildingId] = useState<string>(buildingIdParam || '');

    // State for floors and doors
    const [floors, setFloors] = useState<Floor[]>([]);
    const [selectedFloorId, setSelectedFloorId] = useState<string>(floorIdParam || '');
    const [selectedDoor, setSelectedDoor] = useState<Door | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPurposeWarning, setShowPurposeWarning] = useState(!authUser);
    const [doorCoordinates, setDoorCoordinates] = useState<{ door: Door, coordinates: DoorCoordinate[] }[]>([]);

    const {control, handleSubmit, formState: {errors}, reset} = useForm<FormData>({
        resolver: zodResolver(Schema),
        defaultValues: {
            requesterName: "",
            requesterPhone: "",
            requesterEmail: "",
            purpose: ""
        }
    });

    console.log("authUser: ", authUser)

    useEffect(() => {
        if (authUser) {
            reset({
                requesterName: authUser.user?.fullName || '',
                requesterPhone: "",
                requesterEmail: authUser.user?.email || '',
                purpose: `Yêu cầu mở cửa - Thời gian: ${getCurrentTimeString()} ${getCurrentDateString()} - ${authUser.user?.email}`
            })
            setShowPurposeWarning(false);
        } else {
            reset({
                requesterName: '',
                requesterPhone: "",
                requesterEmail: '',
                purpose: `Yêu cầu mở cửa - Thời gian: ${getCurrentTimeString()} ${getCurrentDateString()}`
            })
            setShowPurposeWarning(true);
        }
    }, [authUser, reset]);

    // // Add effect to update purpose when auth state changes
    // useEffect(() => {
    //     if (authUser) {
    //         setFormData(prev => ({
    //             ...prev,
    //             requesterName: authUser.user.fullName || prev.requesterName,
    //             requesterEmail: authUser.user.email || prev.requesterEmail,
    //             purpose: `Yêu cầu mở cửa - Thời gian: ${getCurrentTimeString()} ${getCurrentDateString()} - ${authUser.user.fullName}`
    //         }));
    //     } else {
    //     }
    // }, [authUser]);

    // References for virtualization
    const buildingListRef = useRef<HTMLDivElement>(null);

    // Fetch buildings data
    const {
        data: buildingsData,
        fetchNextPage: fetchNextBuildings,
        hasNextPage: hasNextBuildings,
        isFetchingNextPage: isFetchingNextBuildings
    } = useGetBuildingsInfinite({
        limit: 20
    });

    // Fetch floors data
    const {
        data: floorsData,
        isLoading: isLoadingFloors
    } = useGetFloors(selectedBuildingId, {
        limit: 100
    });

    // Fetch doors data
    const {
        data: doorsData,
        isLoading: isLoadingDoors
    } = useGetDoors(
        selectedBuildingId,
        selectedFloorId,
        {limit: 100}
    );

    // Fetch coordinates for all doors
    const doorIds = doorsData?.data?.data?.map(door => door.id.toString()) || [];
    console.log('Door IDs to fetch coordinates:', doorIds);

    const {
        data: doorCoordinatesData,
        isLoading: isLoadingCoordinates
    } = useGetMultipleDoorCoordinates(selectedBuildingId, selectedFloorId, doorIds);

    // Update door coordinates when data changes
    useEffect(() => {
        console.log('Raw doors data:', doorsData?.data?.data);
        console.log('Raw coordinates data:', doorCoordinatesData);

        if (!doorCoordinatesData || !doorsData?.data?.data) {
            console.log('No data available - coordinates or doors missing');
            setDoorCoordinates([]);
            return;
        }

        const doors = doorsData.data.data;
        console.log('Processing doors:', doors);

        const coordinates = doorCoordinatesData
            .filter((item) => {
                // Log the entire item structure
                console.log('Processing coordinate item:', JSON.stringify(item, null, 2));

                // Check if we have valid coordinate data
                const coordinateData = item.data?.data?.data || item.data?.data;
                const hasValidData = coordinateData && Array.isArray(coordinateData) && coordinateData.length > 0;

                console.log(`Door ${item.doorId} coordinates:`, {
                    hasValidData,
                    coordinateData
                });

                return hasValidData;
            })
            .map((item) => {
                const door = doors.find(d => d.id === Number(item.doorId));
                console.log(`Mapping door ${item.doorId}:`, {
                    doorFound: !!door,
                    door,
                    coordinates: item.data?.data?.data || item.data?.data
                });

                if (!door) return null;

                return {
                    door,
                    coordinates: item.data?.data?.data || item.data?.data
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);

        console.log('Final processed coordinates:', coordinates);
        setDoorCoordinates(coordinates);
    }, [doorCoordinatesData, doorsData]);

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

    // Set floors data when it's loaded
    useEffect(() => {
        if (floorsData?.data) {
            if (floorsData.data.data && Array.isArray(floorsData.data.data)) {
                setFloors(floorsData.data.data);

                // Select the first floor by default if none is selected
                if (!selectedFloorId && floorsData.data.data.length > 0) {
                    const firstFloorId = String(floorsData.data.data[0].id);
                    setSelectedFloorId(firstFloorId);
                }
            }
        }
    }, [floorsData, selectedFloorId]);

    // Handle building selection
    const handleBuildingSelect = (buildingId: string) => {
        if (buildingId === selectedBuildingId) return;

        const buildingName = allBuildings.find(b => String(b.id) === buildingId)?.name || buildingId;
        setSelectedBuildingId(buildingId);
        setSelectedFloorId('');
        setSelectedDoor(null);
        toast.success(`Đã chọn tòa nhà: ${buildingName}`);
    };

    // Handle floor selection
    const handleFloorSelect = (floorId: string) => {
        if (floorId === selectedFloorId) return;

        setSelectedFloorId(floorId);
        setSelectedDoor(null);
        const floorName = floors.find(f => String(f.id) === floorId)?.name || floorId;
        toast.success(`Đã chọn tầng ${floorName}`);
    };

    // Get selected floor details
    const selectedFloor = floorsData?.data?.data?.find(
        (floor) => floor.id.toString() === selectedFloorId
    );

    // Log để debug
    console.log('CreateDoorLockRequest - selectedBuildingId:', selectedBuildingId);
    console.log('CreateDoorLockRequest - selectedFloorId:', selectedFloorId);
    console.log('CreateDoorLockRequest - selectedFloor:', selectedFloor);

    // Mutation for creating door request
    const createDoorRequestMutation = useCreateDoorRequest();

    // Update URL when building or floor changes
    useEffect(() => {
        if (selectedBuildingId && selectedFloorId) {
            navigate(`/buildings/${selectedBuildingId}/floors/${selectedFloorId}/door-request`, {replace: true});
        } else if (selectedBuildingId) {
            navigate(`/buildings/${selectedBuildingId}/door-request`, {replace: true});
        }
    }, [selectedBuildingId, selectedFloorId, navigate]);

    // Handle door selection
    const handleDoorSelect = (door: Door) => {
        if (!door || !door.id) {
            toast.error('Không thể chọn cửa. Dữ liệu cửa không hợp lệ.');
            return;
        }

        setSelectedDoor(door);
        if (door.lock_status) {
            toast.info(`Cửa "${door.name}" hiện đang ${door.lock_status === 'open' ? 'mở' : 'đóng'}`);
        } else {
            toast.info(`Cửa "${door.name}" chưa có trạng thái`);
        }
        setIsModalOpen(true);
    };

    // // Handle form input changes
    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    //     const {name, value} = e.target;
    //
    //     if (name === 'purpose' && !authUser) {
    //         // For unauthenticated users, always ensure the time template is present
    //         const timeTemplate = `Yêu cầu mở cửa - Thời gian: ${getCurrentTimeString()} ${getCurrentDateString()}`;
    //         if (!value.includes(timeTemplate)) {
    //             setFormData(prev => ({
    //                 ...prev,
    //                 [name]: timeTemplate
    //             }));
    //             return;
    //         }
    //     }
    //
    //     setFormData(prev => ({
    //         ...prev,
    //         [name]: value
    //     }));
    // };

    // Handle form submission
    const onSubmit = handleSubmit(async (formData) => {
        if (!selectedDoor) {
            toast.error('Vui lòng chọn cửa từ sơ đồ tầng');
            return;
        }

        try {
            const doorId = selectedDoor.id;

            // Validate required fields based on authentication status
            if (!authUser) {
                // For unauthenticated users, require name and phone
                if (!formData.requesterName || !formData.requesterPhone) {
                    toast.error('Vui lòng điền đầy đủ họ tên và số điện thoại');
                    return;
                }
            }

            // Validate purpose for all users
            if (!formData.purpose) {
                toast.error('Vui lòng điền mục đích yêu cầu');
                return;
            }

            const requestData: DoorRequestFormData = {
                door_id: doorId,
                requester_name: formData.requesterName || authUser?.user?.fullName || '',
                requester_phone: formData.requesterPhone || '',
                requester_email: formData.requesterEmail || authUser?.user?.email,
                purpose: formData.purpose
            };

            await createDoorRequestMutation.mutateAsync(requestData);

            // Hiển thị thông báo thành công với thêm thông tin
            toast.success(
                <div className="space-y-1">
                    <p>Yêu cầu đóng/mở cửa đã được gửi thành công</p>
                    <p className="text-sm text-gray-500">
                        Yêu cầu của bạn sẽ được xử lý bởi người quản lý. Vui lòng chờ phản hồi qua email.
                    </p>
                </div>
            );

            // Đóng modal
            setIsModalOpen(false);

            // Reset form data
            reset();

            // Reset selected door
            setSelectedDoor(null);

        } catch (error) {
            console.error('Error creating door request:', error);
            toast.error('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
        }
    })
    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //
    //     if (!selectedDoor) {
    //         toast.error('Vui lòng chọn cửa từ sơ đồ tầng');
    //         return;
    //     }
    //
    //     try {
    //         const doorId = selectedDoor.id;
    //
    //         // Validate required fields based on authentication status
    //         if (!authUser) {
    //             // For unauthenticated users, require name and phone
    //             if (!formData.requesterName || !formData.requesterPhone) {
    //                 toast.error('Vui lòng điền đầy đủ họ tên và số điện thoại');
    //                 return;
    //             }
    //         }
    //
    //         // Validate purpose for all users
    //         if (!formData.purpose) {
    //             toast.error('Vui lòng điền mục đích yêu cầu');
    //             return;
    //         }
    //
    //         const requestData: DoorRequestFormData = {
    //             door_id: doorId,
    //             requester_name: formData.requesterName || authUser?.user?.fullName || '',
    //             requester_phone: formData.requesterPhone || '',
    //             requester_email: formData.requesterEmail || authUser?.user?.email,
    //             purpose: formData.purpose
    //         };
    //
    //         await createDoorRequestMutation.mutateAsync(requestData);
    //
    //         // Hiển thị thông báo thành công với thêm thông tin
    //         toast.success(
    //             <div className="space-y-1">
    //                 <p>Yêu cầu đóng/mở cửa đã được gửi thành công</p>
    //                 <p className="text-sm text-gray-500">
    //                     Yêu cầu của bạn sẽ được xử lý bởi người quản lý. Vui lòng chờ phản hồi qua email.
    //                 </p>
    //             </div>
    //         );
    //
    //         // Đóng modal.   Stringee2024$$
    //         setIsModalOpen(false);
    //
    //         // Reset form data
    //         setFormData({
    //             requesterName: '',
    //             requesterEmail: '',
    //             requesterPhone: '',
    //             purpose: ''
    //         });
    //
    //         // Reset selected door
    //         setSelectedDoor(null);
    //
    //     } catch (error) {
    //         console.error('Error creating door request:', error);
    //         toast.error('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
    //     }
    // };

    const floorPlanVirtual = useMemo(() => (
        <FloorPlanVisualizer
            floorPlanImage={floors.find(f => String(f.id) === selectedFloorId)?.floor_plan_image || ''}
            doors={doorsData?.data?.data || []}
            onDoorSelect={handleDoorSelect}
            doorCoordinates={doorCoordinates}
        />
    ), [doorCoordinates, doorsData?.data?.data, floors, selectedFloorId])

    return (
        <div className="h-[calc(100vh-var(--header-height)-2rem)] flex flex-col p-4 gap-2">
            {/* Header section */}
            <div className="flex justify-between items-center h-12 flex-shrink-0">
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.DASHBOARD)}
                        className="mr-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <ArrowLeftIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/>
                        Quay lại
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Gửi yêu cầu đóng/mở cửa</h1>
                </div>
            </div>

            {/* Buildings row */}
            <div className="h-32 flex flex-col overflow-visible group relative flex-shrink-0">
                <h2 className="text-base font-medium text-gray-900 mb-1 flex items-center flex-shrink-0">
                    <BuildingOffice2Icon className="h-4 w-4 mr-1.5 text-indigo-600"/>
                    Tòa nhà
                </h2>
                {/* Container mặc định hiển thị 1 hàng */}
                <div className="flex-1 min-h-0 bg-white rounded-lg">
                    <div className="h-full grid grid-cols-5 gap-4 py-2 px-4">
                        {allBuildings.slice(0, 5).map((building) => (
                            <motion.div
                                key={building.id}
                                initial={{scale: 0.98, opacity: 0}}
                                animate={{scale: 1, opacity: 1}}
                                whileHover={{scale: 1.02}}
                                whileTap={{scale: 0.98}}
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
                                        initial={{scale: 0.98, opacity: 0}}
                                        animate={{scale: 1, opacity: 1}}
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 0.98}}
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

            {/* Main content */}
            <div className="flex-1 grid grid-cols-4 gap-3 min-h-0 overflow-hidden">
                {/* Floors list */}
                <div className="col-span-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-gray-200 flex-shrink-0">
                        <h2 className="text-base font-medium text-gray-900 flex items-center">
                            <MapIcon className="h-4 w-4 mr-1.5 text-indigo-600"/>
                            Danh sách tầng
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {selectedBuildingId
                                ? `Tòa nhà: ${allBuildings.find(b => b.id.toString() === selectedBuildingId)?.name}`
                                : 'Chọn tòa nhà để xem danh sách tầng'}
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        {isLoadingFloors ? (
                            <div className="flex justify-center items-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : floors.length > 0 ? (
                            <ul className="space-y-2">
                                {floors.map((floor, index) => (
                                    <motion.li
                                        key={floor.id}
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 0.98}}
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{duration: 0.3, delay: index * 0.05}}
                                        onClick={() => handleFloorSelect(String(floor.id))}
                                        className={cn(
                                            'p-2 rounded-md cursor-pointer shadow-sm',
                                            selectedFloorId === String(floor.id)
                                                ? 'bg-indigo-100 border border-indigo-500'
                                                : 'bg-gray-50 hover:bg-gray-100'
                                        )}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium text-gray-900 flex items-center">
                                                    <span
                                                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 mr-2 text-xs font-bold">
                                                        {index + 1}
                                                    </span>
                                                    {floor.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-0.5 ml-7">{floor.description || 'Không có mô tả'}</p>
                                            </div>
                                            <div
                                                className={cn(
                                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                                    floor.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                )}>
                                                {floor.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                            </div>
                                        </div>

                                        {selectedFloorId === String(floor.id) && (
                                            <motion.div
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                className="mt-2 ml-8 text-xs text-indigo-600 flex items-center"
                                            >
                                                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-1"></span>
                                                Đang hiển thị
                                            </motion.div>
                                        )}
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-500">
                                    {selectedBuildingId
                                        ? 'Không có tầng nào trong tòa nhà này'
                                        : 'Chọn tòa nhà để xem danh sách tầng'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Floor visualizer */}
                <div className="col-span-3 h-full">
                    <AnimatePresence mode="wait">
                        {selectedFloorId && selectedBuildingId ? (
                            <motion.div
                                key={selectedFloorId}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -20}}
                                transition={{duration: 0.3}}
                                className="bg-white rounded-lg shadow-md h-full flex flex-col"
                            >
                                <div
                                    className="p-2 border-b border-gray-200 bg-indigo-50 flex-shrink-0 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <MapIcon className="h-4 w-4 text-indigo-600 mr-1.5"/>
                                        <h3 className="text-base font-medium text-gray-900">
                                            {floors.find(f => String(f.id) === selectedFloorId)?.name}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-hidden">
                                    {isLoadingDoors || isLoadingCoordinates ? (
                                        <div className="flex-1 flex items-center justify-center">
                                            <div className="text-center">
                                                <Spinner className="h-8 w-8 text-indigo-600 mx-auto"/>
                                                <p className="mt-2 text-sm text-gray-500">Đang tải thông tin cửa và tọa
                                                    độ...</p>
                                            </div>
                                        </div>
                                    ) : doorCoordinates.length === 0 ? (
                                        <div className="flex-1 flex items-center justify-center">
                                            <div className="text-center max-w-sm mx-auto">
                                                <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                    Chưa có tọa độ cửa
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Tầng này chưa có tọa độ cửa nào được thiết lập. Vui lòng liên hệ
                                                    quản trị viên để thêm tọa độ cửa.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full relative">
                                            <div className="absolute inset-0">
                                                {floorPlanVirtual}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.5}}
                                className="flex flex-col justify-center items-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 h-full"
                            >
                                <motion.div
                                    initial={{scale: 0.8}}
                                    animate={{scale: 1}}
                                    transition={{
                                        duration: 0.5,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                >
                                    <MapIcon className="h-16 w-16 text-gray-400 mb-4"/>
                                </motion.div>
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                                        {selectedBuildingId
                                            ? 'Chọn tầng để xem sơ đồ'
                                            : 'Chọn tòa nhà và tầng để xem sơ đồ'}
                                    </h3>
                                    <p className="text-gray-500">
                                        {selectedBuildingId
                                            ? 'Chọn một tầng từ danh sách bên trái để xem sơ đồ và trạng thái cửa'
                                            : 'Chọn một tòa nhà để bắt đầu'}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Door request modal */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm"/>
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel
                                    className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                                >
                                    <DialogTitle
                                        as="h3"
                                        className="text-lg font-semibold leading-6 text-gray-900 flex items-center border-b border-gray-200 pb-3"
                                    >
                                        <DocumentTextIcon className="h-5 w-5 text-indigo-600 mr-2"/>
                                        Gửi yêu cầu đóng/mở cửa
                                    </DialogTitle>

                                    <div className="mt-3">
                                        <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                                            <p className="text-sm text-indigo-700 flex items-center">
                                                <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
                                                Bạn đang gửi yêu cầu cho cửa: <span
                                                className="font-medium ml-1">{selectedDoor?.name}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <form onSubmit={onSubmit} className="mt-4 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Controller
                                                control={control}
                                                name="requesterName"
                                                render={({field}) => (
                                                    <Field>
                                                        <Label className="text-sm/6 font-medium">
                                                            Họ tên người yêu cầu
                                                            <span className="text-red-500">*</span>
                                                        </Label>
                                                        <div className={cn("relative mt-2")}>
                                                            <Input
                                                                {...field}
                                                                placeholder="Nhập họ tên người yêu cầu"
                                                                className={cn(
                                                                    "shadow appearance-none border rounded w-full py-2 px-3",
                                                                    "text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                )}
                                                            />
                                                        </div>
                                                        <FieldError error={errors.requesterName}/>
                                                    </Field>
                                                )}
                                            />

                                            <Controller
                                                control={control}
                                                name="requesterEmail"
                                                render={({field}) => (
                                                    <Field>
                                                        <Label className="text-sm/6 font-medium">
                                                            Email
                                                        </Label>
                                                        <div className={cn("relative mt-2")}>
                                                            <Input
                                                                {...field}
                                                                placeholder="Email"
                                                                className={cn(
                                                                    "shadow appearance-none border rounded w-full py-2 px-3",
                                                                    "text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                )}
                                                            />
                                                        </div>
                                                        <FieldError error={errors.requesterEmail}/>
                                                    </Field>
                                                )}
                                            />

                                            <Controller
                                                control={control}
                                                name="requesterPhone"
                                                render={({field}) => (
                                                    <Field>
                                                        <Label className="text-sm/6 font-medium">
                                                            Số điện thoại
                                                        </Label>
                                                        <div className={cn("relative mt-2")}>
                                                            <Input
                                                                {...field}
                                                                type="tel"
                                                                placeholder="Số điện thoại"
                                                                className={cn(
                                                                    "shadow appearance-none border rounded w-full py-2 px-3",
                                                                    "text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                )}
                                                            />
                                                        </div>
                                                        <FieldError error={errors.requesterPhone}/>
                                                    </Field>
                                                )}
                                            />
                                        </div>


                                        <Controller
                                            control={control}
                                            name="purpose"
                                            render={({field}) => (
                                                <Field>
                                                    <Label className="text-sm/6 font-medium">
                                                        Mục đích <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className={cn("relative mt-2")}>
                                                        <Textarea
                                                            {...field}
                                                            rows={5}
                                                            placeholder="Nhập mục đích yêu cầu đóng/mở cửa..."
                                                            className={cn(
                                                                "shadow appearance-none border rounded w-full py-2 px-3",
                                                                "text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                            )}
                                                        />
                                                    </div>
                                                    <FieldError error={errors.purpose}/>
                                                </Field>
                                            )}
                                        />

                                        <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className={cn(
                                                    "inline-flex justify-center rounded-md px-4 py-2.5",
                                                    "text-sm font-semibold text-gray-900 bg-white",
                                                    "border border-gray-300 hover:bg-gray-50",
                                                    "focus:outline-none focus:ring-2 focus:ring-gray-500",
                                                    "transition-all duration-200"
                                                )}
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                className={cn(
                                                    "inline-flex justify-center rounded-md px-4 py-2.5",
                                                    "text-sm font-semibold text-white bg-indigo-600",
                                                    "hover:bg-indigo-500 focus:outline-none",
                                                    "focus:ring-2 focus:ring-indigo-600",
                                                    "transition-all duration-200",
                                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                                )}
                                                disabled={createDoorRequestMutation.isPending}
                                            >
                                                {createDoorRequestMutation.isPending ? (
                                                    <span className="flex items-center">
                                                        <Spinner className="h-4 w-4 mr-2"/>
                                                        Đang xử lý...
                                                    </span>
                                                ) : (
                                                    'Gửi yêu cầu'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default CreateDoorLockRequest;