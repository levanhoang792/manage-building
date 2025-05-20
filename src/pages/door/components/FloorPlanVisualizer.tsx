import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Door } from '@/hooks/doors';
import { DoorCoordinate } from '@/hooks/doorCoordinates';
import { useQueries } from '@tanstack/react-query';
import { httpGet } from '@/utils/api';
import { API_ROUTES } from '@/routes/api';
import { toast } from 'sonner';

interface FloorPlanVisualizerProps {
    floorPlanImage: string;
    doors: Door[];
    onDoorSelect?: (door: Door) => void;
    doorCoordinates?: { door: Door, coordinates: DoorCoordinate[] }[];
    buildingId?: string;
    floorId?: string;
}

const FloorPlanVisualizer: React.FC<FloorPlanVisualizerProps> = ({
    floorPlanImage,
    onDoorSelect,
    doorCoordinates = [],
    buildingId,
    floorId
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const baseCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const animationFrameRef = useRef<number>();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [error, setError] = useState<string | null>(null);
    
    interface DoorStatus {
        message?: string;
        r?: number;
        data?: {
            hasPendingRequest?: boolean;
            requestDetails?: {
                requester_name?: string;
            };
            request?: {
                requester_name?: string;
                request_time?: string;
                status?: string;
            } | null;
            door_status?: string;
        };
    }
    
    const [doorStatuses, setDoorStatuses] = useState<Record<string, DoorStatus>>({});

    // Get door request status for all doors
    const queries = useQueries({
        queries: doorCoordinates.map(({ door }) => ({
            queryKey: ['doorRequestStatus', buildingId, floorId, door.id],
            queryFn: async () => {
                const uri = API_ROUTES.DOOR_REQUEST_STATUS
                    .replace(':buildingId', buildingId || '')
                    .replace(':floorId', floorId || '')
                    .replace(':doorId', door.id.toString());
                const resp = await httpGet({ uri });
                const data = await resp.json();
                console.log(`Door ${door.id} status update:`, {
                    lockStatus: door.lock_status,
                    responseData: data,
                    currentStatus: doorStatuses[door.id]
                });
                return data;
            },
            enabled: !!buildingId && !!floorId && !!door.id,
            refetchInterval: 5000,
            staleTime: 0,
            cacheTime: 0,
            refetchOnWindowFocus: true,
            retry: 0
        }))
    });

    // Update door statuses when queries change
    useEffect(() => {
        const newStatuses: Record<string, DoorStatus> = {};
        let hasChanges = false;

        queries.forEach((query, index) => {
            if (query.data) {
                const door = doorCoordinates[index].door;
                const currentStatus = doorStatuses[door.id];
                
                // Chỉ cập nhật nếu dữ liệu thực sự thay đổi
                if (!currentStatus || 
                    JSON.stringify(currentStatus) !== JSON.stringify(query.data)) {
                    newStatuses[door.id] = query.data;
                    hasChanges = true;
                } else {
                    newStatuses[door.id] = currentStatus;
                }
            }
        });
        
        // Chỉ cập nhật state nếu có sự thay đổi thực sự
        if (hasChanges) {
            console.log('Updating door statuses due to changes:', newStatuses);
            setDoorStatuses(newStatuses);
        }
    }, [queries, doorCoordinates, doorStatuses]);

    // Function to setup canvas with correct size
    const setupCanvas = useCallback((
        canvas: HTMLCanvasElement,
        container: HTMLDivElement,
        image: HTMLImageElement
    ) => {
        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        const maxWidth = Math.min(1920, containerWidth);
        const maxHeight = Math.min(1080, containerHeight);

        const scaleX = maxWidth / image.width;
        const scaleY = maxHeight / image.height;
        const scale = Math.min(scaleX, scaleY);

        const scaledWidth = Math.floor(image.width * scale);
        const scaledHeight = Math.floor(image.height * scale);

        if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
            canvas.width = scaledWidth;
            canvas.height = scaledHeight;
            canvas.style.width = `${scaledWidth}px`;
            canvas.style.height = `${scaledHeight}px`;
        }

        return { scale, width: scaledWidth, height: scaledHeight };
    }, []);

    // Draw background image
    const drawBackground = useCallback(() => {
        const container = containerRef.current;
        const canvas = baseCanvasRef.current;
        const image = imageRef.current;

        if (!container || !canvas || !image || !imageLoaded) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const { width, height } = setupCanvas(canvas, container, image);
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
    }, [imageLoaded, setupCanvas]);

    // Draw door markers
    const updateDoorMarkers = useCallback(() => {
        const container = containerRef.current;
        const canvas = overlayCanvasRef.current;
        const image = imageRef.current;

        if (!container || !canvas || !image || !imageLoaded) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const { scale, width, height } = setupCanvas(canvas, container, image);
        context.clearRect(0, 0, width, height);

        doorCoordinates.forEach(({ door, coordinates }) => {
            const doorStatus = doorStatuses[door.id];
            
            coordinates.forEach(coord => {
                const markerX = coord.x_coordinate * scale;
                const markerY = coord.y_coordinate * scale;

                // Draw door marker
                context.beginPath();
                context.arc(markerX, markerY, 6, 0, 2 * Math.PI);

                let fillColor;
                // Đảm bảo hasPendingRequest được ưu tiên cao nhất
                if (doorStatus?.data?.hasPendingRequest === true) {
                    fillColor = '#f59e0b';
                } else if (doorStatus?.data?.door_status === 'open') {
                    fillColor = '#10b981';
                    console.log(`Door ${door.id} is open:`, {
                        doorStatus: doorStatus?.data?.door_status,
                        lockStatus: door.lock_status,
                        fullStatus: doorStatus
                    });
                } else if (doorStatus?.data?.door_status === 'closed') {
                    fillColor = '#ef4444';
                    console.log(`Door ${door.id} is closed:`, {
                        doorStatus: doorStatus?.data?.door_status,
                        lockStatus: door.lock_status,
                        fullStatus: doorStatus
                    });
                } else {
                    fillColor = '#3b82f6';
                    console.log(`Door ${door.id} status unknown:`, {
                        doorStatus: doorStatus?.data?.door_status,
                        lockStatus: door.lock_status,
                        fullStatus: doorStatus
                    });
                }

                // Draw pulsing circle effect
                const now = Date.now();
                const pulseRadius = 6 + Math.sin(now / 500) * 2; // Pulse between 4 and 8 pixels
                const pulseOpacity = 0.3 + Math.sin(now / 500) * 0.2; // Pulse opacity between 0.1 and 0.5

                // Draw outer pulsing circle
                context.beginPath();
                context.arc(markerX, markerY, pulseRadius + 4, 0, 2 * Math.PI);
                context.fillStyle = fillColor.replace(')', `, ${pulseOpacity})`).replace('rgb', 'rgba');
                context.fill();

                // Draw main marker
                context.beginPath();
                context.arc(markerX, markerY, 6, 0, 2 * Math.PI);
                context.fillStyle = fillColor;
                context.fill();
                context.strokeStyle = '#ffffff';
                context.lineWidth = 2;
                context.stroke();

                // Draw door name
                context.font = '12px Arial';
                const text = door.name;
                const textWidth = context.measureText(text).width;
                
                context.fillStyle = 'rgba(255, 255, 255, 0.8)';
                context.fillRect(markerX - textWidth/2 - 4, markerY - 34, textWidth + 8, 20);
                
                context.fillStyle = fillColor;
                context.textAlign = 'center';
                context.fillText(text, markerX, markerY - 20);

                if (doorStatus?.data?.hasPendingRequest === true) {
                    const indicatorText = "Đang chờ duyệt";
                    const indicatorWidth = context.measureText(indicatorText).width;
                    
                    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    context.fillRect(markerX - indicatorWidth/2 - 4, markerY - 44, indicatorWidth + 8, 20);
                    
                    context.fillStyle = '#f59e0b';
                    context.fillText(indicatorText, markerX, markerY - 30);

                    if (doorStatus?.data?.request?.requester_name) {
                        const requesterText = doorStatus.data.request.requester_name;
                        const requesterWidth = context.measureText(requesterText).width;
                        
                        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        context.fillRect(markerX - requesterWidth/2 - 4, markerY - 64, requesterWidth + 8, 20);
                        
                        context.fillStyle = '#f59e0b';
                        context.fillText(requesterText, markerX, markerY - 50);
                    }
                }
            });
        });
    }, [imageLoaded, setupCanvas, doorCoordinates, doorStatuses]);

    // Update markers when door status changes
    useEffect(() => {
        console.log('Door statuses changed:', doorStatuses);
        if (imageLoaded) {
            updateDoorMarkers();
        }
    }, [imageLoaded, doorStatuses, updateDoorMarkers]);

    // Add animation frame update
    useEffect(() => {
        const animate = () => {
            if (imageLoaded) {
                updateDoorMarkers();
            }
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [imageLoaded, updateDoorMarkers]);

    // Initialize canvases and load image
    useEffect(() => {
        if (!floorPlanImage || !containerRef.current) return;

        const container = containerRef.current;

        // Create base canvas for background
        if (!baseCanvasRef.current) {
            const canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.maxWidth = '100%';
            canvas.style.maxHeight = '100%';
            canvas.style.objectFit = 'contain';
            container.appendChild(canvas);
            baseCanvasRef.current = canvas;
        }

        // Create overlay canvas for markers
        if (!overlayCanvasRef.current) {
            const canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.maxWidth = '100%';
            canvas.style.maxHeight = '100%';
            canvas.style.objectFit = 'contain';
            canvas.className = 'cursor-pointer';
            container.appendChild(canvas);
            overlayCanvasRef.current = canvas;

            // Handle click events on overlay canvas
            canvas.addEventListener('click', (e: MouseEvent) => {
                if (!onDoorSelect || !imageLoaded) return;

                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const scale = canvas.width / imageSize.width;

                doorCoordinates.forEach(({ door, coordinates }) => {
                    const doorStatus = doorStatuses[door.id];
                    const hasPendingRequest = doorStatus?.data?.hasPendingRequest;

                    coordinates.forEach(coord => {
                        const markerX = coord.x_coordinate * scale;
                        const markerY = coord.y_coordinate * scale;
                        const distance = Math.sqrt(Math.pow(x - markerX, 2) + Math.pow(y - markerY, 2));

                        if (distance <= 10) {
                            if (hasPendingRequest) {
                                toast.error('Cửa đang chờ duyệt, không thể tạo thêm yêu cầu!');
                                return;
                            }
                            onDoorSelect(door);
                        }
                    });
                });
            });
        }

        // Load image if not already loaded
        if (!imageRef.current) {
            const image = new Image();
            image.crossOrigin = "anonymous";
            
            image.onload = () => {
                setImageSize({ width: image.width, height: image.height });
                setImageLoaded(true);
                setError(null);
                imageRef.current = image;
                drawBackground();
                updateDoorMarkers();
            };

            image.onerror = () => {
                setError('Failed to load image');
                setImageLoaded(false);
            };

            image.src = floorPlanImage;
        }

        return () => {
            if (baseCanvasRef.current && baseCanvasRef.current.parentNode) {
                baseCanvasRef.current.parentNode.removeChild(baseCanvasRef.current);
            }
            if (overlayCanvasRef.current && overlayCanvasRef.current.parentNode) {
                overlayCanvasRef.current.parentNode.removeChild(overlayCanvasRef.current);
            }
            baseCanvasRef.current = null;
            overlayCanvasRef.current = null;
            imageRef.current = null;
        };
    }, [floorPlanImage, drawBackground, onDoorSelect, imageLoaded, imageSize.width]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (imageLoaded) {
                drawBackground();
                updateDoorMarkers();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [imageLoaded, drawBackground, updateDoorMarkers]);

    return (
        <div 
            ref={containerRef} 
            className="w-full h-full relative bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center"
        >
            {error ? (
                <div className="text-red-500">{error}</div>
            ) : !imageLoaded && (
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
            )}
        </div>
    );
};

export default FloorPlanVisualizer; 