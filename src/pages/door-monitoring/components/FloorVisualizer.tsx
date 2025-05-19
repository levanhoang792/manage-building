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

const FloorVisualizer: React.FC<FloorVisualizerProps> = ({buildingId, floorId, floorName}) => {
    console.log(`FloorVisualizer rendered with buildingId=${buildingId}, floorId=${floorId}, floorName=${floorName}`);

    // State for floor plan
    const [floorPlanUrl, setFloorPlanUrl] = useState<string | null>(null);
    const [doors, setDoors] = useState<any[]>([]);
    const [doorCoordinates, setDoorCoordinates] = useState<Record<string, any[]>>({});
    const [isZoomed, setIsZoomed] = useState(false);
    const [selectedDoor, setSelectedDoor] = useState<any | null>(null);
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

    // Set floor plan URL when floor data is loaded
    useEffect(() => {
        console.log('Floor data:', JSON.stringify(floorData, null, 2));
        
        // Kiểm tra cấu trúc dữ liệu thực tế
        if (floorData) {
            console.log('Floor data structure check:');
            console.log('- floorData.data exists:', !!floorData.data);
            
            if (floorData.data) {
                console.log('- floorData.data keys:', Object.keys(floorData.data));
                console.log('- floorData.data.data exists:', !!floorData.data.data);
                
                if (floorData.data.data) {
                    console.log('- floorData.data.data keys:', Object.keys(floorData.data.data));
                }
            }
        }
        
        // Kiểm tra tất cả các cấu trúc dữ liệu có thể
        let foundFloorPlan = false;
        
        // Kiểm tra các trường cụ thể
        const possibleFields = [
            { path: 'data.floor_plan_url', value: floorData?.data?.floor_plan_url },
            { path: 'data.floor_plan_image', value: floorData?.data?.floor_plan_image },
            { path: 'data.floor_plan', value: floorData?.data?.floor_plan },
            { path: 'data.floor.floor_plan_url', value: floorData?.data?.floor?.floor_plan_url },
            { path: 'data.floor.floor_plan_image', value: floorData?.data?.floor?.floor_plan_image },
            { path: 'data.floor.floor_plan', value: floorData?.data?.floor?.floor_plan },
            { path: 'data.data.floor_plan_url', value: floorData?.data?.data?.floor_plan_url },
            { path: 'data.data.floor_plan_image', value: floorData?.data?.data?.floor_plan_image },
            { path: 'data.data.floor_plan', value: floorData?.data?.data?.floor_plan }
        ];
        
        
        for (const field of possibleFields) {
            if (field.value) {
                console.log(`Setting floor plan URL from ${field.path}:`, field.value);
                setFloorPlanUrl(field.value);
                foundFloorPlan = true;
                break;
            }
        }
        
        // Nếu không tìm thấy trong các trường cụ thể, kiểm tra tất cả các trường
        if (!foundFloorPlan && floorData?.data) {
            console.log('Checking all fields in floorData.data for possible floor plan URL');
            
            // Kiểm tra tất cả các trường trong floorData.data
            const dataObj = floorData.data;
            const keys = Object.keys(dataObj);
            
            for (const key of keys) {
                const value = dataObj[key];
                
                // Kiểm tra nếu trường có chứa từ khóa liên quan đến floor plan
                if (typeof value === 'string' && 
                    (key.includes('floor_plan') || 
                     key.includes('floorPlan') || 
                     key.includes('plan') || 
                     key.includes('image') || 
                     key.includes('url'))) {
                    
                    console.log(`Found potential floor plan URL in field '${key}':`, value);
                    
                    // Kiểm tra nếu giá trị có vẻ như là URL
                    if (value.startsWith('http') || value.startsWith('/') || value.includes('.jpg') || 
                        value.includes('.png') || value.includes('.jpeg') || value.includes('.svg')) {
                        
                        console.log(`Setting floor plan URL from field '${key}':`, value);
                        setFloorPlanUrl(value);
                        foundFloorPlan = true;
                        break;
                    }
                }
            }
            
            // Nếu vẫn không tìm thấy, kiểm tra trong data.data nếu có
            if (!foundFloorPlan && dataObj.data && typeof dataObj.data === 'object') {
                console.log('Checking all fields in floorData.data.data for possible floor plan URL');
                
                const nestedDataObj = dataObj.data;
                const nestedKeys = Object.keys(nestedDataObj);
                
                for (const key of nestedKeys) {
                    const value = nestedDataObj[key];
                    
                    if (typeof value === 'string' && 
                        (key.includes('floor_plan') || 
                         key.includes('floorPlan') || 
                         key.includes('plan') || 
                         key.includes('image') || 
                         key.includes('url'))) {
                        
                        console.log(`Found potential floor plan URL in nested field '${key}':`, value);
                        
                        if (value.startsWith('http') || value.startsWith('/') || value.includes('.jpg') || 
                            value.includes('.png') || value.includes('.jpeg') || value.includes('.svg')) {
                            
                            console.log(`Setting floor plan URL from nested field '${key}':`, value);
                            setFloorPlanUrl(value);
                            foundFloorPlan = true;
                            break;
                        }
                    }
                }
            }
        }
        
        if (!foundFloorPlan) {
            console.error('No floor plan URL found in any location');
            console.log('Full data structure:', JSON.stringify(floorData, null, 2));
        }
    }, [floorData]);

    // Set doors when doors data is loaded
    useEffect(() => {
        console.log('Doors data:', doorsData);
        if (doorsData?.data?.doors) {
            console.log('Setting doors from doors field:', doorsData.data.doors);
            setDoors(doorsData.data.doors);
        } else if (Array.isArray(doorsData?.data)) {
            console.log('Setting doors from data array:', doorsData.data);
            setDoors(doorsData.data);
        } else if (doorsData?.data?.data && Array.isArray(doorsData.data.data)) {
            console.log('Setting doors from data.data array:', doorsData.data.data);
            setDoors(doorsData.data.data);
        }
    }, [doorsData]);

    // Sử dụng hook useGetMultipleDoorCoordinates để lấy tọa độ cửa
    const doorIds = doors.map(door => door.id.toString());
    const {data: doorCoordinatesData, isLoading: isLoadingCoordinates, error: coordinatesError} =
        useGetMultipleDoorCoordinates(buildingId, floorId, doorIds);

    // Xử lý dữ liệu tọa độ cửa khi có dữ liệu
    useEffect(() => {
        if (doorCoordinatesData) {
            console.log('Door coordinates data:', doorCoordinatesData);

            try {
                const coordinatesMap: Record<string, any[]> = {};

                doorCoordinatesData.forEach(item => {
                    const doorId = item.doorId.toString();

                    if (item.data?.data && Array.isArray(item.data.data)) {
                        coordinatesMap[doorId] = item.data.data;
                    } else if (Array.isArray(item.data)) {
                        coordinatesMap[doorId] = item.data;
                    }
                });

                console.log('Setting door coordinates:', coordinatesMap);
                setDoorCoordinates(coordinatesMap);
            } catch (error) {
                console.error('Error processing door coordinates:', error);
                setError('Lỗi khi xử lý dữ liệu tọa độ cửa');
            }
        }
    }, [doorCoordinatesData]);

    // Xử lý lỗi khi lấy tọa độ cửa
    useEffect(() => {
        if (coordinatesError) {
            console.error('Error fetching door coordinates:', coordinatesError);
            setError('Lỗi khi lấy dữ liệu tọa độ cửa');
        }
    }, [coordinatesError]);

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
                    const bgWidth = nameWidth + 30; // Extra space for icon

                    // Background for text
                    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    context.fillRect(coordX + 10, coordY - 20, bgWidth, 20);

                    // Door name text
                    context.fillStyle = '#000000';
                    context.fillText(door.name, coordX + 15, coordY - 5);

                    // Draw lock icon
                    if (door.lock_status === 'open') {
                        // Draw open lock icon
                        context.fillStyle = '#10b981';
                        context.fillRect(coordX + 15 + nameWidth, coordY - 17, 10, 14);
                    } else {
                        // Draw closed lock icon
                        context.fillStyle = '#ef4444';
                        context.fillRect(coordX + 15 + nameWidth, coordY - 17, 10, 14);
                    }
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
                            const bgWidth = nameWidth + 30; // Extra space for icon

                            // Background for text
                            context.fillStyle = 'rgba(255, 255, 255, 0.8)';
                            context.fillRect(coordX + 10, coordY - 20, bgWidth, 20);

                            // Door name text
                            context.fillStyle = '#000000';
                            context.fillText(door.name, coordX + 15, coordY - 5);

                            // Draw lock icon
                            if (door.lock_status === 'open') {
                                // Draw open lock icon
                                context.fillStyle = '#10b981';
                                context.fillRect(coordX + 15 + nameWidth, coordY - 17, 10, 14);
                            } else {
                                // Draw closed lock icon
                                context.fillStyle = '#ef4444';
                                context.fillRect(coordX + 15 + nameWidth, coordY - 17, 10, 14);
                            }
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
                                <strong>Các trường liên quan đến sơ đồ:</strong><br/>
                                {floorData.data && (
                                    <>
                                        <strong>Trường trong floorData.data:</strong><br/>
                                        {Object.keys(floorData.data).map(key => (
                                            <React.Fragment key={key}>
                                                - {key}: {typeof floorData.data[key] === 'object' 
                                                    ? JSON.stringify(floorData.data[key]) 
                                                    : String(floorData.data[key])}<br/>
                                            </React.Fragment>
                                        ))}
                                        <br/>
                                        data.floor_plan_url: {floorData.data.floor_plan_url || 'không có'}<br/>
                                        data.floor_plan_image: {floorData.data.floor_plan_image || 'không có'}<br/>
                                        data.floor_plan: {floorData.data.floor_plan || 'không có'}<br/>
                                    </>
                                )}
                                
                                {floorData.data && floorData.data.data && (
                                    <>
                                        <strong>Trường trong floorData.data.data:</strong><br/>
                                        {Object.keys(floorData.data.data).map(key => (
                                            <React.Fragment key={key}>
                                                - {key}: {typeof floorData.data.data[key] === 'object' 
                                                    ? JSON.stringify(floorData.data.data[key]) 
                                                    : String(floorData.data.data[key])}<br/>
                                            </React.Fragment>
                                        ))}
                                        <br/>
                                        data.data.floor_plan_url: {floorData.data.data.floor_plan_url || 'không có'}<br/>
                                        data.data.floor_plan_image: {floorData.data.data.floor_plan_image || 'không có'}<br/>
                                        data.data.floor_plan: {floorData.data.data.floor_plan || 'không có'}<br/>
                                    </>
                                )}
                                
                                <br/>
                                <strong>Dữ liệu đầy đủ:</strong><br/>
                                <pre className="whitespace-pre-wrap text-xs">
                                    {JSON.stringify(floorData, null, 2).substring(0, 300)}...
                                </pre>
                                
                                <br/>
                                <strong>Hướng dẫn khắc phục:</strong><br/>
                                1. Kiểm tra xem tầng đã được tải lên sơ đồ chưa<br/>
                                2. Kiểm tra API trả về có chứa trường floor_plan_url hoặc floor_plan_image không<br/>
                                3. Nếu API trả về có chứa URL sơ đồ tầng nhưng không hiển thị, hãy kiểm tra console log để xem lỗi<br/>
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