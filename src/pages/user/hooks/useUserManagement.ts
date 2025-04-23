import {useEffect, useState} from 'react';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

// Mock data (replace with API call later)
const mockUsers = [
    {id: 1, username: 'admin', email: 'admin@example.com', role: 'Admin'},
    {id: 2, username: 'user1', email: 'user1@example.com', role: 'User'},
    {id: 3, username: 'user2', email: 'user2@example.com', role: 'User'},
    {id: 4, username: 'manager', email: 'manager@example.com', role: 'Manager'}
];

export const useUserManagement = () => {
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
        const fetchUsers = async () => {
            try {
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddUser = () => {
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
        const updatedUsers = users.filter((user) => user.id !== currentUser.id);
        setUsers(updatedUsers);
        setShowDeleteModal(false);
    };

    return {
        users,
        loading,
        showAddModal,
        showEditModal,
        showDeleteModal,
        currentUser,
        formData,
        setShowAddModal,
        setShowEditModal,
        setShowDeleteModal,
        handleInputChange,
        handleAddUser,
        handleEditUser,
        handleDeleteUser,
        submitAddUser,
        submitEditUser,
        submitDeleteUser
    };
};

export type {User};