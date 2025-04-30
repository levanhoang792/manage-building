import {Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle, Field, Input, Label} from "@headlessui/react";
import {ForwardedRef, forwardRef, useImperativeHandle, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {cn} from "@/lib/utils";
import {ChangePasswordFormData} from "@/hooks/users/model";
import FieldError from "@/components/FieldError";
import {toast} from "sonner";
import {API_RESPONSE_CODE} from "@/routes/api";
import {useChangePassword} from "@/hooks/users/useUsers";
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/24/outline";

const FormSchema: z.ZodType<ChangePasswordFormData> = z.object({
    currentPassword: z.string().nonempty("Current password is required"),
    newPassword: z.string()
        .nonempty("New password is required")
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
        .nonempty("Confirm password is required")
}).refine(data => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm password must match new password",
});

interface ChangePasswordDialogProps {
    onClose?: () => void;
}

export interface ChangePasswordDialogRef {
    openDialog: () => void;
    closeDialog: () => void;
}

const ChangePasswordDialog = forwardRef(({onClose}: ChangePasswordDialogProps, ref: ForwardedRef<ChangePasswordDialogRef>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const changePassword = useChangePassword();

    const {control, handleSubmit, formState: {errors}, reset} = useForm<ChangePasswordFormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    useImperativeHandle(ref, () => ({
        openDialog: () => setIsOpen(true),
        closeDialog: () => closeDialog()
    }));

    const closeDialog = () => {
        setIsOpen(false);
        reset();
        // Reset password visibility states
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        onClose?.();
    };

    const onSubmit = handleSubmit((data) => {
        changePassword.mutate(data, {
            onSuccess: (response) => {
                if (response && response.r === API_RESPONSE_CODE.SUCCESS) {
                    toast.success(response.message || "Password changed successfully");
                    closeDialog();
                } else {
                    toast.error(response.message || "Failed to change password");
                }
            },
            onError: (error) => {
                console.error(error);
                if (error?.message === "Current password is incorrect") {
                    toast.error("Current password is incorrect");
                } else {
                    toast.error(error?.message || "Failed to change password");
                }
            }
        });
    });

    return (
        <Dialog open={isOpen} onClose={() => {
        }}>
            <DialogBackdrop className="fixed inset-0 bg-black/30" aria-hidden="true"/>
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
                    <DialogTitle className="text-xl font-semibold mb-4">Change Password</DialogTitle>
                    <form onSubmit={onSubmit}>
                        <Controller
                            control={control}
                            name="currentPassword"
                            render={({field}) => (
                                <Field className="mb-4">
                                    <Label className="block text-gray-700 text-sm font-bold mb-2">Current
                                        Password</Label>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showCurrentPassword ? "text" : "password"}
                                            className={cn(
                                                "shadow appearance-none border rounded w-full py-2 px-3 pr-10",
                                                "text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            )}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? (
                                                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5 text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                    <FieldError error={errors.currentPassword}/>
                                </Field>
                            )}
                        />

                        <Controller
                            control={control}
                            name="newPassword"
                            render={({field}) => (
                                <Field className="mb-4">
                                    <Label className="block text-gray-700 text-sm font-bold mb-2">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showNewPassword ? "text" : "password"}
                                            className={cn(
                                                "shadow appearance-none border rounded w-full py-2 px-3 pr-10",
                                                "text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            )}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? (
                                                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5 text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                    <FieldError error={errors.newPassword}/>
                                </Field>
                            )}
                        />

                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({field}) => (
                                <Field className="mb-6">
                                    <Label className="block text-gray-700 text-sm font-bold mb-2">Confirm New
                                        Password</Label>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showConfirmPassword ? "text" : "password"}
                                            className={cn(
                                                "shadow appearance-none border rounded w-full py-2 px-3 pr-10",
                                                "text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            )}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5 text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                    <FieldError error={errors.confirmPassword}/>
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
                                disabled={changePassword.isPending}
                            >
                                {changePassword.isPending ? "Changing..." : "Change Password"}
                            </Button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
});

export default ChangePasswordDialog;
