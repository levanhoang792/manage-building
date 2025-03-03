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

            <ModelList />
            
            <FilterButton />
        </div>
    );
}
