import {Button, Input} from "@headlessui/react";
import {cn} from "@/lib/utils";
import React, {useEffect, useRef, useState} from "react";
import {CloudArrowUpIcon} from "@heroicons/react/24/outline";
import {ResUpload} from "@/hooks/files/model";
import {toast} from "sonner";
import {useUploadModel} from "@/hooks/files/useFiles";

type InputFileUploadFileProps = {
    fileName: string;
    fileUrl: string
}

interface InputFileUploadProps {
    className?: string;
    onChange?: (fileUploaded: InputFileUploadFileProps | null) => void;
    onError?: (err: Error) => void;
    maxSize?: number;
    value?: InputFileUploadFileProps;
}

function InputFileUpload({className, onChange, onError, maxSize, value}: InputFileUploadProps) {
    const onChangeRef = useRef(onChange);
    const onErrorRef = useRef(onError);

    const uploadMutation = useUploadModel();
    const inputRef = useRef<HTMLInputElement>(null);

    const [fileSelected, setFileSelected] = useState<File | null>(null);
    const [fileUploaded, setFileUploaded] = useState<InputFileUploadFileProps | null>(null);
    const previousFileUrlRef = useRef<string | null>(null);

    const uploadFileAction = () => {
        if (inputRef.current) inputRef.current.click();
    };

    const handleError = (error: string) => {
        if (onErrorRef.current) {
            onErrorRef.current(new Error(error));
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null; // Nếu không có file thì gán null
        setFileSelected(file);
        setFileUploaded(null);

        if (file) {
            const fileSizeInMB = file.size / (1024 * 1024);
            if (maxSize && fileSizeInMB > maxSize) {
                handleError(`File size is too large. Maximum file size is ${maxSize} MB`);
                return;
            }

            const uploadFilePromise = new Promise<ResUpload>((resolve, reject) => {
                try {
                    uploadMutation.mutate({file}, {
                        onSuccess: (res) => {
                            const {file_url} = res;
                            const uploadedFile = {
                                fileUrl: file_url,
                                fileName: new URL(file_url).pathname.split('/').pop() || 'unknown_file'
                            };

                            // Ngăn setState nếu không có thay đổi
                            if (previousFileUrlRef.current !== file_url) {
                                setFileUploaded(uploadedFile);
                                previousFileUrlRef.current = file_url;
                            }

                            resolve(res);
                        },
                        onError: (error) => {
                            console.error("Upload error", error);
                            reject(error);
                        }
                    });
                } catch (error) {
                    console.error("Upload error", error);
                    reject(error);
                }
            });

            toast.promise(uploadFilePromise, {
                loading: 'Uploading file model...',
                success: () => `File model uploaded successfully!`,
                error: 'Upload failed',
                duration: 1000,
            });
        }
    };

    const getMimeType = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        const mimeTypes: Record<string, string> = {
            pdf: "application/pdf",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
            txt: "text/plain",
            json: "application/json",
            doc: "application/msword",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            xls: "application/vnd.ms-excel",
            xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            zip: "application/zip",
            rar: "application/x-rar-compressed"
        };
        return mimeTypes[extension || ""] || "application/octet-stream";
    };

    useEffect(() => {
        if (onChangeRef.current) {
            onChangeRef.current(fileUploaded);
        }
    }, [fileUploaded]);

    useEffect(() => {
        if (value?.fileUrl && value.fileUrl !== previousFileUrlRef.current) {
            const mimeType = getMimeType(new URL(value.fileUrl).pathname.split('/').pop() || 'unknown_file');
            const file = new File([], value.fileName, {type: mimeType});
            setFileSelected(file);
            setFileUploaded({
                fileName: value.fileName,
                fileUrl: value.fileUrl
            });

            // Cập nhật ref để tránh loop
            previousFileUrlRef.current = value.fileUrl;
        }
    }, [value?.fileUrl, value?.fileName]);

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
    );
}

export default InputFileUpload;
