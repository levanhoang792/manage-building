"use client";

import {Select as SelectHeadlessUI} from "@headlessui/react";
import {cn} from "@/lib/utils";
import styles from "@/global.module.scss";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import React, {useEffect, useRef, useState} from "react";

interface SelectProps {
    children: React.ReactNode;
    defaultValue?: string;
    onChange?: (value: string) => void;
    className?: string;
}

function Select({children, defaultValue, onChange, ...props}: SelectProps) {
    const firstRenderDefaultValue = useRef(defaultValue); // 🔥 Lưu giá trị `defaultValue` ban đầu
    const onChangeRef = React.useRef(onChange);

    const [value, setValue] = useState<string>(defaultValue || "");

    const onChangeInternal = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value);
    }

    useEffect(() => {
        if (onChangeRef.current) onChangeRef.current(value);
    }, [value]);

    useEffect(() => {
        if (firstRenderDefaultValue.current !== defaultValue) {
            console.error("❌ ERROR: `defaultValue` should not change after first render!");
            throw new Error("❌ ERROR: `defaultValue` should not change after first render!");
        }
    }, [defaultValue]);

    return (
        <>
            <SelectHeadlessUI
                className={cn(
                    styles.formFieldSelect,
                    "appearance-none w-full",
                    value ? "text-black" : "text-[#00000066]",
                    '*:text-black',
                    (props.className || "")
                )}
                value={value}
                onChange={onChangeInternal}
            >
                {children}
            </SelectHeadlessUI>
            <ChevronDownIcon
                className={cn(
                    "group pointer-events-none absolute top-2.5 right-2.5 size-6 fill-[#999999]"
                )}
                aria-hidden="true"
            />
        </>
    )
}

export default Select;