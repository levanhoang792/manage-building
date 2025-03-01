import {cn} from "@/lib/utils";
import {
    Field,
    Input,
    Label,
} from "@headlessui/react";
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import {CloudArrowUpIcon} from "@heroicons/react/24/outline";
import {Link} from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import FilterButton from "./components/FilterButton";
import ModelList from "./components/ModelList";

export default function Model3D() {
    // const categories = await fetchCategories({limit: 100});
    // // const platforms = await fetchPlatforms();
    // // const renders = await fetchRenders();
    // const materials = await fetchMaterials();
    // const colors = await fetchColors();
    // // const tags = await fetchTags();

    return (
        <div className={cn("container mx-auto px-4 lg:px-0 relative mb-5 lg:mb-[336px]")}>
            <div className={cn("py-6 flex gap-6")}>
                <Field className={cn("flex-grow")}>
                    <Label className={cn("hidden")}>Search in 3D model...</Label>
                    <div className={cn("relative flex items-center w-full")}>
                        <MagnifyingGlassIcon className={cn("size-5 absolute left-6")} />
                        <Input
                            name="full_name"
                            type="text"
                            placeholder="Search in 3D model..."
                            className={cn(
                                "h-[52px] w-full rounded-lg bg-[#F8F8F8] border border-[#C9CDD4]",
                                "px-12 outline-none text-sm/5",
                            )}
                        />
                    </div>
                </Field>

                <Link
                    to={ROUTES.MODELS_CREATE}
                    className={cn(
                        "px-8 flex justify-center items-center gap-2 rounded-lg border border-black",
                        "hover:bg-[#7D3200] hover:text-white hover:border-transparent transition-colors",
                    )}
                    style={{boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.10), 0px 8px 10px -6px rgba(0, 0, 0, 0.10)"}}
                >
                    Upload model
                    <CloudArrowUpIcon className={cn("size-5")} />
                </Link>
            </div>

            {/* <div className={cn("flex justify-between gap-4")}>
                <div
                    className={cn(
                        "min-w-[270px] w-[270px] rounded-2xl border border-[#2222221f] pt-2 pb-3",
                        "hidden lg:flex flex-col items-center gap-2 h-fit",
                    )}
                >
                    {categories.data.map((category, i) => (
                        <Fragment key={i}>
                            <Disclosure as="div" className="w-full">
                                <DisclosureButton className={cn(styles.disclosureButton, "group")}>
                                    {category.name}
                                    <ChevronRightIcon
                                        className={cn(styles.disclosureButtonChevron, "group-data-[open]:rotate-90")}
                                    />
                                </DisclosureButton>
                                <div className="overflow-hidden px-4">
                                    <DisclosurePanel
                                        className={cn(
                                            "mt-2 transition duration-200 ease-out",
                                            "flex flex-col gap-4 text-[#222]",
                                        )}
                                    >
                                        {category.children.map((subCategory, j) => (
                                            <Field key={j} className={cn("flex gap-2 items-center")}>
                                                <Checkbox />
                                                <Label className="font-medium flex-grow hover:cursor-pointer">
                                                    {subCategory.name}
                                                </Label>
                                            </Field>
                                        ))}
                                    </DisclosurePanel>
                                </div>
                            </Disclosure>

                            <div className={cn(styles.divide)} />
                        </Fragment>
                    ))}

                    <Disclosure as="div" className="w-full" defaultOpen={true}>
                        <DisclosureButton className={cn(styles.disclosureButton, "group")}>
                            Color
                            <ChevronRightIcon
                                className={cn(styles.disclosureButtonChevron, "group-data-[open]:rotate-90")}
                            />
                        </DisclosureButton>
                        <div className="overflow-hidden px-4 w-full">
                            <DisclosurePanel
                                className={cn(
                                    "mt-2 transition duration-200 ease-out w-full",
                                    "flex flex-col gap-4 text-[#222]",
                                )}
                            >
                                <Colors
                                    className={cn("flex flex-wrap justify-start gap-2")}
                                    colors={colors.data.map((color) => color.hex_code)}
                                    defaultValue={[]}
                                    buttonColor={{
                                        className: cn("size-8"),
                                    }}
                                />
                            </DisclosurePanel>
                        </div>
                    </Disclosure>

                    <div className={cn(styles.divide)} />

                    <Disclosure as="div" className="w-full">
                        <DisclosureButton className={cn(styles.disclosureButton, "group")}>
                            Material
                            <ChevronRightIcon
                                className={cn(styles.disclosureButtonChevron, "group-data-[open]:rotate-90")}
                            />
                        </DisclosureButton>
                        <div className="overflow-hidden px-4">
                            <DisclosurePanel
                                className={cn(
                                    "mt-2 transition duration-200 ease-out",
                                    "flex flex-col gap-4 text-[#222]",
                                )}
                            >
                                {materials.data.map((material, i) => (
                                    <Field key={i} className={cn("flex gap-2 items-center")}>
                                        <Checkbox />
                                        <Label className="font-medium">{material.name}</Label>
                                    </Field>
                                ))}
                            </DisclosurePanel>
                        </div>
                    </Disclosure>
                </div>

                <div className={cn("flex-grow")}>
                    <div className={cn("flex justify-between")}>
                        <div className={cn("flex gap-3")}>
                            <Button className={cn(styles.showTypeButton)}>Discovery</Button>
                            <Button className={cn(styles.showTypeButton)}>Saved</Button>
                            <Button className={cn(styles.showTypeButton)}>Hides</Button>
                            <Button className={cn(styles.showTypeButton)}>Favorite</Button>
                        </div>

                        <Menu>
                            <MenuButton
                                className={cn(
                                    "group flex items-center gap-2 rounded-lg py-3 px-4 border border-[#2222223D]",
                                    "text-[#222] font-semibold",
                                )}
                            >
                                Popular
                                <ChevronDownIcon
                                    className={cn(
                                        "size-5 fill-[#222222] group-data-[open]:rotate-180 transition-transform",
                                    )}
                                />
                            </MenuButton>

                            <MenuItems
                                modal={false}
                                transition
                                anchor="bottom end"
                                className={cn("w-52 bg-white border border-[#2222223D] rounded-lg shadow-lg")}
                            >
                                <MenuItem>
                                    <Button
                                        className={cn(
                                            "group w-full flex items-center gap-2 py-2 px-3",
                                            "hover:bg-[#f0f0f0] hover:text-[#222222] transition-colors",
                                        )}
                                    >
                                        <PencilIcon className="size-5 fill-[#222222]" />
                                        Edit
                                    </Button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>

                    <div className={cn("bg-[#00000014] h-px mt-4 mb-6")}></div>

                    <ModelList />
                </div>
            </div> */}
            <div className={cn("bg-[#00000014] h-px mt-4 mb-6")}></div>

            <ModelList />
            
            <FilterButton />
        </div>
    );
}
