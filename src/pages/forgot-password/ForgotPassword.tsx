import bgImage from "@/assets/bg-image.jpg";
import {cn} from "@/lib/utils.ts";
import {Button, Field, Input, Label} from "@headlessui/react";
import {EnvelopeIcon} from "@heroicons/react/20/solid";
import {useNavigate} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {z, ZodType} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {DevTool} from "@hookform/devtools";
import {ROUTES} from "@/routes/routes";
import FieldError from "@/components/FieldError";

type FormData = {
    email: string;
}

const FormSchema: ZodType<FormData> = z.object({
    email: z.string().nonempty("Email is required").email("Please provide a valid email"),
})

function ForgotPassword() {
    const navigate = useNavigate();

    const {control, handleSubmit, formState} = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
        }
    })
    const {errors} = formState;

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        navigate(ROUTES.CONFIRM_OTP);
    })

    return (
        <div
            className="h-screen flex items-center justify-center bg-center"
            style={{backgroundImage: `url(${bgImage})`}}
        >
            <div
                className={cn("backdrop-blur-[20px] bg-transparent rounded-xl py-8 px-11 w-[420px]")}
                style={{boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", border: "2px solid rgba(255, 255, 255, 0.2)"}}
            >
                <h1 className={cn("text-3xl font-bold text-white text-center")}>Forgot Password</h1>

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
                                        className={cn("size-5 absolute top-1/2 -translate-y-1/2 right-0 mr-4 fill-white")}/>
                                </div>
                            </Field>
                        )}
                    />
                    <FieldError error={errors?.email}/>

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
                        >
                            Send OTP
                        </Button>
                    </div>
                </form>
            </div>

            <DevTool control={control}/>
        </div>
    )
        ;
}

export default ForgotPassword;