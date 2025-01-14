import bgImage from "@/assets/bg-image.jpg";
import {cn} from "@/lib/utils.ts";
import {Field, Input, Label} from "@headlessui/react";
import {UserIcon} from "@heroicons/react/20/solid";

function Login() {
    return (
        <div
            className="h-screen flex items-center justify-center bg-center"
            style={{backgroundImage: `url(${bgImage})`}}
        >
            <div
                className={cn("backdrop-blur-[20px] bg-transparent rounded-xl py-8 px-11 w-[420px]")}
                style={{boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", border: "2px solid rgba(255, 255, 255, 0.2)"}}
            >
                <h1 className={cn("text-3xl font-bold text-white text-center")}>Login</h1>

                <div className="w-full mt-5">
                    <Field>
                        <Label className="text-sm/6 font-medium text-white hidden">Name</Label>
                        <div className={cn("relative")}>
                            <Input
                                className={cn(
                                    "block w-full rounded-full border-0 bg-white/5 text-white py-2 px-4 text-sm/6",
                                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                                )}
                                placeholder="Username"
                            />
                            <UserIcon className={cn("size-5 absolute top-1/2 -translate-y-1/2")}/>
                        </div>
                    </Field>
                    <Field className={cn("mt-5")}>
                        <Label className="text-sm/6 font-medium text-white hidden">Name</Label>
                        <Input
                            type="password"
                            className={cn(
                                "block w-full rounded-full border-0 bg-white/5 text-white py-2 px-4 text-sm/6",
                                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                            )}
                            placeholder="Password"
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}

export default Login;