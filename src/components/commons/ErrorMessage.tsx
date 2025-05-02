import {cn} from "@/lib/utils";
import {FieldError, Merge} from "react-hook-form";
import {useMemo} from "react";

function ErrorMessage({error, className}: {
    error: Merge<FieldError, (FieldError | undefined)[]> | undefined,
    className?: string
}) {
    return useMemo(() => {
        if (!error) return null;

        return (
            <span className={cn("text-red-600 text-sm italic line-clamp-1 w-full", className || "")}>
                {Array.isArray(error)
                    ? error.find(err => err?.message)?.message
                    : error.root?.message || error.message
                }
            </span>
        );
    }, [error]);
}

export default ErrorMessage;