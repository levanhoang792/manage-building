import {useEffect, useState} from 'react';
import Modal from '@/components/commons/Modal';
import {Link} from 'react-router-dom';
import {ROUTES} from '@/routes/routes';
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react';
import {EllipsisVerticalIcon, EyeIcon, PencilIcon, TrashIcon} from '@heroicons/react/20/solid';
import nha1 from "@/assets/images/toa-nha-1.jpg";
import nha2 from "@/assets/images/toa-nha-2.jpg";
import nha3 from "@/assets/images/toa-nha-3.jpg";

interface Building {
    id: number;
    name: string;
    description: string;
    img: string;
}

// Mock data for buildings (replace with API call later)
const mockBuildings = [
    {id: 1, name: 'Building A', img: nha1, description: 'A modern office building with 10 floors'},
    {id: 2, name: 'Building B', img: nha2, description: 'Residential complex with 15 floors'},
    {id: 3, name: 'Building C', img: nha3, description: 'Commercial center with 5 floors'}
];

function BuildingManagement() {
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentBuilding, setCurrentBuilding] = useState<Building | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageToPreview, setImageToPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        img: ''
    });

    useEffect(() => {
        // Simulate API call
        const fetchData = async () => {
            try {
                setBuildings(mockBuildings);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching buildings:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAdd = () => {
        setFormData({name: '', description: '', img: ''});
        setShowAddModal(true);
    };

    const handleEdit = (building: Building) => {
        setCurrentBuilding(building);
        setFormData({
            name: building.name,
            description: building.description,
            img: building.img
        });
        setShowEditModal(true);
    };

    const handleDelete = (building: Building) => {
        setCurrentBuilding(building);
        setShowDeleteModal(true);
    };

    const submitAdd = () => {
        const newBuilding = {
            id: buildings.length + 1,
            name: formData.name,
            description: formData.description,
            img: formData.img
        };

        setBuildings([...buildings, newBuilding]);
        setShowAddModal(false);
    };

    const submitEdit = () => {
        if (!currentBuilding) return;

        const updatedBuildings = buildings.map((building) =>
            building.id === currentBuilding.id
                ? {...building, name: formData.name, description: formData.description}
                : building
        );

        setBuildings(updatedBuildings);
        setShowEditModal(false);
    };

    const submitDelete = () => {
        if (!currentBuilding) return;
        const updatedBuildings = buildings.filter((building) => building.id !== currentBuilding.id);
        setBuildings(updatedBuildings);
        setShowDeleteModal(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-lg">Loading buildings...</p>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Building Management</h1>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add Building
                    </button>
                </div>

                <div className="relative">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">ID</th>
                            <th className="py-2 px-4 border-b text-left">Name</th>
                            <th className="py-2 px-4 border-b text-left">View</th>
                            <th className="py-2 px-4 border-b text-left">Description</th>
                            <th className="py-2 px-4 border-b text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {buildings.map((building) => (
                            <tr key={building.id}>
                                <td className="py-2 px-4 border-b">{building.id}</td>
                                <td className="py-2 px-4 border-b">{building.name}</td>
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => {
                                        setImageToPreview(building.img);
                                        setShowImageModal(true);
                                    }}>
                                        <img src={building.img} alt={building.name} className="w-12 h-12 object-cover rounded hover:scale-105 transition-transform duration-200"/>
                                    </button>
                                </td>

                                <td className="py-2 px-4 border-b">{building.description}</td>
                                <td className="py-2 px-4 border-b">
                                    <Menu as="div" className="relative inline-block text-left">
                                        <MenuButton
                                            className="inline-flex items-center rounded-full p-2 hover:bg-gray-100">
                                            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600"/>
                                        </MenuButton>

                                        <MenuItems
                                            className="fixed translate-y-2 w-48 divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[1]">
                                            <div className="px-1 py-1">
                                                <MenuItem>
                                                    <Link
                                                        to={ROUTES.BUILDING_DETAIL.replace(
                                                            ':id',
                                                            building.id.toString()
                                                        )}
                                                        className={"group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm text-gray-900"}>
                                                        <EyeIcon className="h-5 w-5 text-gray-500"/>
                                                        View
                                                    </Link>
                                                </MenuItem>
                                                <MenuItem>
                                                    <button
                                                        onClick={() => handleEdit(building)}
                                                        className={"group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm text-gray-900"}>
                                                        <PencilIcon className="h-5 w-5 text-gray-500"/>
                                                        Edit
                                                    </button>
                                                </MenuItem>
                                                <div className="my-1 h-px bg-gray-200"/>
                                                <MenuItem>
                                                    <button
                                                        onClick={() => handleDelete(building)}
                                                        className={"group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm text-red-600"}>
                                                        <TrashIcon className="h-5 w-5 text-red-500"/>
                                                        Delete
                                                    </button>
                                                </MenuItem>
                                            </div>
                                        </MenuItems>
                                    </Menu>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Add Modal */}
                <Modal show={showAddModal} title="Add Building" onClose={() => setShowAddModal(false)}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitAdd();
                        }}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
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
                            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
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
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Add
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Edit Modal */}
                <Modal show={showEditModal} title="Edit Building" onClose={() => setShowEditModal(false)}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitEdit();
                        }}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
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
                            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
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
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Update
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Delete Modal */}
                <Modal show={showDeleteModal} title="Delete Building" onClose={() => setShowDeleteModal(false)}>
                    <p className="mb-4">Are you sure you want to delete building "{currentBuilding?.name}"?</p>
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
                            Cancel
                        </button>
                        <button
                            onClick={submitDelete}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Delete
                        </button>
                    </div>
                </Modal>

                <Modal show={showImageModal} title="Preview Image" onClose={() => setShowImageModal(false)}>
                    <div className="flex justify-center items-center max-h-screen overflow-auto p-4">
                        <img
                            src={imageToPreview || ''}
                            alt="Preview"
                            className="w-full h-auto max-w-[1000px] max-h-[90vh] object-contain rounded-xl shadow-2xl"
                        />
                    </div>
                </Modal>

            </div>
        </>
    );
}

export default BuildingManagement;
