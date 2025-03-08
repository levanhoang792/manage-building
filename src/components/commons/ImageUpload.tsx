import {cn} from "@/lib/utils";
import {Button, Input} from "@headlessui/react";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {PencilSquareIcon} from "@heroicons/react/20/solid";
import ImagePreview from "@/assets/icons/image-preview.svg?react";
import {toast} from "sonner";
import Spinner from "@/components/commons/Spinner";
import {useUploadImage} from "@/hooks/files/useFiles";

type ImagePreviewUploadProps = {
    children?: React.ReactNode;
    onChange?: (srcFileUploaded?: Array<string>, fileUploaded?: Array<FileUploadedProps>) => void;
    onError?: (err: Error) => void;
    maxSize?: number;
    maxFiles?: number;
    className?: string;
    image?: {
        className?: string;
    };
    value?: Array<FileUploadedProps> | null;
};

type FileUploadedProps = {
    file: File | null;
    imgSrc: string | null;
};

function ImageUpload(
    {
        children,
        onChange,
        onError,
        maxSize,
        maxFiles = 1,
        className,
        image,
        value
    }: ImagePreviewUploadProps
) {
    const onChangeRef = useRef(onChange);
    const onErrorRef = useRef(onError);
    const uploadMutation = useUploadImage();
    const inputRef = useRef<HTMLInputElement>(null);
    const itemUpdateIndexRef = useRef<number | null>(null);
    const [fileUploaded, setFileUploaded] = useState<FileUploadedProps[]>(value || []);

    useEffect(() => {
        if (value && JSON.stringify(value) !== JSON.stringify(fileUploaded)) {
            setFileUploaded(value);
        }
    }, [fileUploaded, value]);

    const uploadFileAction = (itemUpdateIndex?: number) => {
        inputRef?.current?.click();
        itemUpdateIndexRef.current = itemUpdateIndex !== undefined ? itemUpdateIndex : null;
    };

    const handleError = useCallback((error: string) => {
        onErrorRef?.current?.(new Error(error));
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);

        fileArray.forEach((file) => {
            const fileSizeInMB = file.size / (1024 * 1024);
            if (maxSize && fileSizeInMB > maxSize) {
                handleError(`File size is too large. Maximum file size is ${maxSize} MB`);
                return;
            }

            uploadMutation
                .mutateAsync({file})
                .then((res) => {
                    setFileUploaded((prev) => {
                        const updatedFiles = [...prev];
                        const fileData = {file, imgSrc: res.file_url};

                        if (itemUpdateIndexRef.current !== null) {
                            updatedFiles[itemUpdateIndexRef.current] = fileData;
                        } else {
                            updatedFiles.push(fileData);
                        }

                        return updatedFiles;
                    });
                })
                .catch((error) => {
                    console.error("Upload error", error);
                    toast.error(`Upload error: ${file.name}`);
                });
        });
    };

    useEffect(() => {
        if (onChangeRef.current) {
            onChangeRef.current(
                fileUploaded.map((item) => item.imgSrc || ""),
                fileUploaded
            );
        }
    }, [fileUploaded]);

    const buttonCreateNewImage = useMemo(() => (
        children ? (
            <div onClick={() => uploadFileAction()}>{children}</div>
        ) : (
            <div
                className={cn("w-[571px] h-[498px] flex flex-col items-center justify-center gap-4", image?.className)}
                onClick={() => uploadFileAction()}
            >
                <ImagePreview width={80} height={80}/>
                <div className={cn("flex flex-col items-center gap-2")}>
                    <p className={cn("text-xl/6 font-semibold")}>Image preview</p>
                    <p className={cn("text-[#666] text-sm/6 font-normal")}>
                        (Only one image file no more than 10MB in .jpg, .png format)
                    </p>
                </div>
                <Button
                    className={cn("py-2.5 px-8 rounded-xl border border-[#222] text-[#222] text-xl/8 font-semibold hover:cursor-pointer hover:bg-[#7D3200] hover:text-white transition")}>Upload
                    image</Button>
            </div>
        )
    ), [children, image?.className]);

    return (
        <div
            className={cn("flex flex-col justify-center items-center gap-8 bg-[#FAFAFA] border border-dashed border-[#0000003D] rounded-2xl", className)}>
            <Input ref={inputRef} type="file" name="file" className="hidden" onChange={handleFileChange}
                   multiple={maxFiles > 1}/>
            {fileUploaded.length > 0 ? (
                <div className={cn("flex gap-2")}>
                    {fileUploaded.map((fileData, i) => (
                        <div key={i}
                             className={cn("w-[571px] h-[498px] relative bg-[#FAFAFA] border border-dashed border-[#0000003D] rounded flex", image?.className)}>
                            <img src={fileData.imgSrc || URL.createObjectURL(fileData.file!)} alt="Preview"
                                 className={cn("object-contain")}/>
                            {!fileData.imgSrc ? (
                                <div
                                    className={cn("absolute top-0 left-0 p-4 bg-[#0000003D] text-white h-full w-full flex items-center justify-center")}>
                                    <Spinner isLoading={true}/></div>
                            ) : (
                                <div
                                    className={cn("opacity-0 hover:opacity-100 transition-opacity absolute top-0 left-0 p-4 bg-[#0000003D] text-white h-full w-full flex items-center justify-center")}>
                                    <Button className={cn("flex gap-2 items-center")}
                                            onClick={() => uploadFileAction(i)}>
                                        <span className={cn("sr-only")}>Edit</span>
                                        <PencilSquareIcon className={cn("w-6 h-6")}/>
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                    {fileUploaded.length < maxFiles && buttonCreateNewImage}
                </div>
            ) : (
                buttonCreateNewImage
            )}
        </div>
    );
}

export default ImageUpload;