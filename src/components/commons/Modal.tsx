import React from 'react';
import {cn} from "@/lib/utils";

interface ModalProps {
    show: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    className?: string;
    backdropClassName?: string;
}

const Modal = ({show, title, children, onClose, className = "", backdropClassName = ""}: ModalProps) => {
    if (!show) return null;

    return (
        <div className={cn(
            "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
            backdropClassName
        )}>
            <div className={cn(
                "bg-white rounded-lg p-6",
                "w-full max-w-md overflow-auto",
                className
            )}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className={cn("text-gray-500 hover:text-gray-700 text-2xl")}
                    >
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
