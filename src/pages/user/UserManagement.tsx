import Modal from '@/components/commons/Modal';
import {useUserManagement} from '@/pages/user/hooks/useUserManagement';
import {AddUserForm, DeleteUserForm, EditUserForm, UsersTable} from './components';
import React from 'react';

function UserManagement() {
    const {
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
    } = useUserManagement();

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
                <UsersTable
                    users={users}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                />
            )}

            <Modal show={showAddModal} title="Add User" onClose={() => setShowAddModal(false)}>
                <AddUserForm
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={(e: React.FormEvent) => {
                        e.preventDefault();
                        submitAddUser();
                    }}
                    onCancel={() => setShowAddModal(false)}
                />
            </Modal>

            <Modal show={showEditModal} title="Edit User" onClose={() => setShowEditModal(false)}>
                <EditUserForm
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={(e: React.FormEvent) => {
                        e.preventDefault();
                        submitEditUser();
                    }}
                    onCancel={() => setShowEditModal(false)}
                />
            </Modal>

            <Modal show={showDeleteModal} title="Delete User" onClose={() => setShowDeleteModal(false)}>
                <DeleteUserForm
                    username={currentUser?.username}
                    onConfirm={submitDeleteUser}
                    onCancel={() => setShowDeleteModal(false)}
                />
            </Modal>
        </div>
    );
}

export default UserManagement;
