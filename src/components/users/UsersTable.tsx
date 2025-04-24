import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react';
import {EllipsisVerticalIcon, PencilIcon, TrashIcon} from '@heroicons/react/20/solid';
import {User} from '@/pages/user/hooks/useUserManagement';

interface UsersTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export const UsersTable = ({users, onEdit, onDelete}: UsersTableProps) => {
    return (
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
                                                onClick={() => onEdit(user)}
                                                className={"group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm text-gray-900"}>
                                                <PencilIcon className="h-5 w-5 text-gray-500"/>
                                                Edit
                                            </button>
                                        </MenuItem>
                                        <div className="my-1 h-px bg-gray-200"/>
                                        <MenuItem>
                                            <button
                                                onClick={() => onDelete(user)}
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
    );
};