import React, {Fragment, useState} from 'react';
import {Dialog, DialogTitle, Transition, TransitionChild} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {DoorRequest} from '@/hooks/doorRequests/model';
import {cn} from '@/lib/utils';

interface DoorRequestStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason?: string) => void;
    title: string;
    description: string;
    confirmText: string;
    confirmColor: 'green' | 'red';
    request: DoorRequest | null;
    reasonRequired?: boolean;
}

const DoorRequestStatusModal: React.FC<DoorRequestStatusModalProps> = ({
                                                                           isOpen,
                                                                           onClose,
                                                                           onConfirm,
                                                                           title,
                                                                           description,
                                                                           confirmText,
                                                                           confirmColor,
                                                                           request,
                                                                           reasonRequired = false
                                                                       }) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = () => {
        if (reasonRequired && !reason.trim()) {
            setError('Vui lòng nhập lý do');
            return;
        }

        onConfirm(reason.trim() || undefined);
        setReason('');
        setError('');
    };

    const handleClose = () => {
        setReason('');
        setError('');
        onClose();
    };

    const getButtonClass = () => {
        const baseClass = "inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm";

        if (confirmColor === 'green') {
            return cn(baseClass, "bg-green-600 hover:bg-green-700 focus:ring-green-500");
        }

        return cn(baseClass, "bg-red-600 hover:bg-red-700 focus:ring-red-500");
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={handleClose}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25"/>
                    </TransitionChild>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>

                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div
                            className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={handleClose}
                                >
                                    <span className="sr-only">Đóng</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                                </button>
                            </div>

                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                    <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        {title}
                                    </DialogTitle>

                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {description}
                                        </p>
                                    </div>

                                    {request && (
                                        <div className="mt-4 bg-gray-50 p-4 rounded-md">
                                            <h4 className="text-sm font-medium text-gray-900">Thông tin yêu cầu:</h4>
                                            <div className="mt-2 text-sm text-gray-500">
                                                <p><span
                                                    className="font-medium">Người yêu cầu:</span> {request.requester_name}
                                                </p>
                                                <p><span className="font-medium">Cửa:</span> {request.door_name}</p>
                                                <p><span
                                                    className="font-medium">Tòa nhà/Tầng:</span> {request.building_name} / {request.floor_name}
                                                </p>
                                                <p><span className="font-medium">Mục đích:</span> {request.purpose}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                            Lý do {reasonRequired ? '(bắt buộc)' : '(không bắt buộc)'}
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="reason"
                                                name="reason"
                                                rows={3}
                                                className={cn(
                                                    "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md",
                                                    error && "border-red-300"
                                                )}
                                                placeholder="Nhập lý do..."
                                                value={reason}
                                                onChange={(e) => {
                                                    setReason(e.target.value);
                                                    if (e.target.value.trim()) {
                                                        setError('');
                                                    }
                                                }}
                                            />
                                            {error && (
                                                <p className="mt-2 text-sm text-red-600">{error}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className={getButtonClass()}
                                    onClick={handleConfirm}
                                >
                                    {confirmText}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm mr-3"
                                    onClick={handleClose}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DoorRequestStatusModal;