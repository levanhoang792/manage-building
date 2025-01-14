import {Dialog, DialogPanel, DialogTitle, Button, DialogBackdrop, Field, Label, Input} from "@headlessui/react";
import {useState, forwardRef, useImperativeHandle, ForwardedRef} from "react";
import {z, ZodType} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {DevTool} from "@hookform/devtools";
import {cn} from "@/lib/utils";
import {UserIcon} from "@heroicons/react/20/solid";
import FieldError from "@/components/FieldError";
import {toast} from "react-toastify";

interface ChangePasswordDialogProps {
    onClose?: () => void;
    onSave?: () => void;
}

export interface ChangePasswordDialogRef {
    openDialog: () => void;
}

type FormData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const FormSchema: ZodType<FormData> = z.object({
    currentPassword: z.string().nonempty("Current password is required"),
    newPassword: z.string().nonempty("New password is required"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
}).refine(data => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm password must match new password",
});

// Sử dụng forwardRef để component cha có thể điều khiển mở Dialog
const ChangePasswordDialog = forwardRef((
    {onClose, onSave}: ChangePasswordDialogProps,
    ref: ForwardedRef<ChangePasswordDialogRef>
) => {
    // Expose methods cho component cha
    useImperativeHandle(ref, () => ({openDialog}));

    const {control, handleSubmit, formState, reset} = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }
    });
    const {errors} = formState;

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const openDialog = () => {
        setIsOpen(true);
    }

    const closeDialog = () => {
        setIsOpen(false);
        onClose?.();
        reset();
    };

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        onSave?.();
        closeDialog();
        toast.success("Change password successfully");
    });

    return (
        <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={closeDialog}>
            <DialogBackdrop className="fixed inset-0 bg-black/55"/>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-white p-6"
                    >
                        <DialogTitle as="h3" className="text-lg/7 font-medium">
                            Change password
                        </DialogTitle>

                        <form className="mt-4" onSubmit={onSubmit}>
                            <Controller
                                control={control}
                                name="currentPassword"
                                render={({field}) => (
                                    <Field>
                                        <Label className="text-xs font-medium">
                                            Password <span className={cn("text-red-500")}>*</span>
                                        </Label>
                                        <div className={cn("relative mt-1")}>
                                            <Input
                                                {...field}
                                                className={cn(
                                                    "w-full rounded-md border-0 bg-white/5 px-3 py-1 text-xs/6",
                                                    "outline-none outline-1 -outline-offset-2 outline-black/25 transition-all",
                                                    "focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-2 data-[focus]:outline-black/75"
                                                )}
                                                placeholder="Username"
                                            />
                                        </div>
                                    </Field>
                                )}
                            />
                            <FieldError error={errors?.currentPassword}/>

                            <Controller
                                control={control}
                                name="newPassword"
                                render={({field}) => (
                                    <Field className={cn("mt-2")}>
                                        <Label className="text-xs font-medium">
                                            New password <span className={cn("text-red-500")}>*</span>
                                        </Label>
                                        <div className={cn("relative mt-1")}>
                                            <Input
                                                {...field}
                                                className={cn(
                                                    "w-full rounded-md border-0 bg-white/5 px-3 py-1 text-xs/6",
                                                    "outline-none outline-1 -outline-offset-2 outline-black/25 transition-all",
                                                    "focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-2 data-[focus]:outline-black/75"
                                                )}
                                                placeholder="New password"
                                            />
                                            <UserIcon
                                                className={cn("size-5 absolute top-1/2 -translate-y-1/2 right-0 mr-4 fill-white")}/>
                                        </div>
                                    </Field>
                                )}
                            />
                            <FieldError error={errors?.newPassword}/>

                            <Controller
                                control={control}
                                name="confirmPassword"
                                render={({field}) => (
                                    <Field className={cn("mt-2")}>
                                        <Label className="text-xs font-medium">
                                            Confirm password <span className={cn("text-red-500")}>*</span>
                                        </Label>
                                        <div className={cn("relative mt-1")}>
                                            <Input
                                                {...field}
                                                className={cn(
                                                    "w-full rounded-md border-0 bg-white/5 px-3 py-1 text-xs/6",
                                                    "outline-none outline-1 -outline-offset-2 outline-black/25 transition-all",
                                                    "focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-2 data-[focus]:outline-black/75"
                                                )}
                                                placeholder="Confirm password"
                                            />
                                            <UserIcon
                                                className={cn("size-5 absolute top-1/2 -translate-y-1/2 right-0 mr-4 fill-white")}/>
                                        </div>
                                    </Field>
                                )}
                            />
                            <FieldError error={errors?.confirmPassword}/>

                            <div className="mt-4 flex justify-end gap-3">
                                <Button
                                    type="reset"
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
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </div>

            <DevTool control={control}/>
        </Dialog>
    );
});

export default ChangePasswordDialog;
