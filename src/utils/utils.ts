export const objectToFormData = <T extends Record<string, File | [] | object | string | number | null>>(
    obj: T
): FormData => {
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value);
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                formData.append(`${key}[${index}]`, item);
            });
        } else if (typeof value === "object" && value !== null) {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, String(value));
        }
    });

    return formData;
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));