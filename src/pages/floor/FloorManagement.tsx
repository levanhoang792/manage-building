import {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import Modal from "@/components/commons/Modal";
import {ROUTES} from '@/routes/routes';

interface Floor {
    id: number;
    name: string;
    description: string;
    buildingId: number;
}

interface Building {
    id: number;
    name: string;
    description: string;
}

// Mock data for floors (replace with API call later)
const mockFloors = [
    {id: 1, name: 'Floor 1', description: 'Reception and lobby area', buildingId: 1},
    {id: 2, name: 'Floor 2', description: 'Conference rooms and meeting spaces', buildingId: 1},
    {id: 3, name: 'Floor 3', description: 'Open office space', buildingId: 1},
    {id: 4, name: 'Floor 1', description: 'Residential apartments 101-110', buildingId: 2},
    {id: 5, name: 'Floor 2', description: 'Residential apartments 201-210', buildingId: 2},
    {id: 6, name: 'Floor 1', description: 'Retail shops', buildingId: 3},
];

// Mock data for buildings (replace with API call later)
const mockBuildings = [
    {id: 1, name: 'Building A', description: 'A modern office building with 10 floors'},
    {id: 2, name: 'Building B', description: 'Residential complex with 15 floors'},
    {id: 3, name: 'Building C', description: 'Commercial center with 5 floors'},
];

function FloorManagement() {
    const {buildingId} = useParams<{ buildingId: string }>();
    const [floors, setFloors] = useState<Floor[]>([]);
    const [building, setBuilding] = useState<Building | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentFloor, setCurrentFloor] = useState<Floor | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        buildingId: 0,
    });

    useEffect(() => {
        // Simulate API call
        const fetchData = async () => {
            try {
                // Trong thực tế sẽ filter floors theo buildingId
                const buildingData = mockBuildings.find(b => b.id.toString() === buildingId);
                setBuilding(buildingData || null);
                setFloors(mockFloors.filter(f => f.buildingId.toString() === buildingId));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [buildingId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: name === 'buildingId' ? parseInt(value) : value
        });
    };

    const handleAdd = () => {
        setFormData({
            name: '',
            description: '',
            buildingId: building?.id || 0,
        });
        setShowAddModal(true);
    };

    const handleEdit = (floor: Floor) => {
        setCurrentFloor(floor);
        setFormData({
            name: floor.name,
            description: floor.description,
            buildingId: floor.buildingId,
        });
        setShowEditModal(true);
    };

    const handleDelete = (floor: Floor) => {
        setCurrentFloor(floor);
        setShowDeleteModal(true);
    };

    const submitAdd = () => {
        const newFloor = {
            id: floors.length + 1,
            name: formData.name,
            description: formData.description,
            buildingId: formData.buildingId,
        };

        setFloors([...floors, newFloor]);
        setShowAddModal(false);
    };

    const submitEdit = () => {
        if (!currentFloor) return;

        const updatedFloors = floors.map(floor =>
            floor.id === currentFloor.id
                ? {
                    ...floor,
                    name: formData.name,
                    description: formData.description,
                    buildingId: formData.buildingId
                }
                : floor
        );

        setFloors(updatedFloors);
        setShowEditModal(false);
    };

    const submitDelete = () => {
        if (!currentFloor) return;
        const updatedFloors = floors.filter(floor => floor.id !== currentFloor.id);
        setFloors(updatedFloors);
        setShowDeleteModal(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-lg">Loading floors...</p>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto p-4">
                <div className="mb-4">
                    <Link
                        to={ROUTES.BUILDING_DETAIL.replace(':id', buildingId || '')}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        &larr; Back to {building?.name || 'Building'}
                    </Link>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Floor Management - {building?.name}</h1>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Floor
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">ID</th>
                            <th className="py-2 px-4 border-b text-left">Name</th>
                            <th className="py-2 px-4 border-b text-left">Description</th>
                            <th className="py-2 px-4 border-b text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {floors.map((floor) => (
                            <tr key={floor.id}>
                                <td className="py-2 px-4 border-b">{floor.id}</td>
                                <td className="py-2 px-4 border-b">{floor.name}</td>
                                <td className="py-2 px-4 border-b">{floor.description}</td>
                                <td className="py-2 px-4 border-b">
                                    <Link
                                        to={ROUTES.BUILDING_FLOOR_DETAIL
                                            .replace(':buildingId', buildingId || '')
                                            .replace(':id', floor.id.toString())}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                                    >
                                        View
                                    </Link>
                                    <button
                                        onClick={() => handleEdit(floor)}
                                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(floor)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Add Modal */}
                <Modal
                    show={showAddModal}
                    title="Add Floor"
                    onClose={() => setShowAddModal(false)}
                >
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        submitAdd();
                    }}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Building
                            </label>
                            <select
                                name="buildingId"
                                value={formData.buildingId}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            >
                                <option value="">Select Building</option>
                                {mockBuildings.map(building => (
                                    <option key={building.id} value={building.id}>
                                        {building.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows={3}
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Edit Modal */}
                <Modal
                    show={showEditModal}
                    title="Edit Floor"
                    onClose={() => setShowEditModal(false)}
                >
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        submitEdit();
                    }}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Building
                            </label>
                            <select
                                name="buildingId"
                                value={formData.buildingId}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            >
                                {mockBuildings.map(building => (
                                    <option key={building.id} value={building.id}>
                                        {building.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows={3}
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Delete Modal */}
                <Modal
                    show={showDeleteModal}
                    title="Delete Floor"
                    onClose={() => setShowDeleteModal(false)}
                >
                    <p className="mb-4">Are you sure you want to delete floor "{currentFloor?.name}"?</p>
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={submitDelete}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Delete
                        </button>
                    </div>
                </Modal>
            </div>
        </>
    );
}

export default FloorManagement;