import bgImage from "@/assets/bg-image.jpg";
import {cn} from "@/lib/utils.ts";
import {Button, Field, Input, Label} from "@headlessui/react";
import {SparklesIcon} from "@heroicons/react/20/solid";
import {useNavigate} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {ReqOtp} from "@/hooks/forgot-password/model";
import {useOtp} from "@/hooks/forgot-password/useForgotPass";
import {ROUTES} from "@/routes/routes";
import FieldError from "@/components/FieldError";
import {toast} from "sonner";

const FormSchema: z.ZodType<ReqOtp> = z.object({
    otp: z.string().nonempty("OTP is required")
});

function ConfirmOtp() {
    const navigate = useNavigate();
    const otpMutation = useOtp();

    const {control, handleSubmit, formState: {errors}} = useForm<ReqOtp>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            otp: ""
        }
    });

    const onSubmit = handleSubmit((data) => {
        otpMutation.mutate(data, {
            onSuccess: (response) => {
                if (response.status === 200) {
                    toast.success("OTP verified successfully");
                    navigate(ROUTES.CHANGE_PASSWORD);
                } else {
                    toast.error("Invalid OTP. Please try again.");
                }
            },
            onError: () => {
                toast.error("Failed to verify OTP. Please try again.");
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
                <h1 className={cn("text-3xl font-bold text-white text-center")}>Confirm OTP</h1>

                <form className="w-full mt-5" onSubmit={onSubmit}>
                    <Controller
                        control={control}
                        name="otp"
                        render={({field}) => (
                            <Field>
                                <Label className="text-sm/6 font-medium text-white hidden">OTP</Label>
                                <div className={cn("relative")}>
                                    <Input
                                        {...field}
                                        className={cn(
                                            "block w-full rounded-full border-0 bg-white/5 text-white py-2 pl-4 pr-10 text-sm/6",
                                            "outline-none outline-1 -outline-offset-2 outline-white/25",
                                            "focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-2 data-[focus]:outline-white/50 transition-all"
                                        )}
                                        placeholder="Enter OTP"
                                    />
                                    <SparklesIcon
                                        className={cn("size-5 absolute top-1/2 -translate-y-1/2 right-0 mr-4 fill-white")}
                                    />
                                </div>
                            </Field>
                        )}
                    />
                    <FieldError error={errors.otp}/>

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
                            disabled={otpMutation.isPending}
                        >
                            {otpMutation.isPending ? "Verifying..." : "Verify OTP"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ConfirmOtp;