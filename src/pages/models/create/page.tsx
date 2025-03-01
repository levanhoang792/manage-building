import {cn} from "@/lib/utils";
import Image from "next/image";
import AdsBanner from "@/app/components/AdsBanner";
import FormUploadModel from "@/app/models/create/components/FormUploadModel";
import {fetchCategories} from "@/hooks/category/useCategory";
import {fetchPlatforms} from "@/hooks/platforms/usePlatforms";
import {fetchRenders} from "@/hooks/renders/useRenders";
import {fetchTags} from "@/hooks/tags/useTags";
import {fetchColors} from "@/hooks/colors/useColors";
import {fetchMaterials} from "@/hooks/materials/useMaterials";

async function Create3DModelPage() {
    const categories = await fetchCategories({limit: 100});
    const platforms = await fetchPlatforms();
    const renders = await fetchRenders();
    const materials = await fetchMaterials();
    const colors = await fetchColors();
    const tags = await fetchTags();

    return (
        <div className={cn("container mx-auto")}>
            <AdsBanner/>

            <div className={cn("mt-6 flex flex-col gap-12 max-w-[1328px] mx-auto px-4 xxl:px-0")}>
                <div className={cn("flex gap-6 items-center")}>
                    <Image
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
                        categories={categories}
                        platforms={platforms}
                        renders={renders}
                        materials={materials}
                        colors={colors}
                        tags={tags}
                    />
                </div>
            </div>
        </div>
    );
}

export default Create3DModelPage;