import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Button} from "@headlessui/react";
import {EditUserFormData} from "@/hooks/users/model";
import {useEditUser} from "@/pages/user/hooks/useUserManagement";
import {cn} from "@/lib/utils";
import FieldError from "@/components/FieldError";
import {useEffect} from "react";

const FormSchema: z.ZodType<EditUserFormData> = z.object({
    username: z.string().nonempty("Username is required"),
    email: z.string().nonempty("Email is required").email("Invalid email format"),
    role: z.string().nonempty("Role is required")
});

interface EditUserFormProps {
    userId: number;
    initialData: EditUserFormData;
    onSuccess: () => void;
    onCancel: () => void;
}

export const EditUserForm = ({userId, initialData, onSuccess, onCancel}: EditUserFormProps) => {
    const editUser = useEditUser();

    const {control, handleSubmit, formState: {errors}, reset} = useForm<EditUserFormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialData
    });

    useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);

    const onSubmit = handleSubmit((data) => {
        editUser.mutate({id: userId, data}, {
            onSuccess: () => {
                onSuccess();
            }
        });
    });

    return (
        <form onSubmit={onSubmit}>
            <Controller
                control={control}
                name="username"
                render={({field}) => (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input
                            {...field}
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <FieldError error={errors.username}/>
                    </div>
                )}
            />

            <Controller
                control={control}
                name="email"
                render={({field}) => (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            {...field}
                            type="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <FieldError error={errors.email}/>
                    </div>
                )}
            />

            <Controller
                control={control}
                name="role"
                render={({field}) => (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                        <select
                            {...field}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                        </select>
                        <FieldError error={errors.role}/>
                    </div>
                )}
            />

            <div className="flex justify-end">
                <Button
                    type="button"
                    onClick={onCancel}
                    className={cn(
                        "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                    )}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className={cn(
                        "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    )}
                    disabled={editUser.isPending}
                >
                    {editUser.isPending ? "Saving..." : "Save"}
                </Button>
            </div>
        </form>
    );
};