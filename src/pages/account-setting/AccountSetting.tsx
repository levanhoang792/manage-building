import MainLayout from "@/layouts/main-layout/MainLayout";
import {cn} from "@/lib/utils";
import {ChevronRightIcon} from "@heroicons/react/20/solid";

function AccountSetting() {
    return (
        <MainLayout>
            <div className={cn("max-w-[500px] w-full m-auto")}>
                <h2 className={cn("text-xl font-bold")}>Mật khẩu</h2>
                <div className={cn("mt-4")}>
                    <div
                        className={cn(
                            "border border-gray-300 py-2 px-3 flex items-center justify-between gap-2",
                            "hover:bg-gray-100 cursor-pointer"
                        )}
                    >
                        Change password
                        <ChevronRightIcon className={cn("size-6")}/>
                    </div>
                    <div
                        className={cn(
                            "border border-gray-300 py-2 px-3 flex items-center justify-between gap-2",
                            "hover:bg-gray-100 cursor-pointer"
                        )}
                    >
                        Two-factor authentication
                        <ChevronRightIcon className={cn("size-6")}/>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default AccountSetting;