import {Button, Input} from "@headlessui/react";
import {cn} from "@/lib/utils";
import React, {useEffect, useRef, useState} from "react";
import {CloudArrowUpIcon} from "@heroicons/react/24/outline";
import {ResUpload} from "@/hooks/files/model";
import {toast} from "sonner";
import {useUploadModel} from "@/hooks/files/useFiles";

interface InputFileUploadProps {
    className?: string;
    onChange?: (fileUploaded: string | null) => void;
    onError?: (err: Error) => void;
    maxSize?: number;
}

function InputFileUpload({className, onChange, onError, maxSize}: InputFileUploadProps) {
    const onChangeRef = useRef(onChange);
    const onErrorRef = useRef(onError);

    const uploadMutation = useUploadModel();

    const inputRef = useRef<HTMLInputElement>(null);
    const [fileSelected, setFileSelected] = useState<File | null | undefined>(undefined);

    const [fileUploaded, setFileUploaded] = useState<string | null>(null);

    const uploadFileAction = () => {
        if (inputRef.current) inputRef.current.click();
    };

    const handleError = (error: string) => {
        if (onErrorRef.current) {
            onErrorRef.current(new Error(error));
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setFileSelected(file);
        setFileUploaded(null);

        if (file) {
            const fileSizeInMB = file.size / (1024 * 1024);
            if (maxSize && fileSizeInMB > maxSize) {
                handleError(`File size is too large. Maximum file size is ${maxSize} MB`);
                return;
            }

            const uploadFilePromise = new Promise<ResUpload>((resolve, reject) => {
                uploadMutation.mutate({file: file as File}, {
                    onSuccess: (res) => {
                        const {file_url} = res;
                        setFileUploaded(file_url);
                        resolve(res);
                    },
                    onError: (error) => {
                        console.error("Upload error", error);
                        reject(error);
                    }
                });
            });

            toast.promise(uploadFilePromise, {
                loading: 'Uploading file model...',
                success: () => {
                    return `File model uploaded successfully!`;
                },
                error: 'Upload failed',
                duration: 1000,
            });
        }
    };

    useEffect(() => {
        if (onChangeRef.current) {
            onChangeRef.current(fileUploaded);
        }
    }, [fileUploaded]);

    return (
        <div
            className={cn(
                "h-[52px] pl-4 pr-1.5 bg-[#F5F5F5E5]",
                "border border-[#E0E0E0] rounded-lg",
                "flex items-center justify-between gap-4",
                "hover:cursor-pointer",
                className || ""
            )}
            onClick={uploadFileAction}
        >
            <Input
                ref={inputRef}
                type="file"
                name="file"
                placeholder="File upload"
                className="hidden"
                onChange={handleFileChange}
            />

            <p
                className={cn(
                    "text-sm/6 font-normal text-ellipsis overflow-hidden text-nowrap",
                    "text-[#00000066]", {"text-[#222]": fileSelected}
                )}
            >
                {fileSelected?.name || "(Select a file no more 200 Mb in the format .zip, .rar)"}
            </p>
            <Button
                className={cn(
                    "h-[40px] rounded-md text-white font-semibold text-nowrap",
                    "flex justify-center items-center gap-2 px-4 bg-[#7D3200]"
                )}
                style={{boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.10), 0px 8px 10px -6px rgba(0, 0, 0, 0.10)"}}
            >
                Upload File
                <CloudArrowUpIcon className={cn("size-5")}/>
            </Button>
        </div>
    )
}

export default InputFileUpload;