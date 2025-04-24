import bgImage from "@/assets/bg-image.jpg";
import {cn} from "@/lib/utils.ts";
import {Button, Field, Input, Label} from "@headlessui/react";
import {EnvelopeIcon, LockClosedIcon} from "@heroicons/react/20/solid";
import {Link} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginFormData} from "@/hooks/auth/model";
import {ROUTES} from "@/routes/routes";
import FieldError from "@/components/FieldError";
import Checkbox from "@/components/commons/Checkbox";
import {useAuth} from "@/hooks/useAuth";
import LocationSelect from "./components/LocationSelect";

const FormSchema: z.ZodType<LoginFormData> = z.object({
    email: z.string()
        .nonempty("Email is required")
        .email("Invalid email format"),
    password: z.string()
        .nonempty("Password is required"),
    isRemember: z.boolean()
});

function Login() {
    const {login, loginMutation} = useAuth();

    const {control, handleSubmit, formState: {errors}} = useForm<LoginFormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
            isRemember: false
        }
    });

    const onSubmit = handleSubmit((data) => {
        login(data);
    });

    return (
        <div
            className="h-screen flex items-center justify-center bg-center"
            style={{backgroundImage: `url(${bgImage})`}}
        >
            <div className="flex gap-6">
                <div
                    className={cn("backdrop-blur-[20px] bg-transparent rounded-xl py-8 px-11 w-[420px]")}
                    style={{boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", border: "2px solid rgba(255, 255, 255, 0.2)"}}
                >
                    <h1 className={cn("text-3xl font-bold text-white text-center")}>Login</h1>

                    <form className="w-full mt-5" onSubmit={onSubmit}>
                        <Controller
                            control={control}
                            name="email"
                            render={({field}) => (
                                <Field>
                                    <Label className="text-sm/6 font-medium text-white hidden">Email</Label>
                                    <div className={cn("relative")}>
                                        <Input
                                            {...field}
                                            className={cn(
                                                "block w-full rounded-full border-0 bg-white/5 text-white py-2 pl-4 pr-10 text-sm/6",
                                                "outline-none outline-1 -outline-offset-2 outline-white/25",
                                                "focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-2 data-[focus]:outline-white/50 transition-all"
                                            )}
                                            placeholder="Email"
                                        />
                                        <EnvelopeIcon
                                            className={cn("size-5 absolute top-1/2 -translate-y-1/2 right-0 mr-4 fill-white")}
                                        />
                                    </div>
                                </Field>
                            )}
                        />
                        <FieldError error={errors.email}/>

                        <Controller
                            control={control}
                            name="password"
                            render={({field}) => (
                                <Field className={cn("mt-5")}>
                                    <Label className="text-sm/6 font-medium text-white hidden">Password</Label>
                                    <div className={cn("relative")}>
                                        <Input
                                            {...field}
                                            type="password"
                                            className={cn(
                                                "block w-full rounded-full border-0 bg-white/5 text-white py-2 pl-4 pr-10 text-sm/6",
                                                "outline-none outline-1 -outline-offset-2 outline-white/25",
                                                "focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-2 data-[focus]:outline-white/50 transition-all"
                                            )}
                                            placeholder="Password"
                                        />
                                        <LockClosedIcon
                                            className={cn("size-5 absolute top-1/2 -translate-y-1/2 right-0 mr-4 fill-white")}
                                        />
                                    </div>
                                </Field>
                            )}
                        />
                        <FieldError error={errors.password}/>

                        <div className={cn("mt-5 flex items-center justify-between")}>
                            <Field className={cn("flex gap-2 items-center")}>
                                <Controller
                                    control={control}
                                    name="isRemember"
                                    render={({field: {value, onChange}}) => (
                                        <Checkbox
                                            value={value}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                <Label className="text-sm/6 font-medium text-white">Remember me</Label>
                            </Field>

                            <Link
                                to={ROUTES.FORGOT_PASSWORD}
                                className={cn("text-sm/6 text-white hover:text-purple-300 transition-all")}
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <div className={cn("mt-5")}>
                            <Button
                                type="submit"
                                className={cn(
                                    "inline-flex items-center justify-center gap-2 bg-white py-1.5 px-3 text-sm/6 w-full rounded-full",
                                    "font-semibold text-gray-800 shadow-inner shadow-white/10 focus:outline-none transition-all",
                                    "data-[focus]:outline-1 data-[focus]:outline-white",
                                    "data-[hover]:bg-purple-600 data-[open]:bg-purple-600",
                                    "data-[hover]:text-neutral-200 data-[open]:text-neutral-200"
                                )}
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending ? "Logging in..." : "Login"}
                            </Button>
                        </div>

                        <p className={cn("mt-5 text-center text-sm/6 text-white")}>
                            Don't have an account?{" "}
                            <Link
                                to={ROUTES.SIGN_UP}
                                className={cn("text-purple-300 hover:text-purple-400 transition-all")}
                            >
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>

                <LocationSelect />
            </div>
        </div>
    );
}

export default Login;