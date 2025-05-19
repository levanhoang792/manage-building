import React, {useEffect, useRef, useState} from 'react';
import {useGetFloorDetail} from '@/hooks/floors';
import {useGetDoors} from '@/hooks/doors';
import {useGetMultipleDoorCoordinates} from '@/hooks/doorCoordinates';
import {AnimatePresence, motion} from 'framer-motion';
import {ArrowsPointingInIcon, ArrowsPointingOutIcon, MapIcon} from '@heroicons/react/24/outline';

interface FloorVisualizerProps {
    buildingId: string;
    floorId: string;
    floorName: string;
}

interface Door {
    id: string | number;
    name: string;
    description?: string;
    status: 'active' | 'maintenance' | 'inactive';
    lock_status: 'open' | 'closed';
}

interface DoorCoordinate {
    x_coordinate: number;
    y_coordinate: number;
}

interface FloorData {
    floor_plan_url?: string;
    floor_plan_image?: string;
    floor_plan?: string;
    data?: {
        floor_plan_url?: string;
        floor_plan_image?: string;
        floor_plan?: string;
    };
    [key: string]: string | number | boolean | object | undefined; // More specific index signature
}

interface FloorResponse {
    data: FloorData;
}

interface DoorListResponse {
    data: {
        doors?: Door[];
        data?: Door[];
    } | Door[];
}

interface DoorCoordinateResponse {
    doorId: string | number;
    data: {
        data?: DoorCoordinate[];
    } | DoorCoordinate[];
}

const FloorVisualizer: React.FC<FloorVisualizerProps> = ({buildingId, floorId, floorName}) => {
    console.log(`FloorVisualizer rendered with buildingId=${buildingId}, floorId=${floorId}, floorName=${floorName}`);

    // State for floor plan
    const [floorPlanUrl, setFloorPlanUrl] = useState<string | null>(null);
    const [doors, setDoors] = useState<Door[]>([]);
    const [doorCoordinates, setDoorCoordinates] = useState<Record<string, DoorCoordinate[]>>({});
    const [isZoomed, setIsZoomed] = useState(false);
    const [selectedDoor, setSelectedDoor] = useState<Door | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    // Fetch floor details
    const {data: floorData, isLoading: isLoadingFloor, error: floorError} = useGetFloorDetail(buildingId, floorId);

    // Fetch doors for this floor
    const {
        data: doorsData,
        isLoading: isLoadingDoors,
        error: doorsError
    } = useGetDoors(buildingId, floorId, {limit: 100});

    // Sử dụng hook useGetMultipleDoorCoordinates để lấy tọa độ cửa
    const doorIds = doors.map(door => door.id.toString());
    const {data: doorCoordinatesData, isLoading: isLoadingCoordinates, error: coordinatesError} =
        useGetMultipleDoorCoordinates(buildingId, floorId, doorIds);

    // Set floor plan URL when floor data is loaded
    useEffect(() => {
        if (!floorData) return;

        const floorResponse = floorData as unknown as FloorResponse;
        
        try {
            let foundFloorPlan = false;
            const data = floorResponse.data;

            // Check direct properties
            if (data.floor_plan_url) {
                setFloorPlanUrl(data.floor_plan_url);
                foundFloorPlan = true;
            } else if (data.floor_plan_image) {
                setFloorPlanUrl(data.floor_plan_image);
                foundFloorPlan = true;
            } else if (data.floor_plan) {
                setFloorPlanUrl(data.floor_plan);
                foundFloorPlan = true;
            }

            // Check nested data properties
            if (!foundFloorPlan && data.data) {
                if (data.data.floor_plan_url) {
                    setFloorPlanUrl(data.data.floor_plan_url);
                    foundFloorPlan = true;
                } else if (data.data.floor_plan_image) {
                    setFloorPlanUrl(data.data.floor_plan_image);
                    foundFloorPlan = true;
                } else if (data.data.floor_plan) {
                    setFloorPlanUrl(data.data.floor_plan);
                    foundFloorPlan = true;
                }
            }

            if (!foundFloorPlan) {
                console.error('No floor plan URL found in any location');
                console.log('Full data structure:', JSON.stringify(floorData, null, 2));
            }
        } catch (error) {
            console.error('Error processing floor data:', error);
            setError('Lỗi khi xử lý dữ liệu tầng');
        }
    }, [floorData]);

    // Set doors when doors data is loaded
    useEffect(() => {
        if (!doorsData) return;

        const doorResponse = doorsData as unknown as DoorListResponse;
        if (Array.isArray(doorResponse.data)) {
            setDoors(doorResponse.data);
        } else if (doorResponse.data.doors) {
            setDoors(doorResponse.data.doors);
        } else if (doorResponse.data.data) {
            setDoors(doorResponse.data.data);
        }
    }, [doorsData]);

    // Xử lý dữ liệu tọa độ cửa khi có dữ liệu
    useEffect(() => {
        if (!doorCoordinatesData) return;

        try {
            const coordinatesMap: Record<string, DoorCoordinate[]> = {};

            doorCoordinatesData.forEach((item: DoorCoordinateResponse) => {
                const doorId = item.doorId.toString();

                if (Array.isArray(item.data)) {
                    coordinatesMap[doorId] = item.data;
                } else if (item.data?.data && Array.isArray(item.data.data)) {
                    coordinatesMap[doorId] = item.data.data;
                }
            });

            setDoorCoordinates(coordinatesMap);
        } catch (error) {
            console.error('Error processing door coordinates:', error);
            setError('Lỗi khi xử lý dữ liệu tọa độ cửa');
        }
    }, [doorCoordinatesData]);

    // Draw floor plan and door coordinates on canvas
    useEffect(() => {
        if (!floorPlanUrl || !canvasRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        const image = new Image();
        image.src = floorPlanUrl;
        imageRef.current = image;

        image.onload = () => {
            // Set canvas dimensions based on container size
            const containerWidth = containerRef.current!.clientWidth;
            const containerHeight = containerRef.current!.clientHeight;

            // Calculate scale to fit the image within the container
            const scale = Math.min(
                containerWidth / image.width,
                containerHeight / image.height
            );

            // Set canvas dimensions
            canvas.width = containerWidth;
            canvas.height = containerHeight;

            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate position to center the image
            const x = (containerWidth - image.width * scale) / 2;
            const y = (containerHeight - image.height * scale) / 2;

            // Draw the image
            context.drawImage(image, x, y, image.width * scale, image.height * scale);

            // Draw door coordinates
            Object.entries(doorCoordinates).forEach(([doorId, coordinates]) => {
                const door = doors.find(d => d.id.toString() === doorId);
                if (!door || !coordinates) return;

                coordinates.forEach(coord => {
                    // Calculate position based on scale and offset
                    const coordX = x + coord.x_coordinate * scale;
                    const coordY = y + coord.y_coordinate * scale;

                    // Draw circle for door coordinate
                    context.beginPath();
                    context.arc(coordX, coordY, 8, 0, 2 * Math.PI);

                    // Set color based on door status
                    let fillColor;
                    if (door.status === 'active' && door.lock_status === 'open') {
                        fillColor = '#10b981'; // Green for active and open
                    } else if (door.status === 'active' && door.lock_status === 'closed') {
                        fillColor = '#ef4444'; // Red for active but closed
                    } else if (door.status === 'maintenance') {
                        fillColor = '#f59e0b'; // Yellow for maintenance
                    } else {
                        fillColor = '#6b7280'; // Gray for inactive
                    }

                    context.fillStyle = fillColor;
                    context.fill();
                    context.strokeStyle = '#ffffff';
                    context.lineWidth = 2;
                    context.stroke();

                    // Draw pulsing effect for active doors
                    if (door.status === 'active') {
                        // Draw outer circle with animation effect
                        const now = Date.now();
                        const pulseSize = Math.sin(now * 0.005) * 3 + 5; // Pulsing between 2 and 8

                        context.beginPath();
                        context.arc(coordX, coordY, 8 + pulseSize, 0, 2 * Math.PI);
                        context.fillStyle = door.lock_status === 'open'
                            ? 'rgba(16, 185, 129, 0.2)' // Green with transparency
                            : 'rgba(239, 68, 68, 0.2)'; // Red with transparency
                        context.fill();
                    }

                    // Draw door name with status icon
                    context.font = '12px Arial';
                    const nameWidth = context.measureText(door.name).width;
                    const bgWidth = nameWidth + 10; // Reduced padding since we removed the icon

                    // Background for text
                    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    context.fillRect(coordX + 10, coordY - 20, bgWidth, 20);

                    // Door name text
                    context.fillStyle = '#000000';
                    context.fillText(door.name, coordX + 15, coordY - 5);
                });
            });
        };

        // Set up animation loop for continuous updates
        const animationFrame = requestAnimationFrame(function animate() {
            if (canvasRef.current && imageRef.current) {
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');
                const image = imageRef.current;

                if (context) {
                    const containerWidth = containerRef.current!.clientWidth;
                    const containerHeight = containerRef.current!.clientHeight;

                    const scale = Math.min(
                        containerWidth / image.width,
                        containerHeight / image.height
                    );

                    // Clear canvas
                    context.clearRect(0, 0, canvas.width, canvas.height);

                    // Calculate position to center the image
                    const x = (containerWidth - image.width * scale) / 2;
                    const y = (containerHeight - image.height * scale) / 2;

                    // Draw the image
                    context.drawImage(image, x, y, image.width * scale, image.height * scale);

                    // Draw door coordinates with animation
                    Object.entries(doorCoordinates).forEach(([doorId, coordinates]) => {
                        const door = doors.find(d => d.id.toString() === doorId);
                        if (!door || !coordinates) return;

                        coordinates.forEach(coord => {
                            // Calculate position based on scale and offset
                            const coordX = x + coord.x_coordinate * scale;
                            const coordY = y + coord.y_coordinate * scale;

                            // Draw circle for door coordinate
                            context.beginPath();
                            context.arc(coordX, coordY, 8, 0, 2 * Math.PI);

                            // Set color based on door status
                            let fillColor;
                            if (door.status === 'active' && door.lock_status === 'open') {
                                fillColor = '#10b981'; // Green for active and open
                            } else if (door.status === 'active' && door.lock_status === 'closed') {
                                fillColor = '#ef4444'; // Red for active but closed
                            } else if (door.status === 'maintenance') {
                                fillColor = '#f59e0b'; // Yellow for maintenance
                            } else {
                                fillColor = '#6b7280'; // Gray for inactive
                            }

                            context.fillStyle = fillColor;
                            context.fill();
                            context.strokeStyle = '#ffffff';
                            context.lineWidth = 2;
                            context.stroke();

                            // Draw pulsing effect for active doors
                            if (door.status === 'active') {
                                // Draw outer circle with animation effect
                                const now = Date.now();
                                const pulseSize = Math.sin(now * 0.005) * 3 + 5; // Pulsing between 2 and 8

                                context.beginPath();
                                context.arc(coordX, coordY, 8 + pulseSize, 0, 2 * Math.PI);
                                context.fillStyle = door.lock_status === 'open'
                                    ? 'rgba(16, 185, 129, 0.2)' // Green with transparency
                                    : 'rgba(239, 68, 68, 0.2)'; // Red with transparency
                                context.fill();
                            }

                            // Draw door name with status icon
                            context.font = '12px Arial';
                            const nameWidth = context.measureText(door.name).width;
                            const bgWidth = nameWidth + 10; // Reduced padding since we removed the icon

                            // Background for text
                            context.fillStyle = 'rgba(255, 255, 255, 0.8)';
                            context.fillRect(coordX + 10, coordY - 20, bgWidth, 20);

                            // Door name text
                            context.fillStyle = '#000000';
                            context.fillText(door.name, coordX + 15, coordY - 5);
                        });
                    });
                }
            }

            requestAnimationFrame(animate);
        });

        // Clean up animation frame on unmount
        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [floorPlanUrl, doorCoordinates, doors, isZoomed]);

    // Handle canvas click to select a door
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || !containerRef.current || !imageRef.current) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate scale and offset
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const image = imageRef.current;

        const scale = Math.min(
            containerWidth / image.width,
            containerHeight / image.height
        );

        const imageX = (containerWidth - image.width * scale) / 2;
        const imageY = (containerHeight - image.height * scale) / 2;

        // Check if click is on any door coordinate
        let clickedDoor = null;

        Object.entries(doorCoordinates).forEach(([doorId, coordinates]) => {
            const door = doors.find(d => d.id.toString() === doorId);
            if (!door || !coordinates) return;

            coordinates.forEach(coord => {
                const coordX = imageX + coord.x_coordinate * scale;
                const coordY = imageY + coord.y_coordinate * scale;

                // Check if click is within the circle
                const distance = Math.sqrt(Math.pow(x - coordX, 2) + Math.pow(y - coordY, 2));
                if (distance <= 8) {
                    clickedDoor = door;
                }
            });
        });

        if (clickedDoor) {
            setSelectedDoor(clickedDoor);
        } else {
            setSelectedDoor(null);
        }
    };

    // Toggle zoom
    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    // Loading state
    if (isLoadingFloor || isLoadingDoors || isLoadingCoordinates) {
        return (
            <div className="h-full flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="ml-4 text-gray-600">Đang tải dữ liệu...</p>
            </div>
        );
    }

    // Error states
    if (floorError) {
        return (
            <div className="h-full flex flex-col justify-center items-center bg-red-50 p-6">
                <div className="text-red-500 text-xl mb-4">Lỗi khi tải dữ liệu tầng</div>
                <div className="text-red-700 bg-red-100 p-4 rounded-lg max-w-full overflow-auto">
                    <pre>{JSON.stringify(floorError, null, 2)}</pre>
                </div>
            </div>
        );
    }

    if (doorsError) {
        return (
            <div className="h-full flex flex-col justify-center items-center bg-red-50 p-6">
                <div className="text-red-500 text-xl mb-4">Lỗi khi tải dữ liệu cửa</div>
                <div className="text-red-700 bg-red-100 p-4 rounded-lg max-w-full overflow-auto">
                    <pre>{JSON.stringify(doorsError, null, 2)}</pre>
                </div>
            </div>
        );
    }

    if (coordinatesError) {
        return (
            <div className="h-full flex flex-col justify-center items-center bg-red-50 p-6">
                <div className="text-red-500 text-xl mb-4">Lỗi khi tải dữ liệu tọa độ cửa</div>
                <div className="text-red-700 bg-red-100 p-4 rounded-lg max-w-full overflow-auto">
                    <pre>{JSON.stringify(coordinatesError, null, 2)}</pre>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col justify-center items-center bg-red-50 p-6">
                <div className="text-red-500 text-xl mb-4">Lỗi</div>
                <div className="text-red-700 bg-red-100 p-4 rounded-lg">{error}</div>
            </div>
        );
    }

    // No floor plan
    if (!floorPlanUrl) {
        return (
            <div className="flex flex-col justify-center items-center h-full bg-gray-50 p-4">
                <MapIcon className="h-16 w-16 text-gray-400 mb-4"/>
                <p className="text-gray-500 text-center font-medium">Không có sơ đồ tầng</p>
                <p className="text-gray-400 text-sm mt-2 text-center">Vui lòng tải lên sơ đồ tầng trong phần quản lý
                    tầng</p>
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200 max-w-md overflow-auto">
                    <p className="text-sm text-yellow-700">
                        <strong>Thông tin debug:</strong><br/>
                        Building ID: {buildingId}<br/>
                        Floor ID: {floorId}<br/>
                        
                        {floorData && (
                            <>
                                <strong>Dữ liệu tầng:</strong><br/>
                                {JSON.stringify(floorData, null, 2)}
                            </>
                        )}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-2 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                            <span>Mở</span>
                        </div>
                        <div className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                            <span>Đóng</span>
                        </div>
                        <div className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
                            <span>Bảo trì</span>
                        </div>
                        <div className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-gray-500 mr-1"></span>
                            <span>Không hoạt động</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                        {doors.length} cửa • {Object.values(doorCoordinates).flat().length} tọa độ
                    </span>
                    <button
                        onClick={toggleZoom}
                        className="p-1.5 rounded-full hover:bg-gray-200"
                        title={isZoomed ? "Thu nhỏ" : "Phóng to"}
                    >
                        {isZoomed ? (
                            <ArrowsPointingInIcon className="h-4 w-4 text-gray-600"/>
                        ) : (
                            <ArrowsPointingOutIcon className="h-4 w-4 text-gray-600"/>
                        )}
                    </button>
                </div>
            </div>

            <div
                ref={containerRef}
                className={`relative flex-1 overflow-hidden ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            >
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    onClick={handleCanvasClick}
                />

                {/* Door details popup */}
                <AnimatePresence>
                    {selectedDoor && (
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 20}}
                            transition={{duration: 0.2}}
                            className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-medium text-gray-900">{selectedDoor.name}</h4>
                                    <p className="text-sm text-gray-500 mt-1">{selectedDoor.description || 'Không có mô tả'}</p>

                                    <div className="mt-2 flex space-x-2">
                                        <div
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                selectedDoor.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : selectedDoor.status === 'maintenance'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                            }`}>
                                            {selectedDoor.status === 'active'
                                                ? 'Hoạt động'
                                                : selectedDoor.status === 'maintenance'
                                                    ? 'Bảo trì'
                                                    : 'Không hoạt động'}
                                        </div>

                                        <div
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                selectedDoor.lock_status === 'open'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            {selectedDoor.lock_status === 'open' ? 'Mở' : 'Đóng'}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedDoor(null)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">Đóng</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                         fill="currentColor">
                                        <path fillRule="evenodd"
                                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </button>
                            </div>

                            <div className="mt-3 flex justify-end">
                                <button
                                    onClick={() => {
                                        window.open(`/buildings/${buildingId}/floors/${floorId}/doors/${selectedDoor.id}`, '_blank');
                                    }}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FloorVisualizer;