import React, {useEffect, useRef, useState} from 'react';
import {DoorCoordinate, ResMultipleDoorCoordinates, useGetMultipleDoorCoordinates} from '@/hooks/doorCoordinates';
import {Door} from '@/hooks/doors';

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
        onDoorSelect
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
            } as { data: ResMultipleDoorCoordinates, isLoading: boolean };
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
                drawCoordinates();
            } else {
                const image = new Image();
                image.src = floorPlanImage;
                image.onload = () => {
                    imageRef.current = image;
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    drawCoordinates();
                };
                // Không cần return ở đây vì chúng ta đang trong một callback
            }
        };

        // Hàm vẽ các tọa độ
        const drawCoordinates = () => {
            // Vẽ các tọa độ của các cửa khác trước (để chúng nằm dưới cửa hiện tại)
            doorCoordinates.forEach(({door, coordinates: doorCoords}) => {
                if (!doorCoords || doorCoords.length === 0) return;

                // Vẽ tất cả các tọa độ của cửa khác
                doorCoords.forEach((coordinate) => {
                    if (!coordinate) return;

                    const x = coordinate.x_coordinate * scale;
                    const y = coordinate.y_coordinate * scale;

                    // Vẽ điểm tọa độ cho cửa khác với màu khác
                    ctx.beginPath();
                    ctx.arc(x, y, 6, 0, 2 * Math.PI);
                    ctx.fillStyle = '#3b82f6'; // Màu xanh dương cho các cửa khác
                    ctx.fill();
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Vẽ tên cửa cho tất cả các tọa độ
                    ctx.font = '12px Arial';

                    // Nếu cửa có nhiều tọa độ, thêm số thứ tự vào tên
                    const doorLabel = doorCoords.length > 1
                        ? `${door.name} (${doorCoords.indexOf(coordinate) + 1}/${doorCoords.length})`
                        : door.name;

                    // Tính toán kích thước văn bản
                    const textMetrics = ctx.measureText(doorLabel);
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
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    ctx.fillRect(bgX, bgY, bgWidth, bgHeight);

                    // Vẽ văn bản
                    ctx.fillStyle = '#3b82f6';
                    ctx.fillText(doorLabel, textX, textY);

                    // Vẽ góc quay (nếu có)
                    if (coordinate.rotation !== undefined && coordinate.rotation !== null) {
                        const angle = (coordinate.rotation * Math.PI) / 180;
                        const lineLength = 20;
                        const endX = x + Math.cos(angle) * lineLength;
                        const endY = y + Math.sin(angle) * lineLength;

                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(endX, endY);
                        ctx.strokeStyle = '#3b82f6';
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                });
            });

            // Vẽ các tọa độ cửa hiện tại (để chúng nằm trên cùng)
            coordinates.forEach((coordinate, index) => {
                const x = coordinate.x_coordinate * scale;
                const y = coordinate.y_coordinate * scale;
                const isSelected = coordinate.id === selectedCoordinateId;

                // Vẽ điểm tọa độ
                ctx.beginPath();
                ctx.arc(x, y, isSelected ? 8 : 6, 0, 2 * Math.PI);
                ctx.fillStyle = isSelected ? '#4f46e5' : '#ef4444';
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Hiển thị số thứ tự cho các tọa độ của cửa hiện tại
                if (coordinates.length > 1) {
                    // Tạo nhãn với số thứ tự
                    const label = `Tọa độ ${index + 1}/${coordinates.length}`;

                    // Tính toán kích thước văn bản
                    ctx.font = '12px Arial';
                    const textMetrics = ctx.measureText(label);
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
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    ctx.fillRect(bgX, bgY, bgWidth, bgHeight);

                    // Vẽ văn bản
                    ctx.fillStyle = isSelected ? '#4f46e5' : '#ef4444';
                    ctx.fillText(label, textX, textY);
                }

                // Vẽ góc quay (nếu có)
                if (coordinate.rotation !== undefined && coordinate.rotation !== null) {
                    const angle = (coordinate.rotation * Math.PI) / 180;
                    const lineLength = 20;
                    const endX = x + Math.cos(angle) * lineLength;
                    const endY = y + Math.sin(angle) * lineLength;

                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(endX, endY);
                    ctx.strokeStyle = isSelected ? '#4f46e5' : '#ef4444';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            });
        };

        // Vẽ canvas
        drawCanvas();

        // Sử dụng một tham chiếu ổn định cho scale để tránh re-render không cần thiết
    }, [floorPlanImage, coordinates, doorCoordinates, scale, selectedCoordinateId, isImageLoaded]);

    // Xử lý sự kiện click trên canvas
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

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

                if (distance * scale < 10 && onDoorSelect) { // 10px là bán kính để xác định click trúng
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
                        className={`w-full ${isEditable ? 'cursor-crosshair' : 'cursor-default'}`}
                    />
                )}
            </div>

            <div className="mt-2 text-sm text-gray-500">
                {isEditable && (
                    <p>Click vào sơ đồ để thêm tọa độ mới hoặc chọn tọa độ hiện có để chỉnh sửa.</p>
                )}
                {doorCoordinates.some(item => item.coordinates && item.coordinates.length > 0) && (
                    <p className="mt-1">
                        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                        Các điểm màu xanh là vị trí của các cửa khác. Click vào để chuyển sang cấu hình cho cửa đó.
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
    );
};

export default CoordinateVisualizer;