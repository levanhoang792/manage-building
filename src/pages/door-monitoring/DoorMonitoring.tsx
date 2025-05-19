import React, {useEffect, useRef, useState} from 'react';
import {Building, useGetBuildings} from '@/hooks/buildings';
import {Floor, useGetFloors} from '@/hooks/floors';
import {AnimatePresence, motion} from 'framer-motion';
import {
    ArrowPathIcon,
    BuildingOffice2Icon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MapIcon
} from '@heroicons/react/24/outline';
import FloorVisualizer from './components/FloorVisualizer';
import {toast} from 'sonner';

const DoorMonitoring: React.FC = () => {
    // State for buildings
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

    // State for floors
    const [floors, setFloors] = useState<Floor[]>([]);
    const [selectedFloorIds, setSelectedFloorIds] = useState<string[]>([]);

    // Refs for scrolling
    const buildingsScrollRef = useRef<HTMLDivElement>(null);

    // Fetch buildings data
    const {data: buildingsData, isLoading: isLoadingBuildings, refetch: refetchBuildings} = useGetBuildings();

    // Fetch floors data for selected building
    const {data: floorsData, isLoading: isLoadingFloors, refetch: refetchFloors} =
        useGetFloors(selectedBuildingId ?? '');

    // Set buildings data when it's loaded
    useEffect(() => {
        console.log('Buildings data:', buildingsData);
        if (buildingsData?.data) {
            if (buildingsData.data.data && Array.isArray(buildingsData.data.data)) {
                console.log('Setting buildings from data.data array:', buildingsData.data.data);
                setBuildings(buildingsData.data.data);

                // Select the first building by default if none is selected
                if (!selectedBuildingId && buildingsData.data.data.length > 0) {
                    setSelectedBuildingId(buildingsData.data.data[0].id.toString());
                }
            }
        }
    }, [buildingsData, selectedBuildingId]);

    // Set floors data when it's loaded
    useEffect(() => {
        console.log('Floors data:', floorsData);
        if (floorsData?.data) {
            if (floorsData.data.data && Array.isArray(floorsData.data.data)) {
                console.log('Setting floors from data.data array:', floorsData.data.data);
                setFloors(floorsData.data.data);

                // Select the first floor by default if none is selected
                if (selectedFloorIds.length === 0 && floorsData.data.data.length > 0) {
                    const firstFloorId = String(floorsData.data.data[0].id);
                    console.log(`Auto-selecting first floor with ID: ${firstFloorId}`);
                    setSelectedFloorIds([firstFloorId]);
                }
            }
        }
    }, [floorsData, selectedFloorIds.length]);

    // Handle building selection
    const handleBuildingSelect = (buildingId: string) => {
        console.log(`Building selection: ${buildingId}`);
        
        // Nếu đã chọn tòa nhà này rồi thì không làm gì
        if (buildingId === selectedBuildingId) {
            console.log('Building already selected, doing nothing');
            return;
        }
        
        // Lấy tên tòa nhà để hiển thị trong thông báo
        const buildingName = buildings.find(b => String(b.id) === buildingId)?.name || buildingId;
        
        setSelectedBuildingId(buildingId);
        
        // Reset selected floors when building changes
        console.log('Resetting selected floors');
        setSelectedFloorIds([]);
        
        // Thông báo cho người dùng
        toast.success(`Đã chọn tòa nhà: ${buildingName}`);
    };

    // Handle floor selection
    const handleFloorSelect = (floorId: string) => {
        console.log(`Floor selection: ${floorId}`);
        console.log('Current selected floors:', selectedFloorIds);
        
        // Ensure floorId is a string
        const floorIdStr = String(floorId);
        
        // If floor is already selected, remove it
        if (selectedFloorIds.includes(floorIdStr)) {
            console.log(`Removing floor ${floorIdStr} from selection`);
            const newSelectedFloorIds = selectedFloorIds.filter(id => id !== floorIdStr);
            console.log('New selected floors will be:', newSelectedFloorIds);
            setSelectedFloorIds(newSelectedFloorIds);
            
            // Thông báo cho người dùng
            toast.info(`Đã bỏ chọn tầng ${floors.find(f => String(f.id) === floorIdStr)?.name || floorIdStr}`);
        }
        // If we have less than 2 floors selected, add the new one
        else if (selectedFloorIds.length < 2) {
            console.log(`Adding floor ${floorIdStr} to selection`);
            const newSelectedFloorIds = [...selectedFloorIds, floorIdStr];
            console.log('New selected floors will be:', newSelectedFloorIds);
            setSelectedFloorIds(newSelectedFloorIds);
            
            // Thông báo cho người dùng
            toast.success(`Đã chọn tầng ${floors.find(f => String(f.id) === floorIdStr)?.name || floorIdStr}`);
        }
        // If we already have 2 floors selected, replace the oldest one
        else {
            console.log(`Replacing oldest floor with ${floorIdStr}`);
            const oldestFloorId = selectedFloorIds[0];
            const newSelectedFloorIds = [selectedFloorIds[1], floorIdStr];
            console.log('New selected floors will be:', newSelectedFloorIds);
            setSelectedFloorIds(newSelectedFloorIds);
            
            // Thông báo cho người dùng
            toast.info(
                `Đã thay thế tầng ${floors.find(f => String(f.id) === oldestFloorId)?.name || oldestFloorId} bằng tầng ${floors.find(f => String(f.id) === floorIdStr)?.name || floorIdStr}`
            );
        }
    };

    // Scroll buildings horizontally
    const scrollBuildings = (direction: 'left' | 'right') => {
        if (buildingsScrollRef.current) {
            const scrollAmount = 300; // Adjust as needed
            buildingsScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Refresh data
    const handleRefresh = () => {
        refetchBuildings();
        refetchFloors();

        // Add animation effect
        const refreshButton = document.getElementById('refresh-button');
        if (refreshButton) {
            refreshButton.classList.add('animate-spin');
            setTimeout(() => {
                refreshButton.classList.remove('animate-spin');
            }, 1000);
        }

        toast.success('Dữ liệu đã được cập nhật');
    };

    // Loading state
    if (isLoadingBuildings) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Debug information
    console.log('Rendering with buildings:', buildings);
    console.log('Selected building ID:', selectedBuildingId);
    console.log('Floors:', floors);
    console.log('Selected floor IDs:', selectedFloorIds);

    return (
        <div className="h-[calc(100vh-var(--header-height)-2rem)] flex flex-col p-4">
            {/* Header section */}
            <div className="flex justify-between items-center h-12">
                <h1 className="text-xl font-bold text-gray-900">Giám sát trạng thái cửa</h1>
                <button
                    id="refresh-button"
                    onClick={handleRefresh}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                >
                    <ArrowPathIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true"/>
                    Làm mới
                </button>
            </div>

            {/* Debug information */}
            {buildings.length === 0 && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                    <p className="font-bold">Thông tin debug:</p>
                    <p>Không có dữ liệu tòa nhà. Vui lòng kiểm tra API hoặc làm mới trang.</p>
                    <p>buildingsData: {JSON.stringify(buildingsData)}</p>
                </div>
            )}

            {/* Buildings row - Row 1 */}
            <div className="h-28 mt-1 flex flex-col overflow-hidden">
                <h2 className="text-base font-medium text-gray-900 mb-1 flex items-center flex-shrink-0">
                    <BuildingOffice2Icon className="h-4 w-4 mr-1.5 text-indigo-600"/>
                    Tòa nhà
                </h2>
                <div className="flex items-center flex-1 min-h-0 py-0">
                    <motion.button
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        onClick={() => scrollBuildings('left')}
                        className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 mr-2 shadow-sm flex-shrink-0"
                    >
                        <ChevronLeftIcon className="h-4 w-4 text-gray-600"/>
                    </motion.button>

                    <div
                        ref={buildingsScrollRef}
                        className="flex-1 overflow-x-auto flex space-x-3 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0"
                        style={{scrollbarWidth: 'thin'}}
                    >
                        {buildings.map((building) => (
                            <motion.div
                                key={building.id}
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.3}}
                                onClick={() => handleBuildingSelect(building.id.toString())}
                                className={`flex-shrink-0 p-2 rounded-lg shadow-md cursor-pointer min-w-[180px] w-[250px] overflow-hidden ${
                                    selectedBuildingId === building.id.toString()
                                        ? 'bg-indigo-100 border border-indigo-500'
                                        : 'bg-white hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center overflow-hidden">
                                    <BuildingOffice2Icon className={`h-4 w-4 flex-shrink-0 mr-1.5 ${
                                        building.status === 'active' ? 'text-green-600' : 'text-red-600'
                                    }`}/>
                                    <h3 className="font-medium text-sm text-gray-900 truncate">{building.name}</h3>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 truncate pl-5.5">{building.address}</p>
                                <div
                                    className={`mt-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                                        building.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                    {building.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        onClick={() => scrollBuildings('right')}
                        className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 ml-2 shadow-sm flex-shrink-0"
                    >
                        <ChevronRightIcon className="h-4 w-4 text-gray-600"/>
                    </motion.button>
                </div>
            </div>

            {/* Main content - Row 2 */}
            <div className="flex-1 grid grid-cols-4 gap-3 mt-2 min-h-0">
                {/* Floors list - Column 1 */}
                <div className="col-span-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-gray-200 shrink-0">
                        <h2 className="text-base font-medium text-gray-900 flex items-center">
                            <MapIcon className="h-4 w-4 mr-1.5 text-indigo-600"/>
                            Danh sách tầng
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {selectedBuildingId
                                ? `Tòa nhà: ${buildings.find(b => b.id.toString() === selectedBuildingId)?.name}`
                                : 'Chọn tòa nhà để xem danh sách tầng'}
                        </p>
                    </div>

                    <div className="overflow-y-auto flex-1 p-2">
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
                                        className={`p-2 rounded-md cursor-pointer shadow-sm ${
                                            selectedFloorIds.includes(String(floor.id))
                                                ? 'bg-indigo-100 border border-indigo-500'
                                                : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                        data-floor-id={floor.id}
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
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    floor.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                {floor.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                            </div>
                                        </div>

                                        {selectedFloorIds.includes(String(floor.id)) && (
                                            <motion.div
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                className="mt-2 ml-8 text-xs text-indigo-600 flex items-center"
                                            >
                                                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-1"></span>
                                                Đang hiển thị (ID: {floor.id})
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

                {/* Floor visualizers - Columns 2-4 */}
                <div className="col-span-3 grid grid-cols-2 gap-4 h-full">
                    <AnimatePresence mode="wait">
                        {selectedFloorIds.map((floorId, index) => {
                            const floor = floors.find(f => String(f.id) === String(floorId));
                            
                            return floor ? (
                                <motion.div
                                    key={floorId}
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -20}}
                                    transition={{duration: 0.3, delay: index * 0.1}}
                                    className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
                                    data-floor-id={floorId}
                                >
                                    <div className="p-2 border-b border-gray-200 bg-indigo-50 shrink-0 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <MapIcon className="h-4 w-4 text-indigo-600 mr-1.5" />
                                            <h3 className="text-base font-medium text-gray-900">
                                                {floor.name}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 overflow-hidden">
                                        <FloorVisualizer
                                            buildingId={selectedBuildingId || '0'}
                                            floorId={floorId}
                                            floorName={floor.name}
                                        />
                                    </div>
                                </motion.div>
                            ) : (
                                <div key={floorId} className="bg-red-100 p-4 rounded-lg">
                                    <p className="font-medium text-red-700">Floor with ID {floorId} not found in floors list.</p>
                                    <div className="mt-2 p-2 bg-white rounded border border-red-200">
                                        <p className="text-sm text-gray-700">Available floor IDs:</p>
                                        <ul className="list-disc pl-5 mt-1 text-sm">
                                            {floors.map(f => (
                                                <li key={f.id}>{f.id} - {f.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Empty state when no floors are selected */}
                        {selectedFloorIds.length === 0 && (
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.5}}
                                className="col-span-2 flex flex-col justify-center items-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8"
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
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">Không có tầng nào được
                                        chọn</h3>
                                    <p className="text-gray-500">Chọn tầng từ danh sách bên trái để xem sơ đồ và trạng
                                        thái cửa</p>
                                    
                                    {floors.length > 0 && (
                                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200 max-w-md">
                                            <p className="text-sm text-yellow-700 text-left">
                                                <strong>Thông tin debug:</strong><br />
                                                Tòa nhà đã chọn: {selectedBuildingId || 'Chưa chọn'}<br />
                                                Số tầng có sẵn: {floors.length}<br />
                                                Tầng đầu tiên: ID={floors[0]?.id}, Tên={floors[0]?.name}<br />
                                                Tầng đã chọn: {selectedFloorIds.join(', ') || 'Chưa chọn'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Show placeholder for second floor if only one is selected */}
                        {selectedFloorIds.length === 1 && (
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.3, delay: 0.2}}
                                className="flex flex-col justify-center items-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6"
                            >
                                <motion.div
                                    whileHover={{scale: 1.1}}
                                    className="bg-indigo-100 rounded-full p-3 mb-4"
                                >
                                    <MapIcon className="h-8 w-8 text-indigo-600"/>
                                </motion.div>
                                <div className="text-center">
                                    <h3 className="text-base font-medium text-gray-700 mb-2">Thêm một tầng nữa?</h3>
                                    <p className="text-gray-500 text-sm">Chọn thêm một tầng từ danh sách để so sánh</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default DoorMonitoring;