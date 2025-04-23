interface DeleteUserFormProps {
    username: string | undefined;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DeleteUserForm = ({username, onConfirm, onCancel}: DeleteUserFormProps) => {
    return (
        <div>
            <p className="mb-4">Are you sure you want to delete user "{username}"?</p>
            <div className="flex justify-end">
                <button
                    onClick={onCancel}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete
                </button>
            </div>
        </div>
    );
};