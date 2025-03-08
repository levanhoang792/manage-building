import {cn} from "@/lib/utils";
import {Link, useParams} from "react-router-dom";
import {use3dModelUpdate, useFetch3dModelDetail} from "@/hooks/models/use3dModel";
import {useEffect, useMemo, useState} from "react";
import {Req3dModelUpdate, Res3dModelDetailData} from "@/hooks/models/model";
import {Button, Field, Fieldset, Input, Label} from "@headlessui/react";
import stylesGlobal from "@/global.module.scss";
import {Controller, useForm, useWatch} from "react-hook-form";
import ErrorMessage from "@/components/commons/ErrorMessage";
import Combobox from "@/components/commons/Combobox";
import InputFileUpload from "@/components/commons/InputFileUpload";
import {ENV} from "@/utils/env";
import Colors from "@/components/Colors";
import Spinner from "@/components/commons/Spinner";
import ImageUpload from "@/pages/models/create/components/ImageUpload";
import {zodResolver} from "@hookform/resolvers/zod";
import {useFetchCategories} from "@/hooks/category/useCategory";
import {useFetchPlatforms} from "@/hooks/platforms/usePlatforms";
import {useFetchRenders} from "@/hooks/renders/useRenders";
import {useFetchMaterials} from "@/hooks/materials/useMaterials";
import {useFetchColors} from "@/hooks/colors/useColors";
import {useFetchTags} from "@/hooks/tags/useTags";
import {ResCategory} from "@/hooks/category/model";
import {ResPlatform} from "@/hooks/platforms/model";
import {ResRender} from "@/hooks/renders/model";
import {Material, ResMaterial} from "@/hooks/materials/model";
import {ResColor} from "@/hooks/colors/model";
import {ResTag} from "@/hooks/tags/model";
import {z} from "zod";
import {PlusIcon} from "@heroicons/react/20/solid";
import {API_RESPONSE_CODE} from "@/routes/api";
import {toast} from "sonner";
import {CloudArrowDownIcon} from "@heroicons/react/24/outline";

type MaterialListProps = Material & {
    disabled: boolean
}

type ParamsType = {
    id: string;
}

const uploadModelSchema: z.ZodType<Req3dModelUpdate> = z.object({
    id: z.number().int().positive("ID is required"),
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
    tag_ids: z.array(z.number().int().positive("Tag is required"))
});

export default function ProductDetail() {
    const {id} = useParams<ParamsType>();

    const fetchDetailModelMutation = useFetch3dModelDetail(Number(id || 0));
    const update3dModelMutation = use3dModelUpdate();

    const {
        control,
        handleSubmit,
        formState: {defaultValues, errors},
        setError,
        getValues,
        setValue,
    } = useForm<Req3dModelUpdate>({
        resolver: zodResolver(uploadModelSchema),
        defaultValues: {
            id: 0,
            name: "",
            category_id: 0,
            platform_id: 0,
            render_id: 0,
            color_ids: [],
            material_ids: [0, 0, 0],
            file_url: "",
            image_urls: [],
            tag_ids: []
        }
    });
    const materialIds = useWatch({control: control, name: "material_ids"});

    const [modelDetail, setModelDetail] = useState<Res3dModelDetailData>({} as Res3dModelDetailData);

    const categoriesMutation = useFetchCategories({limit: 100});
    const platformsMutation = useFetchPlatforms();
    const rendersMutation = useFetchRenders();
    const materialsMutation = useFetchMaterials();
    const colorsMutation = useFetchColors();
    const tagsMutation = useFetchTags();

    const categories = useMemo(() => categoriesMutation.data || {} as ResCategory, [categoriesMutation.data]);
    const platforms = useMemo(() => platformsMutation.data || {} as ResPlatform, [platformsMutation.data]);
    const renders = useMemo(() => rendersMutation.data || {} as ResRender, [rendersMutation.data]);
    const materials = useMemo(() => materialsMutation.data || {} as ResMaterial, [materialsMutation.data]);
    const colors = useMemo(() => colorsMutation.data || {} as ResColor, [colorsMutation.data]);
    const tags = useMemo(() => tagsMutation.data || {} as ResTag, [tagsMutation.data]);

    const [listMaterial, setListMaterial] = useState<Array<MaterialListProps>>([]);

    useEffect(() => {
        setModelDetail(fetchDetailModelMutation.data?.data || {} as Res3dModelDetailData);
    }, [fetchDetailModelMutation.data?.data]);

    const onSubmit = handleSubmit((data) => {
        update3dModelMutation.mutate(data, {
            onSuccess: ({r, msg, errors}) => {
                if (r === API_RESPONSE_CODE.SUCCESS) {
                    toast.success(msg);
                } else {
                    if (errors) {
                        Object.entries(errors).forEach(([key, value]) => {
                            setError(key as keyof Req3dModelUpdate, {message: value?.[0]});
                        })
                    }
                    toast.error(msg);
                }
            },
            onError: (error) => {
                toast.error("Update model error");
                console.error("Update model error", error);
            }
        })
    });

    useEffect(() => {
        setValue("id", modelDetail?.id || 0);
        setValue("name", modelDetail?.name);
        setValue("category_id", modelDetail?.category?.id);
        setValue("platform_id", modelDetail?.platform?.id);
        setValue("render_id", modelDetail?.render?.id);
        setValue("color_ids", modelDetail?.colors?.map(color => color.id));
        setValue("material_ids", modelDetail?.materials?.map(material => material.id));
        setValue("file_url", modelDetail?.model_file?.file_path);

        const newImageUrls = [
            modelDetail?.image_files?.find(item => item.pivot.is_thumbnail)?.file_path,
            ...modelDetail?.image_files?.filter(item => !item.pivot.is_thumbnail)?.map(item => item.file_path) || []
        ]?.filter(item => item !== undefined);
        setValue("image_urls", newImageUrls);

        setValue("tag_ids", modelDetail?.tags?.map(tag => tag.id));
    }, [modelDetail, setValue]);

    useEffect(() => {
        setListMaterial(materials.data?.map(material => ({
            ...material,
            disabled: false
        })))
    }, [materials.data]);

    useEffect(() => {
        setListMaterial(prev => prev?.map(material => {
            if (materialIds?.includes(material.id)) {
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
        <div className={cn("p-10")}>
            <form onSubmit={onSubmit}>
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
                                                value={field.value}
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

                            <div className={cn("col-span-12")}>
                                <p><span className={cn(stylesGlobal.formFieldLabel)}>ID:</span> {modelDetail.id}</p>
                            </div>

                            <Field className={cn(stylesGlobal.formField, "col-span-12")}>
                                <div className={cn("flex items-center gap-2")}>
                                    <Label className={cn(stylesGlobal.formFieldLabel)}>
                                        Choose a file model <span className={cn("text-red-500 text-sm")}>*</span>
                                    </Label>
                                    {modelDetail.model_file?.file_path && (
                                        <Link
                                            to={modelDetail.model_file?.file_path}
                                            download={modelDetail.model_file?.file_name || modelDetail.name}
                                            className={cn(
                                                "flex items-center gap-2 text-[#7D3200]"
                                            )}
                                        >
                                            <span className={cn("sr-only")}>Download file</span>
                                            <CloudArrowDownIcon className={cn("size-5")}/>
                                        </Link>
                                    )}
                                </div>
                                <Controller
                                    control={control}
                                    name="file_url"
                                    render={({field}) => (
                                        <InputFileUpload
                                            maxSize={Number(ENV.VITE_MODEL_MAX_SIZE)}
                                            value={{
                                                fileName: modelDetail?.model_file?.file_name,
                                                fileUrl: field.value
                                            }}
                                            onChange={(file) => {
                                                field.onChange(file?.fileUrl || "");
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
                                            defaultValue={defaultValues?.platform_id || []}
                                            value={field.value}
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
                                            defaultValue={defaultValues?.render_id || []}
                                            value={field.value}
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
                                            value={
                                                field.value?.map(colorId => colors.data?.find(color => color.id === colorId)?.hex_code)
                                                    .filter(color => color !== undefined)
                                            }
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
                                                    defaultValue={defaultValues?.material_ids?.[0] || []}
                                                    value={field.value}
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
                                                    defaultValue={defaultValues?.material_ids?.[1] || []}
                                                    value={field.value}
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
                                                    defaultValue={defaultValues?.material_ids?.[2] || []}
                                                    value={field.value}
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
                                            value={field.value}
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
                            disabled={update3dModelMutation.isPending}
                            style={{boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.10), 0px 8px 10px -6px rgba(0, 0, 0, 0.10)"}}
                        >
                            <Spinner isLoading={update3dModelMutation.isPending}/>
                            Update
                        </Button>
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
                                        value={getValues("image_urls")?.[0] ? [{
                                            file: null,
                                            imgSrc: getValues("image_urls")?.[0]
                                        }] : null}
                                    />
                                )}
                            />
                        </Field>

                        <div className={cn("mt-4")}>
                            <Field>
                                <Controller
                                    control={control}
                                    name="image_urls"
                                    render={({field}) => {
                                        const fileNotThumbnail = getValues("image_urls")?.filter((_, index) => index !== 0);
                                        return (
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
                                                value={fileNotThumbnail?.map((image) => ({
                                                    file: null,
                                                    imgSrc: image
                                                })) || []}
                                            >
                                                <div className={cn(
                                                    "flex items-center justify-center hover:cursor-pointer",
                                                    "size-[100px] bg-[#FAFAFA] border border-dashed border-[#0000003D]"
                                                )}>
                                                    <PlusIcon className={cn("size-6")}/>
                                                </div>
                                            </ImageUpload>
                                        )
                                    }}
                                />
                            </Field>
                        </div>
                        <ErrorMessage error={errors.image_urls}/>
                    </div>
                </Fieldset>
            </form>
        </div>
    );
}
