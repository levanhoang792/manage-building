import {Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle} from '@headlessui/react';
import {ArrowRightIcon, ExclamationTriangleIcon} from '@heroicons/react/24/outline';
import {cn} from '@/lib/utils';
import Spinner from '@/components/commons/Spinner';

interface DoorChangeConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    doorName: string;
    isLoading: boolean;
}

export default function DoorChangeConfirmationDialog({
                                                        isOpen,
                                                        onClose,
                                                        onConfirm,
                                                        doorName,
                                                        isLoading,
                                                    }: DoorChangeConfirmationDialogProps) {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogBackdrop className="fixed inset-0 bg-black/30" aria-hidden="true"/>
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" aria-hidden="true"/>
                        </div>
                        <div className="ml-3">
                            <DialogTitle className="text-lg font-medium text-gray-900">Chuyển sang cửa khác</DialogTitle>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Bạn có chắc chắn muốn chuyển sang cấu hình tọa độ cho cửa "{doorName}"?
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className={cn(
                                "inline-flex items-center gap-2 rounded-md bg-white py-2 px-4 text-gray-700 text-sm",
                                "transition-all border border-gray-300",
                                "shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-50",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={cn(
                                "inline-flex items-center gap-2 rounded-md bg-blue-600 py-2 px-4 text-white text-sm",
                                "transition-all",
                                "shadow-inner shadow-white/10 focus:outline-none hover:bg-blue-700",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner className="h-4 w-4"/>
                                    Đang chuyển...
                                </>
                            ) : (
                                <>
                                    <ArrowRightIcon className="h-4 w-4"/>
                                    Chuyển
                                </>
                            )}
                        </Button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}