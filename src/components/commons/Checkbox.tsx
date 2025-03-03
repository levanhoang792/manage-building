
import {Checkbox as CheckboxHeadlessUI} from "@headlessui/react";
import {cn} from "@/lib/utils";
import styles from "@/pages/models/page.module.scss";
import {CheckIcon} from "@heroicons/react/20/solid";
import {useEffect, useState} from "react";

interface CheckboxProps {
    defaultValue?: boolean,
    onChange?: (value: boolean) => void,
    className?: string
}

function Checkbox({defaultValue = false, onChange, className}: CheckboxProps) {
    const [checkedInternal, setCheckedInternal] = useState<boolean>(defaultValue);

    const onChangeInternal = () => {
        setCheckedInternal(!checkedInternal);
    }

    useEffect(() => {
        if (onChange) onChange(checkedInternal);
    }, [checkedInternal, onChange])

    return (
        <CheckboxHeadlessUI
            checked={checkedInternal}
            onChange={onChangeInternal}
            className={cn(
                styles.checkbox, "group",
                "outline-none hover:cursor-pointer",
                "ring-1 ring-[#DDDDE3] ring-inset data-[checked]:ring-[#0A68FF]",
                "bg-[#F5F5FA] data-[checked]:bg-[#0A68FF]",
                (className || "")
            )}
        >
            <CheckIcon className="hidden size-4 fill-white group-data-[checked]:block"/>
        </CheckboxHeadlessUI>
    );
}

export default Checkbox;