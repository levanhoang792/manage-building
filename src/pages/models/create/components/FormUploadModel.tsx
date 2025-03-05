import {cn} from "@/lib/utils";
import {Button, Field, Fieldset, Input, Label} from "@headlessui/react";
import stylesGlobal from "@/global.module.scss";
import InputFileUpload from "@/components/commons/InputFileUpload";
import Checkbox from "@/components/commons/Checkbox";
import {Controller, useForm, useWatch} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import ErrorMessage from "@/components/commons/ErrorMessage";
import {ResCategory} from "@/hooks/category/model";
import {ResPlatform} from "@/hooks/platforms/model";
import {ResRender} from "@/hooks/renders/model";
import {ResTag} from "@/hooks/tags/model";
import {ResColor} from "@/hooks/colors/model";
import {Material, ResMaterial} from "@/hooks/materials/model";
import {Req3dModelCreate} from "@/hooks/models/model";
import {useEffect, useState} from "react";
import {use3dModelCreate} from "@/hooks/models/use3dModel";
import {API_RESPONSE_CODE} from "@/routes/api";
import {toast} from "sonner";
import {ENV} from "@/utils/env";
import Combobox from "@/components/commons/Combobox";
import {PlusIcon} from "@heroicons/react/20/solid";
import Spinner from "@/components/commons/Spinner";
import {Link, useNavigate} from "react-router-dom";
import {ROUTES} from "@/routes/routes";
import Colors from "@/components/Colors";
import ImageUpload from "@/pages/models/create/components/ImageUpload";

type FormUploadModelProps = {
    categories: ResCategory;
    platforms: ResPlatform
    renders: ResRender
    materials: ResMaterial
    colors: ResColor
    tags: ResTag
};

type MaterialListProps = Material & {
    disabled: boolean
}

type Req3dModelCreateProps = Req3dModelCreate & {
    accept_terms: boolean
}

const uploadModelSchema: z.ZodType<Req3dModelCreateProps> = z.object({
    name: z.string().nonempty("Name is required"),
    category_id: z.number().int().positive("Category is required"),
    platform_id: z.number().int(),
    render_id: z.number().int(),
    color_ids: z.array(z.number().int().positive("Color cannot be empty"))
        // .min(1, "You must select at least 1 color") // ✅ Bắt buộc có ít nhất 1 màu
        .max(3, "You can select up to 3 colors") // ✅ Không được chọn quá 3 màu
        .refine((arr) => arr.every((color) => color !== undefined), {
            message: "Colors cannot contain undefined values",
        }),
    material_ids: z.array(z.number().int())
        // .min(1, "You must select at least 1 material") // ✅ Bắt buộc có ít nhất 1 màu
        .max(3, "You can select up to 3 materials") // ✅ Giới hạn trước khi transform
        .transform(arr => arr.filter(material => material !== 0)), // 🛠 Loại bỏ `0`
    file_url: z.string().url("Field is not a URL").nonempty("File Url is required"),
    image_urls: z.array(z.string().nonempty("Image URL cannot be empty"))
        .min(1, "At least one image is required"),
    tag_ids: z.array(z.number().int().positive("Tag is required")),
    accept_terms: z.boolean().refine(value => value, {
        message: "You must accept the terms",
    }),
});

function FormUploadModel({categories, platforms, renders, materials, colors, tags}: FormUploadModelProps) {
    const navigate = useNavigate();

    const create3dModelMutation = use3dModelCreate();

    const {
        control,
        handleSubmit,
        formState: {defaultValues, errors},
        setError,
        getValues
    } = useForm<Req3dModelCreateProps>({
        resolver: zodResolver(uploadModelSchema),
        defaultValues: {
            name: "",
            category_id: 0,
            platform_id: 0,
            render_id: 0,
            color_ids: [],
            material_ids: [0, 0, 0],
            file_url: "",
            image_urls: [],
            tag_ids: [],
            accept_terms: false
        }
    });
    const materialIds = useWatch({control: control, name: "material_ids"});

    const [listMaterial, setListMaterial] = useState<Array<MaterialListProps>>(
        materials.data?.map(material => ({
            ...material,
            disabled: false
        }))
    );

    const onSubmit = handleSubmit((data) => {
        create3dModelMutation.mutate(data, {
            onSuccess: ({r, msg}) => {
                if (r === API_RESPONSE_CODE.SUCCESS) {
                    navigate(ROUTES.MODELS);
                    toast.success(msg);
                } else {
                    toast.error(msg);
                }
            },
            onError: (error) => {
                toast.error("Create model error");
                console.error("Create model error", error);
            }
        })
    });

    useEffect(() => {
        setListMaterial(prev => prev?.map(material => {
            if (materialIds.includes(material.id)) {
                return {
                    ...material,
                    disabled: true
                }
            }
            return {
                ...material,
                disabled: false
            }
        }));
    }, [materialIds]);

    return (
        <form action="" onSubmit={onSubmit}>
            <Fieldset className={cn("flex gap-[3.75rem]")}>
                <div className={cn("flex-grow")}>
                    <div className={cn("grid grid-cols-12 gap-x-6 gap-y-4")}>
                        <Field className={cn(stylesGlobal.formField, "col-span-12")}>
                            <Label className={cn(stylesGlobal.formFieldLabel)}>
                                Title for model <span className={cn("text-red-500 text-sm")}>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name="name"
                                render={({field}) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter model name"
                                        className={cn(stylesGlobal.formFieldInput)}
                                    />
                                )}
                            />
                            <ErrorMessage error={errors.name}/>
                        </Field>

                        <Field className={cn(stylesGlobal.formField, "col-span-12")}>
                            <Label className={cn(stylesGlobal.formFieldLabel)}>
                                Category <span className={cn("text-red-500 text-sm")}>*</span>
                            </Label>
                            <div className="relative max-w-[258px]">
                                <Controller
                                    control={control}
                                    name="category_id"
                                    render={({field}) => (
                                        <Combobox
                                            placeholder="Choose category"
                                            isClearable={true}
                                            defaultValue={defaultValues?.category_id}
                                            isParentDisabled={true}
                                            options={
                                                categories?.data?.map(category => ({
                                                    id: category.id,
                                                    value: category.name,
                                                    children: category.children?.map(child => ({
                                                        id: child.id,
                                                        value: child.name
                                                    }))
                                                }))
                                            }
                                            onChange={(value) => {
                                                const selectedItem = Array.isArray(value) ? value?.[0] : value;
                                                field.onChange(Number(selectedItem?.id || 0));
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            <ErrorMessage error={errors.category_id}/>
                        </Field>

                        {/*<div className={cn("col-span-12")}>
                            <p>ID: 3791uhoq281096ewo291</p>
                        </div>*/}

                        <Field className={cn(stylesGlobal.formField, "col-span-12")}>
                            <Label className={cn(stylesGlobal.formFieldLabel)}>
                                Choose a file model <span className={cn("text-red-500 text-sm")}>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name="file_url"
                                render={({field}) => (
                                    <InputFileUpload
                                        maxSize={Number(ENV.VITE_MODEL_MAX_SIZE)}
                                        onChange={(file) => {
                                            field.onChange(file || "");
                                        }}
                                        onError={(error) => {
                                            setError("file_url", {message: error.message});
                                        }}
                                    />
                                )}
                            />
                            <ErrorMessage error={errors.file_url}/>
                        </Field>

                        <Field className={cn(stylesGlobal.formField, "col-span-6")}>
                            <Label className={cn(stylesGlobal.formFieldLabel)}>
                                Platform
                            </Label>
                            <Controller
                                control={control}
                                name="platform_id"
                                render={({field}) => (
                                    <Combobox
                                        placeholder="Choose platform"
                                        isClearable={true}
                                        defaultValue={defaultValues?.platform_id || undefined}
                                        options={
                                            platforms.data?.map(platform => ({
                                                id: platform.id,
                                                value: platform.name
                                            }))
                                        }
                                        onChange={(value) => {
                                            const selectedItem = Array.isArray(value) ? value?.[0] : value;
                                            field.onChange(Number(selectedItem?.id || 0));
                                        }}
                                    />
                                )}
                            />
                            <ErrorMessage error={errors.platform_id}/>
                        </Field>

                        <Field className={cn(stylesGlobal.formField, "col-span-6")}>
                            <Label className={cn(stylesGlobal.formFieldLabel)}>
                                Render
                            </Label>
                            <Controller
                                control={control}
                                name="render_id"
                                render={({field}) => (
                                    <Combobox
                                        placeholder="Choose render"
                                        isClearable={true}
                                        defaultValue={defaultValues?.render_id || undefined}
                                        options={
                                            renders.data?.map(render => ({
                                                id: render.id,
                                                value: render.name
                                            }))
                                        }
                                        onChange={(value) => {
                                            const selectedItem = Array.isArray(value) ? value?.[0] : value;
                                            field.onChange(Number(selectedItem?.id || 0));
                                        }}
                                    />
                                )}
                            />
                            <ErrorMessage error={errors.render_id}/>
                        </Field>

                        <Field className={cn(stylesGlobal.formField, "col-span-12")}>
                            <Label className={cn(stylesGlobal.formFieldLabel)}>
                                Choose color (3 max)
                            </Label>
                            <Controller
                                control={control}
                                name="color_ids"
                                render={({field}) => (
                                    <Colors
                                        colors={colors.data?.map(color => color.hex_code)}
                                        max={3}
                                        onChange={(value) => {
                                            field.onChange(
                                                colors.data
                                                    ?.filter(color => value?.includes(color.hex_code))
                                                    ?.map(color => color.id)
                                            );
                                        }}
                                    />
                                )}
                            />
                            <ErrorMessage error={errors.color_ids}/>
                        </Field>

                        <Field className={cn(stylesGlobal.formField, "col-span-12")}>
                            <Label className={cn(stylesGlobal.formFieldLabel)}>
                                Material (3 max)
                            </Label>
                            <div className={cn("grid grid-cols-12 gap-x-6 gap-y-4")}>
                                <div className={cn("col-span-4 flex flex-col gap-2")}>
                                    <Controller
                                        control={control}
                                        name="material_ids.0"
                                        render={({field}) => (
                                            <Combobox
                                                placeholder="Choose material"
                                                isClearable={true}
                                                defaultValue={defaultValues?.material_ids?.[0] || undefined}
                                                options={
                                                    listMaterial
                                                        ?.filter(material => !(material.disabled && material.id !== materialIds[0]))
                                                        ?.map(material => ({
                                                            id: material.id,
                                                            value: material.name
                                                        }))
                                                }
                                                onChange={(value) => {
                                                    const selectedItem = Array.isArray(value) ? value?.[0] : value;
                                                    field.onChange(Number(selectedItem?.id || 0));
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className={cn("col-span-4 flex flex-col gap-2")}>
                                    <Controller
                                        control={control}
                                        name="material_ids.1"
                                        render={({field}) => (
                                            <Combobox
                                                placeholder="Choose material"
                                                isClearable={true}
                                                defaultValue={defaultValues?.material_ids?.[1] || undefined}
                                                options={
                                                    listMaterial
                                                        ?.filter(material => !(material.disabled && material.id !== materialIds[1]))
                                                        ?.map(material => ({
                                                            id: material.id,
                                                            value: material.name
                                                        }))
                                                }
                                                onChange={(value) => {
                                                    const selectedItem = Array.isArray(value) ? value?.[0] : value;
                                                    field.onChange(Number(selectedItem?.id || 0));
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className={cn("col-span-4 flex flex-col gap-2")}>
                                    <Controller
                                        control={control}
                                        name="material_ids.2"
                                        render={({field}) => (
                                            <Combobox
                                                placeholder="Choose material"
                                                isClearable={true}
                                                defaultValue={defaultValues?.material_ids?.[2] || undefined}
                                                options={
                                                    listMaterial
                                                        ?.filter(material => !(material.disabled && material.id !== materialIds[2]))
                                                        ?.map(material => ({
                                                            id: material.id,
                                                            value: material.name
                                                        }))
                                                }
                                                onChange={(value) => {
                                                    const selectedItem = Array.isArray(value) ? value?.[0] : value;
                                                    field.onChange(Number(selectedItem?.id || 0));
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <ErrorMessage error={errors.material_ids}/>
                        </Field>

                        <Field className={cn(stylesGlobal.formField, "col-span-12")}>
                            <Label className={cn(stylesGlobal.formFieldLabel)}>
                                Tag
                            </Label>
                            <Controller
                                control={control}
                                name="tag_ids"
                                render={({field}) => (
                                    <Combobox
                                        placeholder="Choose Tags"
                                        isClearable={true}
                                        isCreatable={true}
                                        defaultValue={defaultValues?.tag_ids?.filter(item => item !== undefined) || []}
                                        multiple={true}
                                        options={
                                            tags.data?.map(tag => ({
                                                id: tag.id,
                                                value: tag.name
                                            }))
                                        }
                                        onChange={(value) => {
                                            const selectedItem = Array.isArray(value) ? value : [value];
                                            field.onChange(selectedItem?.map(item => Number(item?.id || 0)));
                                        }}
                                    />
                                )}
                            />
                            <ErrorMessage error={errors.tag_ids}/>
                        </Field>
                    </div>

                    <Button
                        type="submit"
                        className={cn(
                            "py-3 px-8 rounded-xl bg-[#7D3200] mt-10",
                            "text-xl/8 font-semibold text-white w-full",
                            "flex items-center justify-center gap-2"
                        )}
                        disabled={create3dModelMutation.isPending}
                        style={{boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.10), 0px 8px 10px -6px rgba(0, 0, 0, 0.10)"}}
                    >
                        <Spinner isLoading={create3dModelMutation.isPending}/>
                        Send to moderation
                    </Button>

                    <div className={cn("flex flex-col gap-2")}>
                        <Field className={cn("flex items-center gap-4 mt-6")}>
                            <Controller
                                control={control}
                                name="accept_terms"
                                render={({field}) => (
                                    <Checkbox
                                        defaultValue={defaultValues?.accept_terms}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            <Label className="text-[#000000CC] text-base/6 hover:cursor-pointer">
                                I’ve accepted {" "}
                                <Link
                                    to=""
                                    className={cn("text-[#4676ED] underline")}
                                >
                                    Terms of use fo authors
                                </Link>
                            </Label>
                        </Field>
                        <ErrorMessage error={errors.accept_terms}/>
                    </div>
                </div>

                <div>
                    <Field>
                        <Controller
                            control={control}
                            name="image_urls.0"
                            render={({field}) => (
                                <ImageUpload
                                    maxSize={Number(ENV.VITE_IMAGE_MAX_SIZE)}
                                    onChange={e => {
                                        field.onChange(e?.[0] || "");
                                    }}
                                    onError={(error) => {
                                        setError("image_urls", {message: error.message});
                                    }}
                                />
                            )}
                        />
                    </Field>

                    <div className={cn("mt-4")}>
                        <Field>
                            <Controller
                                control={control}
                                name="image_urls"
                                render={({field}) => (
                                    <ImageUpload
                                        className={cn("rounded h-auto w-auto bg-transparent border-none")}
                                        image={{
                                            className: cn("size-[100px]")
                                        }}
                                        maxSize={Number(ENV.VITE_IMAGE_MAX_SIZE)}
                                        maxFiles={3}
                                        onChange={e => {
                                            field.onChange([getValues("image_urls")?.[0] || "", ...(e || [])]);
                                        }}
                                        onError={(error) => {
                                            setError("image_urls", {message: error.message});
                                        }}
                                    >
                                        <div className={cn(
                                            "flex items-center justify-center hover:cursor-pointer",
                                            "size-[100px] bg-[#FAFAFA] border border-dashed border-[#0000003D]"
                                        )}>
                                            <PlusIcon className={cn("size-6")}/>
                                        </div>
                                    </ImageUpload>
                                )}
                            />
                        </Field>
                    </div>
                    <ErrorMessage error={errors.image_urls}/>
                </div>
            </Fieldset>
        </form>
    )
}

export default FormUploadModel;