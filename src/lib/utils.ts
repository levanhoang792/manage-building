import {twMerge} from "tailwind-merge";
import {clsx} from "clsx";

export function cn(...inputs: string[]): string {
    return twMerge(clsx(inputs));
}
