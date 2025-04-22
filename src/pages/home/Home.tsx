import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {ROUTES} from '@/routes/routes';

// Mock data for buildings (replace with API call later)
const mockBuildings = [
    {id: 1, name: 'Building A', description: 'A modern office building with 10 floors', image: '🏢'},
    {id: 2, name: 'Building B', description: 'Residential complex with 15 floors', image: '🏬'},
    {id: 3, name: 'Building C', description: 'Commercial center with 5 floors', image: '🏣'},
    {id: 4, name: 'Building D', description: 'Industrial facility with 3 floors', image: '🏭'},
];

interface Building {
    id: number;
    name: string;
    description: string;
    image: string;
}

function Home() {
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        const fetchBuildings = async () => {
            try {
                // Replace with actual API call later
                // const response = await fetch('/api/buildings');
                // const data = await response.json();
                setBuildings(mockBuildings);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching buildings:', error);
                setLoading(false);
            }
        };

        fetchBuildings();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Buildings</h1>
                <button
                    onClick={() => {
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg">Loading buildings...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {buildings.map((building) => (
                        <Link
                            key={building.id}
                            to={ROUTES.BUILDING_DETAIL.replace(':id', building.id.toString())}
                            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100"
                        >
                            <div className="flex items-center mb-2">
                                <span className="text-4xl mr-3">{building.image}</span>
                                <h2 className="text-xl font-bold">{building.name}</h2>
                            </div>
                            <p className="text-gray-700">{building.description}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
