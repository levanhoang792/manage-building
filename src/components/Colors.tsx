import {cn} from "@/lib/utils";
import {Button} from "@headlessui/react";
import {CheckIcon} from "@heroicons/react/20/solid";
import {useEffect, useRef, useState} from "react";

interface ColorProps {
    colors: string[];
    className?: string,
    defaultValue?: (string)[],
    buttonColor?: {
        className: string
    },
    onChange?: (color: string[] | undefined) => void,
    max?: number
    disabled?: boolean
}

function Colors({colors, className, buttonColor, defaultValue, onChange, max, disabled}: ColorProps) {
    const lastSelectedColor = useRef<string[] | undefined>(defaultValue); // Lưu giá trị gần nhất
    const firstRenderDefaultValue = useRef(defaultValue); // 🔥 Lưu giá trị `defaultValue` ban đầu

    // Nếu `defaultValue` thay đổi sau render đầu tiên → Báo lỗi
    useEffect(() => {
        if (JSON.stringify(firstRenderDefaultValue.current) !== JSON.stringify(defaultValue)) {
            console.error("❌ ERROR: `defaultValue` should not change after first render!");
            throw new Error("❌ ERROR: `defaultValue` should not change after first render!");
        }
    }, [defaultValue]);

    const onChangeRef = useRef(onChange); // 🔥 Lưu `onChange` để tránh ảnh hưởng từ component cha

    // Cập nhật ref của `onChange` nếu nó thay đổi
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    const [selectedColor, setSelectedColor] = useState<string[] | undefined>(defaultValue || undefined);

    // Xác định nếu đã đạt max số lượng màu
    const isMaxReached = selectedColor && max !== undefined ? selectedColor.length >= max : false;

    const isLight = (color: string) => {
        if (!color.startsWith('#')) {
            color = '#' + color;
        }
        // Mở rộng mã màu rút gọn nếu cần
        if (color.length === 4) {
            color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
        }
        const hex = color.replace("#", "");
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186;  // Độ sáng threshold
    };

    const onChangeInternal = (color: string) => {
        setSelectedColor((prev) => {
            // Nếu màu đã được chọn, loại bỏ nó
            if (prev?.includes(color)) {
                return prev.filter((c) => c !== color);
            }

            // Nếu chưa chọn & chưa đạt max, thêm màu mới vào danh sách
            if (!isMaxReached) {
                return prev ? [...prev, color] : [color];
            }

            return prev; // Không thay đổi nếu đã đạt max
        });
    };

    useEffect(() => {
        if (JSON.stringify(lastSelectedColor.current) !== JSON.stringify(selectedColor)) {
            lastSelectedColor.current = selectedColor;
            onChangeRef.current?.(selectedColor);
        }
    }, [selectedColor]);

    return (
        <div className={cn("flex justify-between mt-2", className)}>
            {colors?.map((color, index) => {
                const isSelected = selectedColor?.includes(color);

                return (
                    <Button
                        key={index}
                        title="Select color"
                        className={cn(
                            "size-12 rounded-full border border-[#E2E2E2]",
                            "flex justify-center items-center",
                            {"opacity-50 cursor-not-allowed": isMaxReached && !isSelected}, // Disable nếu đạt max
                            {"hover:cursor-default": disabled},
                            (buttonColor?.className || "")
                        )}
                        style={{backgroundColor: color}}
                        onClick={() => {
                            if (disabled) return;
                            onChangeInternal(color)
                        }}
                    >
                        {
                            isSelected ? (
                                <CheckIcon className={cn("size-4", isLight(color) ? "fill-black" : "fill-white")}/>
                            ) : (
                                <></>
                            )
                        }
                    </Button>
                )
            })}
        </div>


    );
}

export default Colors;