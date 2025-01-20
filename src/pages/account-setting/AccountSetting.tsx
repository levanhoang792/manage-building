import styles from "./AccountSetting.module.scss";
import MainLayout from "@/layouts/main-layout/MainLayout";
import {cn} from "@/lib/utils";
import {ChevronRightIcon} from "@heroicons/react/20/solid";
import {Button} from "@headlessui/react";
import ChangePasswordDialog, {ChangePasswordDialogRef} from "@/pages/account-setting/components/ChangePasswordDialog";
import {useRef} from "react";

function AccountSetting() {
    const dialogRef = useRef<ChangePasswordDialogRef>(null);

    const openChangePasswordDialog = () => {
        dialogRef.current?.openDialog();
    };

    return (
        <MainLayout>
            <div className={cn("max-w-[500px] w-full m-auto mt-6")}>
                <h2 className={cn("text-xl font-bold")}>Password</h2>
                <div className={cn("mt-4")}>
                    <Button
                        className={cn(styles.settingItem)}
                        onClick={openChangePasswordDialog}
                    >
                        Change password
                        <ChevronRightIcon className={cn("size-6")}/>
                    </Button>
                    <Button
                        className={cn(styles.settingItem)}
                    >
                        Two-factor authentication
                        <ChevronRightIcon className={cn("size-6")}/>
                    </Button>
                </div>
            </div>

            <ChangePasswordDialog ref={dialogRef}/>
        </MainLayout>
    );
}

export default AccountSetting;