import {cn} from "@/lib/utils";
import FormUploadModel from "./components/FormUploadModel";

function Create3DModelPage() {
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

                    <FormUploadModel/>
                </div>
            </div>
        </div>
    );
}

export default Create3DModelPage;