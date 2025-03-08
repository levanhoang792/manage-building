import styles from "@/global.module.scss";
import {
    Button,
    Combobox as ComboboxHeadlessUI,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions
} from '@headlessui/react'
import {CheckIcon, ChevronDownIcon, PlusIcon, XMarkIcon} from '@heroicons/react/20/solid'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {cn} from "@/lib/utils";

function getSelectedValue(options: ComboboxOptionItemProps[] = [], defaultValue?: number | number[]): ComboboxOptionItemProps | ComboboxOptionItemProps[] | null {
    if (defaultValue) {
        const result: ComboboxOptionItemProps[] = [];
        for (const option of options) {
            if (Array.isArray(defaultValue)) {
                if (defaultValue?.includes(option.id)) {
                    result.push(option);
                }
                if (option.children) {
                    const itemFound: ComboboxOptionItemProps[] = getSelectedValue(option.children, defaultValue) as ComboboxOptionItemProps[] || [];
                    result.push(...(itemFound));
                }
            } else {
                if (option.id === defaultValue) {
                    return option;
                }
                if (option.children) {
                    const found = getSelectedValue(option.children, defaultValue);
                    if (found) {
                        return found;
                    }
                }
            }
        }
        return result;
    }
    return null;
}

export type ComboboxOptionItemProps = {
    id: number
    value: string
    children?: Array<ComboboxOptionItemProps>
}

type ComboboxProps = {
    options: ComboboxOptionItemProps[]
    defaultValue?: number | number[]
    value?: number | number[]
    className?: string
    isClearable?: boolean
    placeholder?: string
    onChange?: (value: ComboboxOptionItemProps | ComboboxOptionItemProps[] | null) => void
    isCreatable?: boolean
    onCreate?: (value: string) => void
    multiple?: boolean
    isParentDisabled?: boolean
};

export default function Combobox(
    {
        defaultValue,
        options,
        isClearable,
        onChange,
        placeholder,
        isCreatable,
        isParentDisabled,
        value: valueExternal,
        ...props
    }: ComboboxProps
) {
    const onCreateRef = useRef(props.onCreate);
    const onChangeRef = useRef(onChange);
    const firstRenderDefaultValue = useRef(defaultValue); // 🔥 Lưu giá trị `defaultValue` ban đầu
    const defaultValueItem = getSelectedValue(
        options,
        Array.isArray(defaultValue) ? defaultValue : (defaultValue ? [defaultValue] : undefined)
    );

    const [query, setQuery] = useState('');
    const [value, setValue] = useState<ComboboxOptionItemProps | ComboboxOptionItemProps[] | null>(defaultValueItem || (props.multiple ? [] : null));
    const [isFocus, setIsFocus] = useState(false);

    const isValue = useMemo(() => {
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return !!value;
    }, [value]);

    const filterOptions = (options: ComboboxOptionItemProps[], query: string) => {
        return options.reduce<ComboboxOptionItemProps[]>((acc, option) => {
            const matches = option.value.toLowerCase().includes(query.toLowerCase())
            const filteredChildren = option.children ? filterOptions(option.children, query) : []

            if (matches || filteredChildren.length > 0) {
                acc.push({
                    ...option,
                    children: filteredChildren
                })
            }

            return acc
        }, [])
    };

    const filteredOptions = query === '' ? options : filterOptions(options, query);

    useEffect(() => {
        if (JSON.stringify(firstRenderDefaultValue.current) !== JSON.stringify(defaultValue)) {
            console.error("❌ ERROR: `defaultValue` should not change after first render!");
            throw new Error("❌ ERROR: `defaultValue` should not change after first render!");
        }
    }, [defaultValue]);

    useEffect(() => {
        if (valueExternal) {
            const valueSelected = getSelectedValue(options, valueExternal) || (props.multiple ? [] : null);
            setValue(prev => {
                if (JSON.stringify(prev) !== JSON.stringify(valueSelected)) {
                    return valueSelected;
                }
                return prev;
            });
        }
    }, [options, props.multiple, valueExternal]);

    const renderOptions = (options: ComboboxOptionItemProps[], indexChild: number) => {
        let viewOption = (
            <div className="text-center py-1.5 px-1 select-none text-sm/6 text-[#c2abaf]">
                No results found
            </div>
        );

        if ((options && options.length > 0) || (query && isCreatable)) {
            viewOption = (
                <>
                    {options?.map((option) => (
                        <React.Fragment key={option.id}>
                            <ComboboxOption
                                value={option}
                                className={cn(
                                    "group flex cursor-pointer items-center gap-1",
                                    "py-1.5 pr-1 select-none data-[focus]:bg-black/10"
                                )}
                                style={{paddingLeft: `${indexChild + 0.25}rem`}}
                                disabled={isParentDisabled && option.children && option.children.length > 0}
                            >
                                <CheckIcon className="invisible size-4 fill-black group-data-[selected]:visible"/>
                                <div className="text-sm/6 text-black">{option.value}</div>
                            </ComboboxOption>
                            {option.children && option.children.length > 0 && (
                                renderOptions(option.children, indexChild + 1)
                            )}
                        </React.Fragment>
                    ))}
                    {(options?.length > 1 || options?.length === 0) && query && isCreatable && (
                        <Button
                            className={cn(
                                "group cursor-pointer flex items-center gap-1 w-full",
                                "py-1.5 pr-1 select-none hover:bg-black/10"
                            )}
                            style={{paddingLeft: `${indexChild + 0.25}rem`}}
                            onClick={() => {
                                onCreateRef.current?.(query);
                            }}
                        >
                            <PlusIcon className="invisible size-4 fill-black"/>
                            <div className="text-sm/6 text-black flex items-center gap-1">
                                <PlusIcon className="size-4 fill-black"/>
                                {query}
                            </div>
                        </Button>
                    )}
                </>
            )
        }

        return viewOption;
    }

    useEffect(() => {
        onChangeRef.current?.(value);
    }, [value]);

    return (
        <ComboboxHeadlessUI
            defaultValue={defaultValueItem}
            value={value}
            onChange={(value: ComboboxOptionItemProps[]) => setValue(value)}
            onClose={() => {
                setQuery('');
                setIsFocus(false);
            }}
            immediate
            {...props}
        >
            <div className="relative group">
                <ComboboxButton
                    as="div"
                    className={cn("group w-full z-10")}
                    onClick={() => setIsFocus(true)}
                >
                    {isFocus ? (
                        <ComboboxInput
                            placeholder={(value && !Array.isArray(value) && value?.value) || placeholder || "Select..."}
                            className={cn(
                                styles.formFieldSelect,
                                "appearance-none w-full",
                                isValue ? "text-black" : "text-[#00000066]",
                                '*:text-black',
                                (props.className || "")
                            )}
                            onChange={(event) => {
                                setQuery(event.target.value)
                            }}
                        />
                    ) : (
                        <ComboboxInput
                            placeholder={placeholder || "Select..."}
                            className={cn(
                                styles.formFieldSelect,
                                "appearance-none w-full",
                                value ? "text-black" : "text-[#00000066]",
                                '*:text-black',
                                (props.className || "")
                            )}
                            displayValue={(item: ComboboxOptionItemProps) => isValue && Array.isArray(item) ? " " : item?.value}
                        />
                    )}

                    <Button
                        className={cn(
                            styles.formFieldSelect,
                            "absolute top-0 w-full items-center gap-1 hidden opacity-100",
                            {flex: props.multiple && isValue},
                            {"opacity-0": isFocus},
                        )}
                    >
                        {value && Array.isArray(value) && (value.slice(0, 3)).map((item, idx) => idx > 1
                            ? (
                                <p key={idx}
                                   className={cn("text-sm/6 px-2 rounded-full bg-[#7d3200] text-white")}>
                                    +{value.length - 2}
                                </p>
                            ) : (
                                <p key={idx}
                                   className={cn("text-sm/6 px-2 rounded-full bg-[#7d3200] text-white")}>
                                    {item.value}
                                </p>
                            ))}
                    </Button>

                    <div className="group absolute inset-y-0 right-0 px-2.5 flex items-center">
                        <ChevronDownIcon
                            className={cn(
                                "pointer-events-none absolute right-2.5 size-6 fill-[#999999]",
                                "transition-opacity duration-200",
                                {"group-hover:opacity-0": isValue}
                            )}
                            aria-hidden="true"
                        />
                    </div>
                </ComboboxButton>

                <Button
                    className={cn(
                        "absolute top-3 z-20 right-2.5",
                        "hidden", {block: isClearable && isValue}
                    )}
                    onClick={() => {
                        setValue(props.multiple ? [] : null);
                    }}
                >
                    <XMarkIcon
                        className={cn(
                            "size-5 text-[#999999]",
                            "transition-opacity duration-200 opacity-0",
                            {"group-hover:opacity-100": isValue}
                        )}
                        aria-hidden="true"
                    />
                    <span className="sr-only">Clear</span>
                </Button>
            </div>

            <ComboboxOptions
                anchor="bottom"
                transition
                className={cn(
                    "rounded-xl overflow-hidden shadow [--anchor-gap:.25rem] z-20",
                    "w-[var(--input-width)] bg-[#f6f6f6] border border-[#E0E0E0]"
                )}
            >
                <div
                    className={cn(
                        "max-h-[250px] overflow-y-auto",
                        "[--anchor-gap:var(--spacing-1)] empty:invisible",
                        "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                    )}
                >
                    {renderOptions(filteredOptions, 0)}
                </div>
            </ComboboxOptions>
        </ComboboxHeadlessUI>
    )
}
