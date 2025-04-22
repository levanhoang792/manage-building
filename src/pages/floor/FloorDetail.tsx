import {useEffect, useState} from 'react';
import {Link, useOutletContext, useParams} from 'react-router-dom';
import {ROUTES} from '@/routes/routes';

// Mock data for a floor (replace with API call later)
const mockFloor = {
    id: 2,
    name: 'Floor 2',
    description: 'Conference rooms and meeting spaces. This floor contains 5 conference rooms of various sizes, equipped with modern presentation technology. The floor also includes a break area with coffee and snacks.',
    buildingId: 1,
    buildingName: 'Building A',
    layout: 'https://via.placeholder.com/800x600?text=Floor+Layout',
    doors: [
        {id: 1, name: 'Door 1', x: 150, y: 100, isOpen: true},
        {id: 2, name: 'Door 2', x: 300, y: 200, isOpen: false},
        {id: 3, name: 'Door 3', x: 450, y: 150, isOpen: true},
        {id: 4, name: 'Door 4', x: 600, y: 300, isOpen: false},
    ]
};

interface Door {
    id: number;
    name: string;
    x: number;
    y: number;
    isOpen: boolean;
}

interface Floor {
    id: number;
    name: string;
    description: string;
    buildingId: number;
    buildingName: string;
    layout: string;
    doors: Door[];
}

type OutletContextType = {
    buildingId: string;
    buildingName: string;
};

function FloorDetail() {
    const {id, floorId} = useParams<{ id: string; floorId: string }>();
    const {buildingName} = useOutletContext<OutletContextType>();
    const [floor, setFloor] = useState<Floor | null>(null);
    const [loading, setLoading] = useState(true);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const fetchFloor = async () => {
            try {
                // Trong thực tế sẽ gọi API với buildingId và floorId
                setFloor(mockFloor);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching floor:', error);
                setLoading(false);
            }
        };

        fetchFloor();
    }, [id, floorId]);

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <Link
                    to={ROUTES.BUILDING_DETAIL.replace(':id', id || '')}
                    className="text-blue-500 hover:text-blue-700"
                >
                    &larr; Back to {buildingName}
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg">Loading floor details...</p>
                </div>
            ) : floor ? (
                <div>
                    <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 mb-6">
                        <h1 className="text-3xl font-bold mb-4">{floor.name}</h1>
                        <p className="text-gray-700 mb-6">{floor.description}</p>

                        <h2 className="text-2xl font-bold mb-4">Floor Layout</h2>
                        <div
                            className={`relative border border-gray-300 ${isZoomed ? 'w-full h-[600px] overflow-auto' : 'w-full max-w-2xl mx-auto'}`}>
                            <button
                                onClick={toggleZoom}
                                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md z-10"
                            >
                                {isZoomed ? '🔍-' : '🔍+'}
                            </button>

                            <div className="relative">
                                <img
                                    src={floor.layout}
                                    alt={`Layout for ${floor.name}`}
                                    className="w-full"
                                />

                                {/* Door indicators */}
                                {floor.doors.map((door) => (
                                    <div
                                        key={door.id}
                                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                        style={{
                                            left: `${door.x}px`,
                                            top: `${door.y}px`,
                                        }}
                                    >
                                        <div
                                            className={`
                                                w-10 h-14 
                                                ${door.isOpen ? 'bg-green-500' : 'bg-red-500'} 
                                                rounded-t-lg
                                                relative
                                                transition-all duration-300
                                                transform ${door.isOpen ? 'rotate-45' : 'rotate-0'}
                                                origin-bottom
                                                shadow-md
                                                border-2 border-gray-800
                                            `}
                                            title={`${door.name} - ${door.isOpen ? 'Open' : 'Closed'}`}
                                        >
                                            <div
                                                className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-gray-800"></div>
                                        </div>
                                        <div className="text-xs font-bold mt-1 bg-white px-1 rounded shadow">
                                            {door.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-xl font-bold mb-2">Door Status</h3>
                            <div className="flex space-x-4">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-green-500 mr-2"></div>
                                    <span>Open</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-red-500 mr-2"></div>
                                    <span>Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Floor not found.</p>
                </div>
            )}
        </div>
    );
}

export default FloorDetail;