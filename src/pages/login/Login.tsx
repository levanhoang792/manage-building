import bgImage from "@/assets/bg-image.jpg";
import {cn} from "@/lib/utils.ts";
import {Button, Checkbox, Field, Input, Label} from "@headlessui/react";
import {CheckIcon, LockClosedIcon, UserIcon} from "@heroicons/react/20/solid";
import {Link} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {z, ZodType} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {DevTool} from "@hookform/devtools";
import FieldError from "@/components/FieldError";
import {LoginFormData} from "@/types/login";
import {useAuth} from "@/hooks/useAuth";
import {ROUTES} from "@/routes/routes";

const FormSchema: ZodType<LoginFormData> = z.object({
    username: z.string().nonempty("Username is required"),
    password: z.string().nonempty("Password is required"),
    isRemember: z.boolean(),
})

function Login() {
    const {login} = useAuth();

    const {control, handleSubmit, formState} = useForm<LoginFormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: "",
            isRemember: false,
        }
    })
    const {errors} = formState;

    return (
        <div
            className={cn("h-screen flex items-center justify-center bg-center bg-no-repeat bg-cover")}
            style={{backgroundImage: `url(${bgImage})`}}
        >
            <div
                className={cn("backdrop-blur-[20px] bg-transparent rounded-xl py-8 px-11 w-[420px]")}
                style={{boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", border: "2px solid rgba(255, 255, 255, 0.2)"}}
            >
                <h1 className={cn("text-3xl font-bold text-white text-center")}>Login</h1>

                <form className="w-full mt-5" onSubmit={handleSubmit(login)}>
                    <Controller
                        control={control}
                        name="username"
                        render={({field}) => (
                            <Field>
                                <Label className="hidden">Name</Label>
                                <div className={cn("relative")}>
                                    <Input
                                        {...field}
                                        className={cn(
                                            "block w-full rounded-full border-0 bg-white/5 text-white py-2 pl-4 pr-10 text-sm/6",
                                            "outline-none outline-1 -outline-offset-2 outline-white/25",
                                            "focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-2 data-[focus]:outline-white/50 transition-all"
                                        )}
                                        placeholder="Username"
                                    />
                                    <UserIcon
                                        className={cn("size-5 absolute top-1/2 -translate-y-1/2 right-0 mr-4 fill-white")}/>
                                </div>
                            </Field>
                        )}
                    />
                    <FieldError error={errors?.username} className={cn("pl-4")}/>

                    <Controller
                        control={control}
                        name="password"
                        render={({field}) => (
                            <Field className={cn("mt-5")}>
                                <Label className="hidden">Password</Label>
                                <div className={cn("relative")}>
                                    <Input
                                        {...field}
                                        type="password"
                                        className={cn(
                                            "block w-full rounded-full border-0 bg-white/5 text-white py-2 pl-4 pr-10 text-sm/6 outline-white/25",
                                            "outline-none outline-1 -outline-offset-2 outline-white/25",
                                            "focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-2 data-[focus]:outline-white/50 transition-all"
                                        )}
                                        placeholder="Password"
                                    />
                                    <LockClosedIcon
                                        className={cn("size-5 absolute top-1/2 -translate-y-1/2 right-0 mr-4 fill-white")}/>
                                </div>
                            </Field>
                        )}
                    />
                    <FieldError error={errors?.password} className={cn("pl-4")}/>

                    <div className={cn("mt-5 flex gap-4 justify-between items-center")}>
                        <Controller
                            control={control}
                            name="isRemember"
                            render={({field}) => (
                                <Field className={cn("flex gap-2 items-center")}>
                                    <Checkbox
                                        {...field}
                                        className="group size-6 bg-white/10 block rounded-md p-1 ring-1 ring-white/15 ring-inset data-[checked]:bg-white"
                                    >
                                        <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block"/>
                                    </Checkbox>
                                    <Label className="text-sm/6 font-medium text-white">Remember me</Label>
                                </Field>
                            )}
                        />
                        <Link to={ROUTES.FORGOT_PASSWORD} className={cn("text-sm text-white hover:underline italic")}>
                            Forgot password?
                        </Link>
                    </div>

                    <div className={cn("mt-5 flex items-center justify-around gap-2")}>
                        <Button
                            type="submit"
                            className={cn(
                                "inline-flex items-center justify-center gap-2 bg-white py-1.5 px-3 text-sm/6 w-full rounded-full",
                                "font-semibold text-gray-800 shadow-inner shadow-white/10 focus:outline-none transition-all",
                                "data-[focus]:outline-1 data-[focus]:outline-white",
                                "data-[hover]:bg-purple-600 data-[open]:bg-purple-600",
                                "data-[hover]:text-neutral-200 data-[open]:text-neutral-200"
                            )}
                        >
                            Login
                        </Button>

                        <Link 
                            to={ROUTES.SIGN_UP}  
                            className={cn(
                                "inline-flex items-center justify-center gap-2 bg-white py-1.5 px-3 text-sm/6 w-full rounded-full",
                                "font-semibold text-gray-800 shadow-inner shadow-white/10 focus:outline-none transition-all",
                                "data-[focus]:outline-1 data-[focus]:outline-white",
                                "data-[hover]:bg-purple-600 data-[open]:bg-purple-600",
                                "data-[hover]:text-neutral-200 data-[open]:text-neutral-200"
                            )}>
                            SignUp
                        </Link>

                    </div>
                </form>
            </div>

            <DevTool control={control}/>
        </div>
    );
}

export default Login;