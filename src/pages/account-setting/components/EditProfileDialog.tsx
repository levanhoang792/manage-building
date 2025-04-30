import {Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle, Field, Input, Label} from "@headlessui/react";
import {ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {cn} from "@/lib/utils";
import {ResLoginUser} from "@/hooks/users/model";
import FieldError from "@/components/FieldError";
import {toast} from "sonner";
import {useUpdateProfile} from "@/hooks/profile/useProfile";

// Define the form data structure
interface ProfileFormData {
    username: string;
    email: string;
    fullName: string;
}

// Create a schema for form validation
const FormSchema: z.ZodType<ProfileFormData> = z.object({
    username: z.string().nonempty("Username is required"),
    email: z.string()
        .nonempty("Email is required")
        .email("Invalid email format"),
    fullName: z.string().nonempty("Full name is required"),
});

interface EditProfileDialogProps {
    user: ResLoginUser | null;
    onProfileUpdated: (user: ResLoginUser) => void;
    onClose?: () => void;
}

export interface EditProfileDialogRef {
    openDialog: () => void;
    closeDialog: () => void;
}

const EditProfileDialog = forwardRef((
    {user, onProfileUpdated, onClose}: EditProfileDialogProps,
    ref: ForwardedRef<EditProfileDialogRef>
) => {
    const [isOpen, setIsOpen] = useState(false);
    const updateProfileMutation = useUpdateProfile();

    const {control, handleSubmit, formState: {errors}, reset} = useForm<ProfileFormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: user?.username || "",
            email: user?.email || "",
            fullName: user?.fullName || "",
        }
    });

    // Update form values when user data changes or dialog opens
    useEffect(() => {
        if (user && isOpen) {
            reset({
                username: user.username,
                email: user.email,
                fullName: user.fullName,
            });
        }
    }, [user, isOpen, reset]);

    useImperativeHandle(ref, () => ({
        openDialog: () => {
            setIsOpen(true);
            if (user) {
                reset({
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                });
            }
        },
        closeDialog: () => closeDialog()
    }));

    const closeDialog = () => {
        setIsOpen(false);
        onClose?.();
    };

    const onSubmit = handleSubmit((data) => {
        if (!user) return;

        updateProfileMutation.mutate(
            {
                username: data.username,
                email: data.email,
                fullName: data.fullName
            },
            {
                onSuccess: (response) => {
                    // Call the callback with updated user data from the API response
                    onProfileUpdated(response.data);
                    toast.success("Profile updated successfully");
                    closeDialog();
                },
                onError: (error) => {
                    console.error("Failed to update profile:", error);
                    toast.error(error.message || "Failed to update profile. Please try again.");
                }
            }
        );
    });

    return (
        <Dialog open={isOpen} onClose={() => {
        }}>
            <DialogBackdrop className="fixed inset-0 bg-black/30" aria-hidden="true"/>
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
                    <DialogTitle className="text-xl font-semibold mb-4">Edit Profile</DialogTitle>
                    <form onSubmit={onSubmit}>
                        <Controller
                            control={control}
                            name="fullName"
                            render={({field}) => (
                                <Field className="mb-4">
                                    <Label className="block text-gray-700 text-sm font-bold mb-2">Full Name</Label>
                                    <Input
                                        {...field}
                                        type="text"
                                        className={cn(
                                            "shadow appearance-none border rounded w-full py-2 px-3",
                                            "text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        )}
                                    />
                                    <FieldError error={errors.fullName}/>
                                </Field>
                            )}
                        />

                        <Controller
                            control={control}
                            name="username"
                            render={({field}) => (
                                <Field className="mb-4">
                                    <Label className="block text-gray-700 text-sm font-bold mb-2">Username</Label>
                                    <Input
                                        {...field}
                                        type="text"
                                        className={cn(
                                            "shadow appearance-none border rounded w-full py-2 px-3",
                                            "text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        )}
                                    />
                                    <FieldError error={errors.username}/>
                                </Field>
                            )}
                        />

                        <Controller
                            control={control}
                            name="email"
                            render={({field}) => (
                                <Field className="mb-6">
                                    <Label className="block text-gray-700 text-sm font-bold mb-2">Email</Label>
                                    <Input
                                        {...field}
                                        type="email"
                                        className={cn(
                                            "shadow appearance-none border rounded w-full py-2 px-3",
                                            "text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        )}
                                    />
                                    <FieldError error={errors.email}/>
                                </Field>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-md bg-white py-2 px-5 text-gray-700 text-sm",
                                    "transition-all border border-gray-700",
                                    "shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[hover]:text-white",
                                    "data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                )}
                                onClick={closeDialog}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-md bg-gray-700 py-2 px-5 text-white text-sm",
                                    "transition-all",
                                    "shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600",
                                    "data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                )}
                                disabled={updateProfileMutation.isPending}
                            >
                                {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                            </Button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
});

export default EditProfileDialog;