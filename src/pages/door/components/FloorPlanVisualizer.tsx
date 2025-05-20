import React, { useEffect, useRef, useState } from 'react';
import { Door } from '@/hooks/doors';
import { DoorCoordinate } from '@/hooks/doorCoordinates';

interface FloorPlanVisualizerProps {
    floorPlanImage: string;
    doors: Door[];
    onDoorSelect?: (door: Door) => void;
    doorCoordinates?: { door: Door, coordinates: DoorCoordinate[] }[];
}

const FloorPlanVisualizer: React.FC<FloorPlanVisualizerProps> = ({
    floorPlanImage,
    onDoorSelect,
    doorCoordinates = []
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [error, setError] = useState<string | null>(null);

    // Function to draw on canvas
    const drawCanvas = (
        image: HTMLImageElement,
        canvas: HTMLCanvasElement,
        container: HTMLDivElement
    ) => {
        const context = canvas.getContext('2d');
        if (!context) {
            console.error('Debug - Failed to get canvas context');
            return;
        }

        // Get container dimensions
        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        // Maximum dimensions (1920x1080)
        const maxWidth = Math.min(1920, containerWidth);
        const maxHeight = Math.min(1080, containerHeight);

        // Calculate scale to fit the image while maintaining aspect ratio
        const scaleX = maxWidth / image.width;
        const scaleY = maxHeight / image.height;
        const scale = Math.min(scaleX, scaleY);

        // Calculate dimensions that maintain aspect ratio
        const scaledWidth = Math.floor(image.width * scale);
        const scaledHeight = Math.floor(image.height * scale);

        // Update canvas size
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
        canvas.style.width = `${scaledWidth}px`;
        canvas.style.height = `${scaledHeight}px`;

        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw image
        try {
            context.drawImage(image, 0, 0, scaledWidth, scaledHeight);
            console.log('Debug - Image drawn successfully');

            // Draw door markers
            doorCoordinates.forEach(({ door, coordinates }) => {
                coordinates.forEach(coord => {
                    const markerX = coord.x_coordinate * scale;
                    const markerY = coord.y_coordinate * scale;

                    // Draw door marker
                    context.beginPath();
                    context.arc(markerX, markerY, 6, 0, 2 * Math.PI);

                    // Set color based on door status
                    let fillColor;
                    if (door.lock_status === 'open') {
                        fillColor = '#10b981'; // Green for open
                    } else if (door.lock_status === 'closed') {
                        fillColor = '#ef4444'; // Red for closed
                    } else {
                        fillColor = '#3b82f6'; // Blue for unknown status
                    }

                    context.fillStyle = fillColor;
                    context.fill();
                    context.strokeStyle = '#ffffff';
                    context.lineWidth = 2;
                    context.stroke();

                    // Draw door name
                    context.font = '12px Arial';
                    context.fillStyle = fillColor;
                    const text = door.name;
                    const textWidth = context.measureText(text).width;
                    
                    // Draw background for text
                    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    context.fillRect(markerX - textWidth/2 - 4, markerY - 24, textWidth + 8, 20);
                    
                    // Draw text
                    context.fillStyle = fillColor;
                    context.textAlign = 'center';
                    context.fillText(text, markerX, markerY - 10);
                });
            });
        } catch (error) {
            console.error('Debug - Error drawing image:', error);
            setError('Failed to draw image');
        }
    };

    // Load and draw floor plan image
    useEffect(() => {
        if (!floorPlanImage || !containerRef.current) return;

        const container = containerRef.current;
        
        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.style.maxWidth = '100%';
        canvas.style.maxHeight = '100%';
        canvas.style.objectFit = 'contain';
        canvas.className = 'cursor-pointer';
        
        // Add canvas to container
        container.appendChild(canvas);
        canvasRef.current = canvas;

        // Handle canvas click
        const handleClick = (e: MouseEvent) => {
            if (!onDoorSelect || !imageLoaded) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate scale
            const scale = canvas.width / imageSize.width;

            // Check if click is on any door marker
            doorCoordinates.forEach(({ door, coordinates }) => {
                coordinates.forEach(coord => {
                    const markerX = coord.x_coordinate * scale;
                    const markerY = coord.y_coordinate * scale;
                    const distance = Math.sqrt(Math.pow(x - markerX, 2) + Math.pow(y - markerY, 2));

                    if (distance <= 10) { // 10px click radius
                        onDoorSelect(door);
                    }
                });
            });
        };

        canvas.addEventListener('click', handleClick);

        console.log('Debug - Loading image:', floorPlanImage);
        const image = new Image();
        
        image.onload = () => {
            console.log('Debug - Image loaded successfully:', {
                width: image.width,
                height: image.height,
                src: image.src
            });
            setImageSize({ width: image.width, height: image.height });
            setImageLoaded(true);
            setError(null);
            drawCanvas(image, canvas, container);
        };

        image.onerror = (error) => {
            console.error('Debug - Image load error:', error);
            setError('Failed to load image');
            setImageLoaded(false);
        };

        // Try loading with and without CORS
        image.crossOrigin = "anonymous";
        image.src = floorPlanImage;

        // If CORS fails, try without it
        image.addEventListener('error', () => {
            console.log('Debug - Retrying without CORS');
            image.crossOrigin = "";
            image.src = floorPlanImage;
        });

        // Set up resize observer
        const resizeObserver = new ResizeObserver(() => {
            if (imageLoaded) {
                drawCanvas(image, canvas, container);
            }
        });
        resizeObserver.observe(container);

        // Cleanup
        return () => {
            resizeObserver.disconnect();
            canvas.removeEventListener('click', handleClick);
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
            canvasRef.current = null;
        };
    }, [floorPlanImage, doorCoordinates, imageLoaded, imageSize.width, onDoorSelect]);

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