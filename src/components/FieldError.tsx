import {cn} from "@/lib/utils";
import {FieldError as FieldErrorHookForm} from "react-hook-form";

export type FieldErrorProps = {
    error: FieldErrorHookForm | undefined
    className?: string
}

function FieldError({error, className}: FieldErrorProps) {
    return error?.message && (
        <div className={cn("text-red-500 text-[12px] pl-4 italic", className || "")}>
            {error.message}
        </div>
    );
}

export default FieldError;