import {useEffect, useState} from 'react';
import {Link, Outlet, useParams} from 'react-router-dom';
import {ROUTES} from '@/routes/routes';

// Mock data for a building (replace with API call later)
const mockBuilding = {
    id: 1,
    name: 'Building A',
    description: 'A modern office building with 10 floors. This building features state-of-the-art facilities including high-speed elevators, smart lighting, and climate control systems. The building is designed to maximize energy efficiency and provide a comfortable working environment for all occupants.',
    image: '🏢',
    floors: [
        {id: 1, name: 'Floor 1', description: 'Reception and lobby area'},
        {id: 2, name: 'Floor 2', description: 'Conference rooms and meeting spaces'},
        {id: 3, name: 'Floor 3', description: 'Open office space'},
        {id: 4, name: 'Floor 4', description: 'Executive offices'},
        {id: 5, name: 'Floor 5', description: 'Cafeteria and break rooms'},
    ]
};

interface Floor {
    id: number;
    name: string;
    description: string;
}

interface Building {
    id: number;
    name: string;
    description: string;
    image: string;
    floors: Floor[];
}

function BuildingDetail() {
    const {id} = useParams<{ id: string }>();
    const [building, setBuilding] = useState<Building | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBuilding = async () => {
            try {
                setBuilding(mockBuilding);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching building:', error);
                setLoading(false);
            }
        };

        fetchBuilding();
    }, [id]);

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <Link
                    to={ROUTES.BUILDINGS}
                    className="text-blue-500 hover:text-blue-700"
                >
                    &larr; Back to Buildings
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg">Loading building details...</p>
                </div>
            ) : building ? (
                <div>
                    <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 mb-6">
                        <div className="flex items-center mb-4">
                            <span className="text-6xl mr-4">{building.image}</span>
                            <h1 className="text-3xl font-bold">{building.name}</h1>
                        </div>
                        <p className="text-gray-700 mb-6">{building.description}</p>

                        <h2 className="text-2xl font-bold mb-4">Floors</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {building.floors.map((floor) => (
                                <Link
                                    key={floor.id}
                                    to={`floors/${floor.id}`}
                                    className="block p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100"
                                >
                                    <h3 className="text-xl font-bold mb-2">{floor.name}</h3>
                                    <p className="text-gray-700">{floor.description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Render nested routes */}
                    <Outlet context={{buildingId: id, buildingName: building.name}}/>
                </div>
            ) : (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Building not found.</p>
                </div>
            )}
        </div>
    );
}

export default BuildingDetail;