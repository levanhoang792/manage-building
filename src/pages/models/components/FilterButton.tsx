import {Button} from "@headlessui/react";
import {cn} from "@/lib/utils";
import {AdjustmentsHorizontalIcon} from "@heroicons/react/20/solid";
import {useEffect, useRef, useState} from "react";

function FilterButton() {
    const [isVisible, setIsVisible] = useState(true);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const prevScrollY = useRef(0);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        prevScrollY.current = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const isScrollingDown = currentScrollY > prevScrollY.current;
            prevScrollY.current = currentScrollY;

            const parent = buttonRef.current?.parentElement;
            if (parent) {
                const {top, height} = parent.getBoundingClientRect();
                setIsVisible(top + height > 800 && isScrollingDown);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Button
            ref={buttonRef}
            className={cn(
                "lg:hidden sticky bottom-4 flex gap-2 transition",
                "px-4 py-2 rounded-full left-1/2 transform -translate-x-1/2",
                "border border-[#7D3200] hover:border-[#222]",
                "bg-[#7D3200] hover:bg-white",
                "text-white hover:text-[#222]",
                "opacity-1", {"opacity-0": !isVisible}
            )}
        >
            <AdjustmentsHorizontalIcon className={cn("size-6")}/> Filter
        </Button>
    );
}

export default FilterButton;