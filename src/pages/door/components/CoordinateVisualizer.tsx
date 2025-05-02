import React, {useEffect, useRef, useState} from 'react';
import {DoorCoordinate} from '@/hooks/doorCoordinates';

interface CoordinateVisualizerProps {
    floorPlanImage: string;
    coordinates: DoorCoordinate[];
    onCoordinateSelect?: (coordinate: DoorCoordinate) => void;
    onCoordinateAdd?: (x: number, y: number) => void;
    isEditable?: boolean;
    selectedCoordinateId?: number;
}

const CoordinateVisualizer: React.FC<CoordinateVisualizerProps> = ({
                                                                       floorPlanImage,
                                                                       coordinates,
                                                                       onCoordinateSelect,
                                                                       onCoordinateAdd,
                                                                       isEditable = false,
                                                                       selectedCoordinateId
                                                                   }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [imageSize, setImageSize] = useState({width: 0, height: 0});

    // Tải hình ảnh sơ đồ tầng
    useEffect(() => {
        if (!floorPlanImage) return;

        const image = new Image();
        image.src = floorPlanImage;
        image.onload = () => {
            setIsImageLoaded(true);
            setImageSize({width: image.width, height: image.height});
        };
    }, [floorPlanImage]);

    // Vẽ canvas khi có thay đổi
    useEffect(() => {
        if (!canvasRef.current || !isImageLoaded || !floorPlanImage) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Thiết lập kích thước canvas
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            canvas.width = containerWidth;
            canvas.height = (imageSize.height / imageSize.width) * containerWidth;
            setScale(containerWidth / imageSize.width);
        }

        // Xóa canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Vẽ hình ảnh sơ đồ tầng
        const image = new Image();
        image.src = floorPlanImage;
        image.onload = () => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            // Vẽ các tọa độ cửa
            coordinates.forEach((coordinate) => {
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
    }, [floorPlanImage, coordinates, isImageLoaded, imageSize, scale, selectedCoordinateId]);

    // Xử lý sự kiện click trên canvas
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || !isEditable) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

        // Kiểm tra xem click có trúng tọa độ nào không
        const clickedCoordinate = coordinates.find((coordinate) => {
            const coordX = coordinate.x_coordinate;
            const coordY = coordinate.y_coordinate;
            const distance = Math.sqrt(Math.pow(x - coordX, 2) + Math.pow(y - coordY, 2));
            return distance * scale < 10; // 10px là bán kính để xác định click trúng
        });

        if (clickedCoordinate && onCoordinateSelect) {
            onCoordinateSelect(clickedCoordinate);
        } else if (onCoordinateAdd) {
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

            {isEditable && (
                <div className="mt-2 text-sm text-gray-500">
                    <p>Click vào sơ đồ để thêm tọa độ mới hoặc chọn tọa độ hiện có để chỉnh sửa.</p>
                </div>
            )}
        </div>
    );
};

export default CoordinateVisualizer;