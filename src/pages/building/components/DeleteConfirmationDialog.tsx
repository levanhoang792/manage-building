import {Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle} from '@headlessui/react';
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline';
import {cn} from '@/lib/utils';
import Spinner from '@/components/commons/Spinner';

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isDeleting: boolean;
}

export default function DeleteConfirmationDialog({
                                                     isOpen,
                                                     onClose,
                                                     onConfirm,
                                                     title,
                                                     message,
                                                     isDeleting,
                                                 }: DeleteConfirmationDialogProps) {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogBackdrop className="fixed inset-0 bg-black/30" aria-hidden="true"/>
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true"/>
                        </div>
                        <div className="ml-3">
                            <DialogTitle className="text-lg font-medium text-gray-900">{title}</DialogTitle>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">{message}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button
                            type="button"
                            onClick={onClose}
                            disabled={isDeleting}
                            className={cn(
                                "inline-flex items-center gap-2 rounded-md bg-white py-2 px-4 text-gray-700 text-sm",
                                "transition-all border border-gray-300",
                                "shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-50",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className={cn(
                                "inline-flex items-center gap-2 rounded-md bg-red-600 py-2 px-4 text-white text-sm",
                                "transition-all",
                                "shadow-inner shadow-white/10 focus:outline-none hover:bg-red-700",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            {isDeleting ? (
                                <>
                                    <Spinner className="h-4 w-4"/>
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}