import bgImage from "@/assets/bg-image.jpg";
import {cn} from "@/lib/utils.ts";
import {Button, Field, Input, Label} from "@headlessui/react";
import {EnvelopeIcon, LockClosedIcon, UserIcon} from "@heroicons/react/20/solid";
import {Link, useNavigate} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterFormData} from "@/hooks/auth/model";
import {useRegister} from "@/hooks/auth/useAuth";
import {ROUTES} from "@/routes/routes";
import FieldError from "@/components/FieldError";
import {toast} from "sonner";

const FormSchema: z.ZodType<RegisterFormData> = z.object({
    email: z.string()
        .nonempty("Email is required")
        .email("Invalid email format"),
    username: z.string()
        .nonempty("Username is required"),
    password: z.string()
        .nonempty("Password is required")
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
        .nonempty("Confirm password is required")
}).refine(data => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm password must match password"
});

function SignUp() {
    const navigate = useNavigate();
    const register = useRegister();

    const {control, handleSubmit, formState: {errors}} = useForm<RegisterFormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = handleSubmit((data) => {
        register.mutate(data, {
            onSuccess: () => {
                toast.success("Registration successful");
                navigate(ROUTES.LOGIN);
            },
            onError: () => {
                toast.error("Registration failed. Please try again.");
            }
        });
    });

    return (
        <div
            className="h-screen flex items-center justify-center bg-center"
            style={{backgroundImage: `url(${bgImage})`}}
        >
            <div
                className={cn("backdrop-blur-[20px] bg-transparent rounded-xl py-8 px-11 w-[420px]")}
                style={{boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", border: "2px solid rgba(255, 255, 255, 0.2)"}}
            >
                <h1 className={cn("text-3xl font-bold text-white text-center")}>Register</h1>

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
                        name="username"
                        render={({field}) => (
                            <Field className={cn("mt-5")}>
                                <Label className="text-sm/6 font-medium text-white hidden">Username</Label>
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
                                        className={cn("size-5 absolute top-1/2 -translate-y-1/2 right-0 mr-4 fill-white")}
                                    />
                                </div>
                            </Field>
                        )}
                    />
                    <FieldError error={errors.username}/>

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

                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({field}) => (
                            <Field className={cn("mt-5")}>
                                <Label className="text-sm/6 font-medium text-white hidden">Confirm Password</Label>
                                <div className={cn("relative")}>
                                    <Input
                                        {...field}
                                        type="password"
                                        className={cn(
                                            "block w-full rounded-full border-0 bg-white/5 text-white py-2 pl-4 pr-10 text-sm/6",
                                            "outline-none outline-1 -outline-offset-2 outline-white/25",
                                            "focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-2 data-[focus]:outline-white/50 transition-all"
                                        )}
                                        placeholder="Confirm Password"
                                    />
                                    <LockClosedIcon
                                        className={cn("size-5 absolute top-1/2 -translate-y-1/2 right-0 mr-4 fill-white")}
                                    />
                                </div>
                            </Field>
                        )}
                    />
                    <FieldError error={errors.confirmPassword}/>

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
                            disabled={register.isPending}
                        >
                            {register.isPending ? "Registering..." : "Register"}
                        </Button>
                    </div>

                    <p className={cn("mt-5 text-center text-sm/6 text-white")}>
                        Already have an account?{" "}
                        <Link
                            to={ROUTES.LOGIN}
                            className={cn("text-purple-300 hover:text-purple-400 transition-all")}
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignUp;