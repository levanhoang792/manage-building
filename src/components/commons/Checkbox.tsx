import {Checkbox as CheckboxHeadlessUI} from "@headlessui/react";
import {cn} from "@/lib/utils";
import {CheckIcon} from "@heroicons/react/20/solid";
import {useEffect, useState} from "react";

interface CheckboxProps {
    defaultValue?: boolean,
    onChange?: (value: boolean) => void,
    className?: string
    value?: boolean
}

function Checkbox({defaultValue = false, onChange, className, value}: CheckboxProps) {
    const [checkedInternal, setCheckedInternal] = useState<boolean>(defaultValue);

    const onChangeInternal = () => {
        setCheckedInternal(!checkedInternal);
    }

    useEffect(() => {
        if (onChange) onChange(checkedInternal);
    }, [checkedInternal, onChange])

    useEffect(() => {
        setCheckedInternal(!!value);
    }, [value]);

    return (
        <CheckboxHeadlessUI
            checked={checkedInternal}
            onChange={onChangeInternal}
            className={cn(
                "group size-5 bg-white/10 block rounded-md p-1",
                "ring-1 ring-white/15 ring-inset",
                "data-[checked]:bg-white",
                (className || "")
            )}
        >
            <CheckIcon className="hidden size-full fill-black group-data-[checked]:block"/>
        </CheckboxHeadlessUI>
    );
}

export default Checkbox;