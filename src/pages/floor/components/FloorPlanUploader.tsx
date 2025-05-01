import {Fragment, useRef, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {CloudArrowUpIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {Floor} from '@/hooks/floors/model';
import ErrorMessage from '@/components/commons/ErrorMessage';

interface FloorPlanUploaderProps {
    floor?: Floor;
    isOpen: boolean;
    isUploading: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
    error?: string;
}

export default function FloorPlanUploader({
                                              floor,
                                              isOpen,
                                              isUploading,
                                              onClose,
                                              onUpload,
                                              error,
                                          }: FloorPlanUploaderProps) {
    const cancelButtonRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            handleFile(file);
        }
    };

    const handleFile = (file: File) => {
        if (file.type.startsWith('image/')) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select an image file (JPEG, PNG, etc.)');
        }
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = () => {
        if (selectedFile) {
            onUpload(selectedFile);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const clearSelection = () => {
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                onClose={onClose}
            >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                            {floor?.floor_plan_image ? 'Update Floor Plan' : 'Upload Floor Plan'}
                                        </Dialog.Title>

                                        {error && <ErrorMessage message={error} className="mt-2"/>}

                                        <div className="mt-4">
                                            {floor?.floor_plan_image && !preview && (
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-500 mb-2">Current floor plan:</p>
                                                    <img
                                                        src={floor.floor_plan_image}
                                                        alt={`Floor plan for ${floor.name}`}
                                                        className="max-h-48 mx-auto object-contain border rounded"
                                                    />
                                                </div>
                                            )}

                                            {preview ? (
                                                <div className="relative">
                                                    <img
                                                        src={preview}
                                                        alt="Preview"
                                                        className="max-h-48 mx-auto object-contain border rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                                        onClick={clearSelection}
                                                    >
                                                        <XMarkIcon className="h-5 w-5 text-gray-500"/>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className={`border-2 border-dashed rounded-lg p-6 text-center ${
                                                        dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                                                    }`}
                                                    onDragEnter={handleDrag}
                                                    onDragLeave={handleDrag}
                                                    onDragOver={handleDrag}
                                                    onDrop={handleDrop}
                                                >
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                    <div className="space-y-2">
                                                        <div className="mx-auto flex justify-center">
                                                            <CloudArrowUpIcon className="h-12 w-12 text-gray-400"/>
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            <button
                                                                type="button"
                                                                className="text-indigo-600 hover:text-indigo-500 font-medium"
                                                                onClick={handleButtonClick}
                                                            >
                                                                Click to upload
                                                            </button>
                                                            {' '}
                                                            or drag and drop
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            PNG, JPG, GIF up to 10MB
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleSubmit}
                                    disabled={!selectedFile || isUploading}
                                >
                                    {isUploading ? 'Uploading...' : 'Upload'}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={onClose}
                                    ref={cancelButtonRef}
                                    disabled={isUploading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}