import {cn} from "@/lib/utils";
import {useFetchCategories} from "@/hooks/category/useCategory";
import {useFetchPlatforms} from "@/hooks/platforms/usePlatforms";
import {useFetchRenders} from "@/hooks/renders/useRenders";
import {useFetchTags} from "@/hooks/tags/useTags";
import {useFetchColors} from "@/hooks/colors/useColors";
import {useFetchMaterials} from "@/hooks/materials/useMaterials";
import FormUploadModel from "./components/FormUploadModel";
import { ResCategory } from "@/hooks/category/model";
import { ResPlatform } from "@/hooks/platforms/model";
import { ResRender } from "@/hooks/renders/model";
import { ResMaterial } from "@/hooks/materials/model";
import { ResColor } from "@/hooks/colors/model";
import { ResTag } from "@/hooks/tags/model";

function Create3DModelPage() {
    const categories = useFetchCategories({limit: 100});
    const platforms = useFetchPlatforms();
    const renders = useFetchRenders();
    const materials = useFetchMaterials();
    const colors = useFetchColors();
    const tags = useFetchTags();

    const categoryData = categories.data || {} as ResCategory;
    const platformsData = platforms.data || {} as ResPlatform;
    const rendersData = renders.data || {} as ResRender;
    const materialsData = materials.data || {} as ResMaterial; 
    const colorsData = colors.data || {} as ResColor;
    const tagsData = tags.data || {} as ResTag;

    return (
        <div className={cn("container mx-auto")}>

            <div className={cn("mt-6 flex flex-col gap-12 max-w-[1328px] mx-auto px-4 xxl:px-0")}>
                <div className={cn("flex gap-6 items-center")}>
                    <img
                        src="/images/avatar.png"
                        alt="Avatar"
                        width={80}
                        height={80}
                    />

                    <div>
                        <p className={cn("text-[#7D3200] text-2xl font-bold")}>
                            Wiliam Nguyen
                        </p>
                        <p className={cn("text-xl font-normal text-[#131313]")}>
                            1024 follow
                        </p>
                    </div>
                </div>
                <div className={cn("flex flex-col gap-8 mb-[120px]")}>
                    <h2 className={cn("text-5xl leading-[3.5rem] text-[#222]")}>Upload model</h2>

                    <FormUploadModel
                        categories={categoryData}
                        platforms={platformsData}
                        renders={rendersData}
                        materials={materialsData}
                        colors={colorsData}
                        tags={tagsData}
                    />
                </div>
            </div>
        </div>
    );
}
export default Create3DModelPage;