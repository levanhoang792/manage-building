import {cn} from '@/lib/utils.ts';
import {Button, Field, Label} from '@headlessui/react';
import {useState, useRef, useEffect} from 'react';
import {z} from 'zod';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import Modal from '@/components/commons/Modal';
import FieldError from '@/components/FieldError';
import DoorTooltip from '@/components/DoorTooltip';
import {motion} from 'framer-motion';
import ImageBg from '@/assets/images/mat-bang-layout-landmark-81-tang-6.jpg';

// Add keyframes for heartbeat animation
const heartbeatAnimation = `
@keyframes heartbeat {
    0% {
        transform: scale(1);
    }
    14% {
        transform: scale(1.3);
    }
    28% {
        transform: scale(1);
    }
    42% {
        transform: scale(1.3);
    }
    70% {
        transform: scale(1);
    }
}
`;

// Add style element to inject the animation
const AnimationStyle = () => <style>{heartbeatAnimation}</style>;

const mockBuildings = [
    {id: 1, name: 'Building A'},
    {id: 2, name: 'Building B'},
    {id: 3, name: 'Building C'}
];

const mockDoors = [
    {id: 1, x: 50, y: 25, status: 'closed', name: 'Cửa chính', details: 'Cửa ra vào chính của tầng'},
    {id: 2, x: 45, y: 40, status: 'open', name: 'Cửa phòng họp', details: 'Phòng họp chính'},
    {id: 3, x: 65, y: 30, status: 'closed', name: 'Cửa văn phòng', details: 'Khu vực văn phòng làm việc'},
    {id: 4, x: 70, y: 60, status: 'open', name: 'Cửa phụ', details: 'Lối ra phụ của tầng'}
];

interface LocationFormData {
    buildingId: string;
    floorId: string;
}

const FormSchema: z.ZodType<LocationFormData> = z.object({
    buildingId: z.string().nonempty('Building is required'),
    floorId: z.string().nonempty('Floor is required')
});

function LocationSelect() {
    const {
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<LocationFormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            buildingId: '',
            floorId: ''
        }
    });

    const [floors] = useState([
        {id: 1, name: 'Floor 1'},
        {id: 2, name: 'Floor 2'},
        {id: 3, name: 'Floor 3'}
    ]);

    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedDoor, setSelectedDoor] = useState<{
        id: number;
        x: number;
        y: number;
        status: string;
        name: string;
        details: string;
    } | null>(null);
    const [mockDoorsState, setMockDoorsState] = useState(mockDoors);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    console.log('------> Line: 58 | LocationSelect.tsx selectedDoor: ', selectedDoor);

    // Hàm mô phỏng gọi API
    const callDoorStatusAPI = (doorId: number, newStatus: string) => {
        return new Promise<void>((resolve) => {
            // Giả lập thời gian gọi API (1-2 giây)
            const delay = 1000 + Math.random() * 1000;
            setTimeout(() => {
                console.log(`API call completed for door ${doorId}: Status changed to ${newStatus}`);
                resolve();
            }, delay);
        });
    };

    const toggleDoorStatus = (doorId: number) => {
        // Tìm cửa hiện tại
        const currentDoor = mockDoorsState.find(door => door.id === doorId);
        if (!currentDoor) return;

        // Xác định trạng thái mới sẽ chuyển sang sau khi API thành công
        const targetStatus = currentDoor.status === 'open' ? 'closed' : 'open';

        // Đặt trạng thái "pending" trước khi gọi API
        setMockDoorsState((prevDoors) => {
            return prevDoors.map((door) => {
                if (door.id === doorId) {
                    return {
                        ...door,
                        status: 'pending'
                    };
                }
                return door;
            });
        });

        // Cập nhật selectedDoor nếu đang được chọn
        setSelectedDoor((prev) => {
            if (prev?.id === doorId) {
                return {
                    ...prev,
                    status: 'pending'
                };
            }
            return prev;
        });

        // Gọi API giả lập
        callDoorStatusAPI(doorId, targetStatus).then(() => {
            // Sau khi API trả về thành công, cập nhật trạng thái cuối cùng
            setMockDoorsState((prevDoors) => {
                return prevDoors.map((door) => {
                    if (door.id === doorId) {
                        return {
                            ...door,
                            status: targetStatus
                        };
                    }
                    return door;
                });
            });

            // Cập nhật selectedDoor nếu đang được chọn
            setSelectedDoor((prev) => {
                if (prev?.id === doorId) {
                    return {
                        ...prev,
                        status: targetStatus
                    };
                }
                return prev;
            });
        });
    };

    // Theo dõi kích thước của container và ảnh
    useEffect(() => {
        if (!showImageModal) return;

        const updateDimensions = () => {
            if (imageRef.current) {
                setImageDimensions({
                    width: imageRef.current.clientWidth,
                    height: imageRef.current.clientHeight
                });
            }
        };

        const imageElement = imageRef.current;
        
        // Cập nhật ngay khi ảnh được tải
        if (imageElement?.complete) {
            updateDimensions();
        } else if (imageElement) {
            imageElement.onload = updateDimensions;
        }

        // Thêm event listener để phát hiện thay đổi kích thước
        const resizeObserver = new ResizeObserver(updateDimensions);
        
        if (imageContainerRef.current) {
            resizeObserver.observe(imageContainerRef.current);
        }
        
        if (imageElement) {
            resizeObserver.observe(imageElement);
        }

        return () => {
            resizeObserver.disconnect();
            if (imageElement) {
                imageElement.onload = null;
            }
        };
    }, [showImageModal]);

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        setShowImageModal(true);
    });

    // Tính toán vị trí thực tế của các điểm dựa trên kích thước ảnh hiện tại
    const calculateDoorPosition = (x: number, y: number) => {
        // Nếu chưa có kích thước ảnh, sử dụng vị trí phần trăm
        if (imageDimensions.width === 0 || imageDimensions.height === 0) {
            return { left: `${x}%`, top: `${y}%` };
        }

        // Lấy kích thước của container
        const containerWidth = imageContainerRef.current?.clientWidth || 0;
        const containerHeight = imageContainerRef.current?.clientHeight || 0;
        
        // Tính offset để căn giữa ảnh trong container
        const offsetX = (containerWidth - imageDimensions.width) / 2;
        const offsetY = (containerHeight - imageDimensions.height) / 2;
        
        // Vị trí theo tỷ lệ phần trăm của ảnh gốc
        const actualX = (x / 100) * imageDimensions.width + offsetX;
        const actualY = (y / 100) * imageDimensions.height + offsetY;
        
        return {
            left: `${actualX}px`,
            top: `${actualY}px`,
        };
    };

    return (
        <>
            <AnimationStyle/>
            <div
                className={cn('backdrop-blur-[20px] bg-transparent rounded-xl py-8 px-11 w-[420px]')}
                style={{boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', border: '2px solid rgba(255, 255, 255, 0.2)'}}>
                <h1 className={cn('text-3xl font-bold text-white text-center mb-5')}>Select Location</h1>

                <form className="w-full" onSubmit={onSubmit}>
                    <Controller
                        control={control}
                        name="buildingId"
                        render={({field}) => (
                            <Field className="mb-2">
                                <Label className="text-sm/6 font-medium text-white">Building</Label>
                                <select
                                    {...field}
                                    className={cn(
                                        'block w-full rounded-full border-0 bg-white/5 text-white py-2 px-4 text-sm/6',
                                        'outline-none outline-1 -outline-offset-2 outline-white/25',
                                        'focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-2 data-[focus]:outline-white/50 transition-all'
                                    )}>
                                    <option value="" className="bg-gray-800">
                                        Select Building
                                    </option>
                                    {mockBuildings.map((building) => (
                                        <option key={building.id} value={building.id} className="bg-gray-800">
                                            {building.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        )}
                    />
                    <FieldError error={errors.buildingId}/>

                    <Controller
                        control={control}
                        name="floorId"
                        render={({field}) => (
                            <Field className="mb-2 mt-5">
                                <Label className="text-sm/6 font-medium text-white">Floor</Label>
                                <select
                                    {...field}
                                    className={cn(
                                        'block w-full rounded-full border-0 bg-white/5 text-white py-2 px-4 text-sm/6',
                                        'outline-none outline-1 -outline-offset-2 outline-white/25',
                                        'focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-2 data-[focus]:outline-white/50 transition-all'
                                    )}>
                                    <option value="" className="bg-gray-800">
                                        Select Floor
                                    </option>
                                    {floors.map((floor) => (
                                        <option key={floor.id} value={floor.id} className="bg-gray-800">
                                            {floor.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        )}
                    />
                    <FieldError error={errors.floorId}/>

                    <Button
                        type="submit"
                        className={cn(
                            'inline-flex items-center justify-center gap-2 bg-white py-1.5 px-3 text-sm/6 w-full rounded-full mt-5',
                            'font-semibold text-gray-800 shadow-inner shadow-white/10 focus:outline-none transition-all',
                            'data-[focus]:outline-1 data-[focus]:outline-white',
                            'data-[hover]:bg-purple-600 data-[open]:bg-purple-600',
                            'data-[hover]:text-neutral-200 data-[open]:text-neutral-200'
                        )}>
                        Submit
                    </Button>
                </form>
            </div>

            <Modal
                show={showImageModal}
                title="Floor Layout"
                onClose={() => setShowImageModal(false)}
                className="w-full h-full max-w-full flex flex-col justify-center overflow-hidden"
                backdropClassName="p-12">
                <div 
                    ref={imageContainerRef}
                    className="flex justify-center items-center flex-grow overflow-hidden relative">
                    <img 
                        ref={imageRef}
                        src={ImageBg} 
                        alt="Floor Layout" 
                        className="w-auto h-full object-contain rounded-lg"
                    />
                    {mockDoorsState.map((door) => {
                        const position = calculateDoorPosition(door.x, door.y);
                        return (
                            <div
                                key={door.id}
                                className="absolute"
                                style={{
                                    left: position.left,
                                    top: position.top,
                                    transform: 'translate(-50%, -50%)'
                                }}>
                                <DoorTooltip
                                    content={
                                        <div className="p-2">
                                            <p className="font-bold mb-1">{door.name}</p>
                                            <p className="mb-1">{door.details}</p>
                                            <p>Trạng thái: {
                                                door.status === 'open' ? 'Đang mở' :
                                                    door.status === 'closed' ? 'Đang đóng' :
                                                        'Đang xử lý...'
                                            }</p>
                                        </div>
                                    }>
                                    <div className="relative">
                                        {/* Lớp nền có hiệu ứng heartbeat */}
                                        <motion.div
                                            className={cn(
                                                'absolute w-6 h-6 rounded-full',
                                                door.status === 'open' ? 'bg-green-500' :
                                                    door.status === 'closed' ? 'bg-red-500' :
                                                        'bg-yellow-500',
                                                'opacity-50'
                                            )}
                                            animate={{
                                                scale: [1, 1.4, 1]
                                            }}
                                            transition={{
                                                duration: 2,
                                                ease: 'easeInOut',
                                                times: [0, 0.5, 1],
                                                repeat: Infinity,
                                                repeatDelay: 0.3
                                            }}
                                        />
                                        {/* Phần tử chính giữ nguyên */}
                                        <button
                                            onClick={() => toggleDoorStatus(door.id)}
                                            className={cn(
                                                'relative w-6 h-6 rounded-full cursor-pointer z-10',
                                                'transition-colors duration-200 border-2 border-white',
                                                door.status === 'open' ? 'bg-green-500 hover:bg-green-600' :
                                                    door.status === 'closed' ? 'bg-red-500 hover:bg-red-600' :
                                                        'bg-yellow-500 hover:bg-yellow-600'
                                            )}
                                            disabled={door.status === 'pending'}
                                        />
                                    </div>
                                </DoorTooltip>
                            </div>
                        );
                    })}
                </div>
            </Modal>
        </>
    );
}

export default LocationSelect;
