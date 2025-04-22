import {useEffect, useState} from 'react';
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react';
import {EllipsisVerticalIcon, PencilIcon, TrashIcon} from '@heroicons/react/20/solid';

// Mock data for users (replace with API call later)
const mockUsers = [
    {id: 1, username: 'admin', email: 'admin@example.com', role: 'Admin'},
    {id: 2, username: 'user1', email: 'user1@example.com', role: 'User'},
    {id: 3, username: 'user2', email: 'user2@example.com', role: 'User'},
    {id: 4, username: 'manager', email: 'manager@example.com', role: 'Manager'}
];

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'User'
    });

    useEffect(() => {
        // Simulate API call
        const fetchUsers = async () => {
            try {
                // Replace with actual API call later
                // const response = await fetch('/api/users');
                // const data = await response.json();
                setUsers(mockUsers);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddUser = () => {
        // Reset form data
        setFormData({
            username: '',
            email: '',
            password: '',
            role: 'User'
        });
        setShowAddModal(true);
    };

    const handleEditUser = (user: User) => {
        setCurrentUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '',
            role: user.role
        });
        setShowEditModal(true);
    };

    const handleDeleteUser = (user: User) => {
        setCurrentUser(user);
        setShowDeleteModal(true);
    };

    const submitAddUser = () => {
        // Simulate API call to add user
        const newUser = {
            id: users.length + 1,
            username: formData.username,
            email: formData.email,
            role: formData.role
        };

        setUsers([...users, newUser]);
        setShowAddModal(false);
    };

    const submitEditUser = () => {
        if (!currentUser) return;

        // Simulate API call to update user
        const updatedUsers = users.map((user) =>
            user.id === currentUser.id
                ? {...user, username: formData.username, email: formData.email, role: formData.role}
                : user
        );

        setUsers(updatedUsers);
        setShowEditModal(false);
    };

    const submitDeleteUser = () => {
        if (!currentUser) return;

        // Simulate API call to delete user
        const updatedUsers = users.filter((user) => user.id !== currentUser.id);

        setUsers(updatedUsers);
        setShowDeleteModal(false);
    };

    // Modal component
    const Modal = ({
                       show,
                       title,
                       children,
                       onClose
                   }: {
        show: boolean;
        title: string;
        children: React.ReactNode;
        onClose: () => void;
    }) => {
        if (!show) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{title}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            &times;
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <button
                    onClick={handleAddUser}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add User
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg">Loading users...</p>
                </div>
            ) : (
                <div className="relative">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">ID</th>
                            <th className="py-2 px-4 border-b text-left">Username</th>
                            <th className="py-2 px-4 border-b text-left">Email</th>
                            <th className="py-2 px-4 border-b text-left">Role</th>
                            <th className="py-2 px-4 border-b text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="py-2 px-4 border-b">{user.id}</td>
                                <td className="py-2 px-4 border-b">{user.username}</td>
                                <td className="py-2 px-4 border-b">{user.email}</td>
                                <td className="py-2 px-4 border-b">{user.role}</td>
                                <td className="py-2 px-4 border-b">
                                    <Menu as="div" className="relative inline-block text-left">
                                        <MenuButton
                                            className="inline-flex items-center rounded-full p-2 hover:bg-gray-100">
                                            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600"/>
                                        </MenuButton>

                                        <MenuItems
                                            className="fixed w-48 divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[1]"
                                            style={{transform: 'translateY(0.5rem)'}}>
                                            <div className="px-1 py-1">
                                                <MenuItem>
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className={"group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm text-gray-900"}>
                                                        <PencilIcon className="h-5 w-5 text-gray-500"/>
                                                        Edit
                                                    </button>
                                                </MenuItem>
                                                <div className="my-1 h-px bg-gray-200"/>
                                                <MenuItem>
                                                    <button
                                                        onClick={() => handleDeleteUser(user)}
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
            )}

            {/* Add User Modal */}
            <Modal show={showAddModal} title="Add User" onClose={() => setShowAddModal(false)}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        submitAddUser();
                    }}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                        </select>
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

            {/* Edit User Modal */}
            <Modal show={showEditModal} title="Edit User" onClose={() => setShowEditModal(false)}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        submitEditUser();
                    }}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password (leave blank to keep current)
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                        </select>
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

            {/* Delete User Modal */}
            <Modal show={showDeleteModal} title="Delete User" onClose={() => setShowDeleteModal(false)}>
                <p className="mb-4">Are you sure you want to delete user "{currentUser?.username}"?</p>
                <div className="flex justify-end">
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
                        Cancel
                    </button>
                    <button
                        onClick={submitDeleteUser}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default UserManagement;
