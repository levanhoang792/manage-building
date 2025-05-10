import React, {useEffect, useRef, useState} from 'react';
import {DoorCoordinate, useGetMultipleDoorCoordinates} from '@/hooks/doorCoordinates';
import {Door} from '@/hooks/doors';
import {toast} from 'sonner';

interface CoordinateVisualizerProps {
    floorPlanImage: string;
    coordinates: DoorCoordinate[];
    onCoordinateSelect?: (coordinate: DoorCoordinate) => void;
    onCoordinateAdd?: (x: number, y: number) => void;
    isEditable?: boolean;
    selectedCoordinateId?: number;
    allDoors?: Door[];
    currentDoorId?: number;
    onDoorSelect?: (door: Door) => void;
    enableDrag?: boolean; // Cho phép kéo thả các cửa
    disableDoorNavigation?: boolean; // Tắt chuyển hướng khi click vào cửa khác
    onCoordinateUpdate?: (coordinate: DoorCoordinate, x: number, y: number) => void; // Callback khi cập nhật tọa độ
}

const CoordinateVisualizer: React.FC<CoordinateVisualizerProps> = (
    {
        floorPlanImage,
        coordinates,
        onCoordinateSelect,
        onCoordinateAdd,
        isEditable = false,
        selectedCoordinateId,
        allDoors = [],
        currentDoorId,
        onDoorSelect,
        enableDrag = false,
        disableDoorNavigation = false,
        onCoordinateUpdate
    }
) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [imageSize, setImageSize] = useState({width: 0, height: 0});
    const [doorCoordinates, setDoorCoordinates] = useState<{ door: Door, coordinates: DoorCoordinate[] }[]>([]);
    // Tham chiếu đến hình ảnh đã tải
    const imageRef = useRef<HTMLImageElement | null>(null);

    // State cho việc kéo thả
    const [isDragging, setIsDragging] = useState(false);
    const [draggedCoordinate, setDraggedCoordinate] = useState<DoorCoordinate | null>(null);
    const [draggedDoor, setDraggedDoor] = useState<Door | null>(null);
    const [dragStartPos, setDragStartPos] = useState<{ x: number, y: number }>({x: 0, y: 0});
    const [currentMousePos, setCurrentMousePos] = useState<{ x: number, y: number }>({x: 0, y: 0});
    const [justDragged, setJustDragged] = useState(false); // Theo dõi xem vừa kéo thả xong chưa

    // Sử dụng useRef để theo dõi thời gian kéo thả
    const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Tải hình ảnh sơ đồ tầng
    useEffect(() => {
        if (!floorPlanImage) return;

        const image = new Image();
        image.src = floorPlanImage;
        image.onload = () => {
            setIsImageLoaded(true);
            setImageSize({width: image.width, height: image.height});
            imageRef.current = image;
        };
    }, [floorPlanImage]);

    // Lấy tọa độ của tất cả các cửa khác
    const otherDoors = React.useMemo(() => {
        return allDoors?.filter(door => door.id !== currentDoorId) || [];
    }, [allDoors, currentDoorId]);

    const otherDoorIds = React.useMemo(() => {
        return otherDoors.map(door => door.id);
    }, [otherDoors]);

    // Lấy buildingId và floorId từ URL hiện tại
    const buildingId = React.useMemo(() => window.location.pathname.split('/')[2] || '0', []);
    const floorId = React.useMemo(() => window.location.pathname.split('/')[4] || '0', []);

    // Sử dụng hook để lấy tọa độ của tất cả các cửa khác
    const {data: multipleDoorCoordinatesData, isLoading: isLoadingMultipleCoordinates} = useGetMultipleDoorCoordinates(
        buildingId,
        floorId,
        otherDoorIds
    );

    // Cập nhật state khi có dữ liệu mới
    useEffect(() => {
        if (!multipleDoorCoordinatesData || !otherDoors || otherDoors.length === 0) {
            setDoorCoordinates([]);
            return;
        }

        // Xử lý dữ liệu trả về từ API
        const doorCoords = multipleDoorCoordinatesData.map(item => {
            const doorId = item.doorId;
            const door = otherDoors.find(d => d.id.toString() === doorId.toString());

            if (!door) return null;

            return {
                door,
                coordinates: item.data?.data || []
            } as { door: Door, coordinates: DoorCoordinate[] };
        }).filter(Boolean) as { door: Door, coordinates: DoorCoordinate[] }[];

        setDoorCoordinates(doorCoords);
    }, [multipleDoorCoordinatesData, otherDoors]);

    // Thiết lập kích thước canvas - tách riêng để tránh vẽ lại nhiều lần
    useEffect(() => {
        if (!canvasRef.current || !containerRef.current || !isImageLoaded) return;

        const canvas = canvasRef.current;
        const containerWidth = containerRef.current.clientWidth;

        // Chỉ cập nhật kích thước canvas và scale nếu có sự thay đổi thực sự
        if (canvas.width !== containerWidth ||
            canvas.height !== (imageSize.height / imageSize.width) * containerWidth) {

            canvas.width = containerWidth;
            canvas.height = (imageSize.height / imageSize.width) * containerWidth;
            setScale(containerWidth / imageSize.width);
        }
    }, [isImageLoaded, imageSize]);

    // Hàm vẽ các tọa độ - tách ra để có thể sử dụng lại
    const drawCoordinates = (context: CanvasRenderingContext2D, dragX?: number, dragY?: number) => {
        if (!context) return;

        // Vẽ các tọa độ của các cửa khác trước (để chúng nằm dưới cửa hiện tại)
        doorCoordinates.forEach(({door, coordinates: doorCoords}) => {
            if (!doorCoords || doorCoords.length === 0) return;

            // Vẽ tất cả các tọa độ của cửa khác
            doorCoords.forEach((coordinate) => {
                if (!coordinate) return;

                // Kiểm tra xem tọa độ này có phải là tọa độ đang được kéo không
                const isDragged = isDragging && draggedCoordinate?.id === coordinate.id && draggedDoor?.id === door.id;

                // Sử dụng vị trí mới nếu đang kéo, ngược lại sử dụng vị trí cũ
                let x, y;
                if (isDragged && dragX !== undefined && dragY !== undefined) {
                    x = dragX * scale;
                    y = dragY * scale;
                } else {
                    x = coordinate.x_coordinate * scale;
                    y = coordinate.y_coordinate * scale;
                }

                // Vẽ điểm tọa độ cho cửa khác với màu khác
                context.beginPath();
                context.arc(x, y, isDragged ? 8 : 6, 0, 2 * Math.PI);
                context.fillStyle = isDragged ? '#10b981' : '#3b82f6'; // Màu xanh lá cây khi đang kéo, xanh dương khi bình thường
                context.fill();
                context.strokeStyle = '#ffffff';
                context.lineWidth = 2;
                context.stroke();

                // Vẽ tên cửa cho tất cả các tọa độ
                context.font = '12px Arial';

                // Nếu cửa có nhiều tọa độ, thêm số thứ tự vào tên
                const doorLabel = doorCoords.length > 1
                    ? `${door.name} (${doorCoords.indexOf(coordinate) + 1}/${doorCoords.length})`
                    : door.name;

                // Tính toán kích thước văn bản
                const textMetrics = context.measureText(doorLabel);
                const textWidth = textMetrics.width;
                const textHeight = 16; // Ước tính chiều cao của văn bản
                const padding = 4;

                // Tính toán vị trí để text nằm giữa nền mờ
                const textX = x + 10;
                const textY = y - 10;
                const bgX = textX - padding;
                const bgY = textY - textHeight * 0.75; // Điều chỉnh để text nằm giữa theo chiều dọc
                const bgWidth = textWidth + padding * 2;
                const bgHeight = textHeight + padding;

                // Vẽ nền mờ cho văn bản
                context.fillStyle = 'rgba(255, 255, 255, 0.7)';
                context.fillRect(bgX, bgY, bgWidth, bgHeight);

                // Vẽ văn bản
                context.fillStyle = isDragged ? '#10b981' : '#3b82f6';
                context.fillText(doorLabel, textX, textY);

                // Vẽ góc quay (nếu có)
                if (coordinate.rotation !== undefined && coordinate.rotation !== null) {
                    const angle = (coordinate.rotation * Math.PI) / 180;
                    const lineLength = 20;
                    const endX = x + Math.cos(angle) * lineLength;
                    const endY = y + Math.sin(angle) * lineLength;

                    context.beginPath();
                    context.moveTo(x, y);
                    context.lineTo(endX, endY);
                    context.strokeStyle = isDragged ? '#10b981' : '#3b82f6';
                    context.lineWidth = 2;
                    context.stroke();
                }
            });
        });

        // Vẽ các tọa độ cửa hiện tại (để chúng nằm trên cùng)
        coordinates.forEach((coordinate, index) => {
            // Kiểm tra xem tọa độ này có phải là tọa độ đang được kéo không
            const isDragged = isDragging && draggedCoordinate?.id === coordinate.id && !draggedDoor;

            // Sử dụng vị trí mới nếu đang kéo, ngược lại sử dụng vị trí cũ
            let x, y;
            if (isDragged && dragX !== undefined && dragY !== undefined) {
                x = dragX * scale;
                y = dragY * scale;
            } else {
                x = coordinate.x_coordinate * scale;
                y = coordinate.y_coordinate * scale;
            }

            const isSelected = coordinate.id === selectedCoordinateId;

            // Vẽ điểm tọa độ
            context.beginPath();
            context.arc(x, y, isSelected || isDragged ? 8 : 6, 0, 2 * Math.PI);
            context.fillStyle = isDragged ? '#10b981' : (isSelected ? '#4f46e5' : '#ef4444');
            context.fill();
            context.strokeStyle = '#ffffff';
            context.lineWidth = 2;
            context.stroke();

            // Hiển thị số thứ tự cho các tọa độ của cửa hiện tại
            if (coordinates.length > 1) {
                // Tạo nhãn với số thứ tự
                const label = `Tọa độ ${index + 1}/${coordinates.length}`;

                // Tính toán kích thước văn bản
                context.font = '12px Arial';
                const textMetrics = context.measureText(label);
                const textWidth = textMetrics.width;
                const textHeight = 16;
                const padding = 4;

                // Tính toán vị trí để text nằm giữa nền mờ
                const textX = x + 10;
                const textY = y - 10;
                const bgX = textX - padding;
                const bgY = textY - textHeight * 0.75; // Điều chỉnh để text nằm giữa theo chiều dọc
                const bgWidth = textWidth + padding * 2;
                const bgHeight = textHeight + padding;

                // Vẽ nền mờ cho văn bản
                context.fillStyle = 'rgba(255, 255, 255, 0.7)';
                context.fillRect(bgX, bgY, bgWidth, bgHeight);

                // Vẽ văn bản
                context.fillStyle = isDragged ? '#10b981' : (isSelected ? '#4f46e5' : '#ef4444');
                context.fillText(label, textX, textY);
            }

            // Vẽ góc quay (nếu có)
            if (coordinate.rotation !== undefined && coordinate.rotation !== null) {
                const angle = (coordinate.rotation * Math.PI) / 180;
                const lineLength = 20;
                const endX = x + Math.cos(angle) * lineLength;
                const endY = y + Math.sin(angle) * lineLength;

                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(endX, endY);
                context.strokeStyle = isDragged ? '#10b981' : (isSelected ? '#4f46e5' : '#ef4444');
                context.lineWidth = 2;
                context.stroke();
            }
        });
    };

    // Vẽ canvas khi có thay đổi
    useEffect(() => {
        if (!canvasRef.current || !isImageLoaded || !floorPlanImage) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Hàm vẽ canvas
        const drawCanvas = () => {
            // Xóa canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Vẽ hình ảnh sơ đồ tầng
            if (imageRef.current) {
                ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
                drawCoordinates(ctx);
            } else {
                const image = new Image();
                image.src = floorPlanImage;
                image.onload = () => {
                    imageRef.current = image;
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    drawCoordinates(ctx);
                };
                // Không cần return ở đây vì chúng ta đang trong một callback
            }
        };

        // Vẽ canvas
        drawCanvas();
    }, [floorPlanImage, coordinates, doorCoordinates, scale, selectedCoordinateId, isImageLoaded]);

    // Xử lý sự kiện mousedown trên canvas (bắt đầu kéo)
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;

        // Reset trạng thái justDragged khi bắt đầu một tương tác mới
        setJustDragged(false);
        if (dragTimeoutRef.current) {
            clearTimeout(dragTimeoutRef.current);
            dragTimeoutRef.current = null;
        }

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

        setCurrentMousePos({x, y});

        // Kiểm tra xem click có trúng tọa độ của cửa hiện tại không
        const clickedCoordinate = coordinates.find((coordinate) => {
            const coordX = coordinate.x_coordinate;
            const coordY = coordinate.y_coordinate;
            const distance = Math.sqrt(Math.pow(x - coordX, 2) + Math.pow(y - coordY, 2));
            return distance * scale < 10; // 10px là bán kính để xác định click trúng
        });

        if (clickedCoordinate) {
            if (enableDrag) {
                // Bắt đầu kéo tọa độ của cửa hiện tại
                setIsDragging(true);
                setDraggedCoordinate(clickedCoordinate);
                setDragStartPos({x, y});
                return;
            } else if (onCoordinateSelect && isEditable) {
                onCoordinateSelect(clickedCoordinate);
                return;
            }
        }

        // Kiểm tra xem click có trúng tọa độ của cửa khác không
        for (const {door, coordinates: doorCoords} of doorCoordinates) {
            if (!doorCoords || doorCoords.length === 0) continue;

            // Kiểm tra tất cả các tọa độ của cửa
            for (const coordinate of doorCoords) {
                if (!coordinate) continue;

                const coordX = coordinate.x_coordinate;
                const coordY = coordinate.y_coordinate;
                const distance = Math.sqrt(Math.pow(x - coordX, 2) + Math.pow(y - coordY, 2));

                if (distance * scale < 10) { // 10px là bán kính để xác định click trúng
                    if (enableDrag) {
                        // Bắt đầu kéo tọa độ của cửa khác
                        setIsDragging(true);
                        setDraggedCoordinate(coordinate);
                        setDraggedDoor(door);
                        setDragStartPos({x, y});
                        return;
                    } else if (onDoorSelect && !disableDoorNavigation) {
                        onDoorSelect(door);
                        return;
                    }
                }
            }
        }
    };

    // Xử lý sự kiện mousemove trên canvas (đang kéo)
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging || !canvasRef.current || !draggedCoordinate) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

        setCurrentMousePos({x, y});

        // Vẽ lại canvas với vị trí tạm thời của tọa độ đang kéo
        const ctx = canvas.getContext('2d');
        if (ctx && imageRef.current) {
            // Xóa canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Vẽ lại hình ảnh sơ đồ tầng
            ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

            // Vẽ lại tất cả các tọa độ
            drawCoordinates(ctx, x, y);
        }
    };

    // Xử lý sự kiện mouseup trên canvas (kết thúc kéo)
    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging || !draggedCoordinate || !canvasRef.current) {
            setIsDragging(false);
            setDraggedCoordinate(null);
            setDraggedDoor(null);
            return;
        }

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

        // Kiểm tra xem có phải là kéo thả thực sự không (di chuyển ít nhất 5px)
        const dragDistance = Math.sqrt(
            Math.pow(x - dragStartPos.x, 2) +
            Math.pow(y - dragStartPos.y, 2)
        );

        if (dragDistance > 5 / scale) { // Nếu di chuyển hơn 5px (đã điều chỉnh theo tỷ lệ)
            // Đánh dấu là vừa kéo thả xong
            setJustDragged(true);

            // Đặt timeout để reset trạng thái justDragged sau 300ms
            if (dragTimeoutRef.current) {
                clearTimeout(dragTimeoutRef.current);
            }
            dragTimeoutRef.current = setTimeout(() => {
                setJustDragged(false);
            }, 300);

            // Cập nhật tọa độ mới
            if (onCoordinateUpdate) {
                // Gọi callback để cập nhật tọa độ
                console.log('Calling onCoordinateUpdate with:', {
                    coordinate: draggedCoordinate,
                    x, y,
                    doorId: draggedDoor?.id
                });
                
                // Cập nhật tọa độ trong state local trước khi gọi API
                // Nếu tọa độ thuộc cửa khác, cập nhật trong doorCoordinates
                if (draggedDoor && doorCoordinates.some(item => item.door.id === draggedDoor.id)) {
                    const updatedDoorCoordinates = doorCoordinates.map(item => {
                        if (item.door.id === draggedDoor.id && item.coordinates) {
                            return {
                                ...item,
                                coordinates: item.coordinates.map(c => 
                                    c.id === draggedCoordinate.id 
                                        ? {...c, x_coordinate: x, y_coordinate: y} 
                                        : c
                                )
                            };
                        }
                        return item;
                    });
                    // Cập nhật state để re-render ngay lập tức
                    setDoorCoordinates(updatedDoorCoordinates);
                }
                
                // Cập nhật tọa độ hiện tại trong draggedCoordinate để vẽ lại canvas
                if (draggedCoordinate) {
                    // Cập nhật tọa độ trong draggedCoordinate
                    draggedCoordinate.x_coordinate = x;
                    draggedCoordinate.y_coordinate = y;
                }
                
                // Vẽ lại canvas với vị trí mới ngay lập tức
                if (canvasRef.current && imageRef.current) {
                    const ctx = canvasRef.current.getContext('2d');
                    if (ctx) {
                        // Xóa canvas
                        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        
                        // Vẽ lại hình ảnh sơ đồ tầng
                        ctx.drawImage(imageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                        
                        // Vẽ lại tất cả các tọa độ với vị trí mới
                        drawCoordinates(ctx);
                    }
                }
                
                // Gọi API để cập nhật tọa độ
                onCoordinateUpdate(draggedCoordinate, x, y);
            } else {
                // Hiển thị thông báo lỗi nếu không có callback
                console.error('No onCoordinateUpdate callback provided');
                toast.error('Không thể cập nhật tọa độ. Vui lòng thử lại.');
            }
        }

        // Reset trạng thái kéo
        setIsDragging(false);
        setDraggedCoordinate(null);
        setDraggedDoor(null);
    };

    // Xử lý sự kiện click trên canvas
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || isDragging) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

        // Kiểm tra xem có phải vừa kéo thả xong không
        if (justDragged) {
            // Nếu vừa kéo thả xong, không xử lý click
            return;
        }

        // Kiểm tra xem click có trúng tọa độ của cửa hiện tại không
        const clickedCoordinate = coordinates.find((coordinate) => {
            const coordX = coordinate.x_coordinate;
            const coordY = coordinate.y_coordinate;
            const distance = Math.sqrt(Math.pow(x - coordX, 2) + Math.pow(y - coordY, 2));
            return distance * scale < 10; // 10px là bán kính để xác định click trúng
        });

        if (clickedCoordinate && onCoordinateSelect && isEditable) {
            onCoordinateSelect(clickedCoordinate);
            return;
        }

        // Kiểm tra xem click có trúng tọa độ của cửa khác không
        for (const {door, coordinates: doorCoords} of doorCoordinates) {
            if (!doorCoords || doorCoords.length === 0) continue;

            // Kiểm tra tất cả các tọa độ của cửa
            for (const coordinate of doorCoords) {
                if (!coordinate) continue;

                const coordX = coordinate.x_coordinate;
                const coordY = coordinate.y_coordinate;
                const distance = Math.sqrt(Math.pow(x - coordX, 2) + Math.pow(y - coordY, 2));

                if (distance * scale < 10 && onDoorSelect && !disableDoorNavigation) { // 10px là bán kính để xác định click trúng
                    onDoorSelect(door);
                    return;
                }
            }
        }

        // Nếu không trúng tọa độ nào và đang ở chế độ chỉnh sửa, thêm tọa độ mới
        if (onCoordinateAdd && isEditable) {
            onCoordinateAdd(x, y);
        }
    };

    // Xử lý zoom in/out
    const handleZoomIn = () => {
        setScale((prevScale) => prevScale * 1.2);
    };

    const handleZoomOut = () => {
        setScale((prevScale) => prevScale / 1.2);
    };

    return (
        <div className="relative">
            <div className="mb-2 flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={handleZoomIn}
                    className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Phóng to
                </button>
                <button
                    type="button"
                    onClick={handleZoomOut}
                    className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Thu nhỏ
                </button>
            </div>

            <div ref={containerRef} className="border border-gray-300 rounded-lg overflow-hidden">
                {!floorPlanImage ? (
                    <div className="h-64 flex items-center justify-center bg-gray-100">
                        <p className="text-gray-500">Chưa có sơ đồ tầng</p>
                    </div>
                ) : !isImageLoaded ? (
                    <div className="h-64 flex items-center justify-center bg-gray-100">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <canvas
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        onMouseDown={enableDrag ? handleMouseDown : undefined}
                        onMouseMove={enableDrag ? handleMouseMove : undefined}
                        onMouseUp={enableDrag ? handleMouseUp : undefined}
                        onMouseLeave={enableDrag ? handleMouseUp : undefined}
                        className={`w-full ${isEditable ? 'cursor-crosshair' : (enableDrag ? 'cursor-move' : 'cursor-default')}`}
                    />
                )}
            </div>

            <div className="mt-2 text-sm text-gray-500">
                {isEditable && (
                    <p>Click vào sơ đồ để thêm tọa độ mới hoặc chọn tọa độ hiện có để chỉnh sửa.</p>
                )}
                {enableDrag && (
                    <p className="mt-1 text-green-600 font-medium">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                        Bạn có thể kéo thả các điểm để di chuyển vị trí của cửa.
                    </p>
                )}
                {doorCoordinates.some(item => item.coordinates && item.coordinates.length > 0) && (
                    <p className="mt-1">
                        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                        Các điểm màu xanh là vị trí của các cửa
                        khác. {!disableDoorNavigation && !enableDrag && "Click vào để chuyển sang cấu hình cho cửa đó."}
                    </p>
                )}
                {coordinates.length > 0 && (
                    <p className="mt-1">
                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                        Các điểm màu đỏ là vị trí của cửa hiện tại.
                    </p>
                )}
                {isLoadingMultipleCoordinates && (
                    <p className="mt-1 text-blue-500">Đang tải tọa độ của các cửa khác...</p>
                )}
            </div>
        </div>
    )
};

export default CoordinateVisualizer;