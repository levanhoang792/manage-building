import styles from "./AccountSetting.module.scss";
import {cn} from "@/lib/utils";
import {ChevronRightIcon, PencilIcon, UserCircleIcon} from "@heroicons/react/20/solid";
import {Button} from "@headlessui/react";
import ChangePasswordDialog, {ChangePasswordDialogRef} from "@/pages/account-setting/components/ChangePasswordDialog";
import EditProfileDialog, {EditProfileDialogRef} from "@/pages/account-setting/components/EditProfileDialog";
import {useRef} from "react";
import {ResLoginUser} from "@/hooks/users/model";
import {useSelector, useDispatch} from "react-redux";
import {RootState} from "@/store/store";
import {setUser} from "@/store/slices/authSlice";

function AccountSetting() {
    const changePasswordDialogRef = useRef<ChangePasswordDialogRef>(null);
    const editProfileDialogRef = useRef<EditProfileDialogRef>(null);
    const dispatch = useDispatch();
    
    // Get user data from Redux store
    const userData = useSelector((state: RootState) => state.auth.user);
    const user = userData?.user || null;
    const loading = !user;

    const openChangePasswordDialog = () => {
        changePasswordDialogRef.current?.openDialog();
    };

    const openEditProfileDialog = () => {
        editProfileDialogRef.current?.openDialog();
    };
    
    // Handle profile update
    const handleProfileUpdate = (updatedUser: ResLoginUser) => {
        if (userData) {
            dispatch(setUser({
                ...userData,
                user: updatedUser
            }));
        }
    };

    return (
        <>
            <div className={cn("max-w-[700px] w-full m-auto mt-6")}>
                <h1 className={cn("text-2xl font-bold mb-6")}>Account Settings</h1>
                
                {/* Profile Information Section */}
                <div className={cn("mb-8")}>
                    <div className={cn("flex items-center justify-between mb-4")}>
                        <h2 className={cn("text-xl font-bold")}>Profile Information</h2>
                        <Button
                            className={cn("text-sm bg-gray-700 text-white px-3 py-1 rounded-md flex items-center gap-1")}
                            onClick={openEditProfileDialog}
                            disabled={loading}
                        >
                            <PencilIcon className={cn("size-4")}/>
                            Edit Profile
                        </Button>
                    </div>
                    
                    {loading ? (
                        <div className={cn("animate-pulse bg-gray-200 h-32 rounded-lg")}></div>
                    ) : (
                        <div className={cn("bg-white p-4 rounded-lg shadow border border-gray-200")}>
                            <div className={cn("flex items-start gap-4")}>
                                <div className={cn("bg-gray-200 rounded-full p-2")}>
                                    <UserCircleIcon className={cn("size-16 text-gray-500")}/>
                                </div>
                                <div className={cn("flex-1")}>
                                    <h3 className={cn("text-lg font-semibold")}>{user?.fullName}</h3>
                                    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 mt-2")}>
                                        <div>
                                            <p className={cn("text-sm text-gray-500")}>Username</p>
                                            <p className={cn("font-medium")}>{user?.username}</p>
                                        </div>
                                        <div>
                                            <p className={cn("text-sm text-gray-500")}>Email</p>
                                            <p className={cn("font-medium")}>{user?.email}</p>
                                        </div>
                                        <div>
                                            <p className={cn("text-sm text-gray-500")}>Role</p>
                                            <p className={cn("font-medium")}>{user?.roles.map(role => role.name).join(', ')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Security Section */}
                <div>
                    <h2 className={cn("text-xl font-bold mb-4")}>Security</h2>
                    <div className={cn("mt-4")}>
                        <Button
                            className={cn(styles.settingItem)}
                            onClick={openChangePasswordDialog}
                            disabled={loading}
                        >
                            Change password
                            <ChevronRightIcon className={cn("size-6")}/>
                        </Button>
                        <Button
                            className={cn(styles.settingItem)}
                            disabled={loading}
                        >
                            Two-factor authentication
                            <ChevronRightIcon className={cn("size-6")}/>
                        </Button>
                    </div>
                </div>
            </div>

            <ChangePasswordDialog ref={changePasswordDialogRef}/>
            <EditProfileDialog 
                ref={editProfileDialogRef} 
                user={user} 
                onProfileUpdated={handleProfileUpdate}
            />
        </>
    );
}

export default AccountSetting;