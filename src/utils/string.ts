export const DATE_FORMAT_DEFAULT = "DD/MM/YYYY h:mm A";

export const STATUS_LIST = {
    DRAFT: "DRAFT",
    PENDING_APPROVAL: "PENDING_APPROVAL",
    APPROVED: "APPROVED",
    REJECT: "REJECT"
} as const;

export const STATUS_LIST_MAP_COLOR: Record<typeof STATUS_LIST[keyof typeof STATUS_LIST], string> = {
    [STATUS_LIST.DRAFT]: "#6B7280", // text-gray-500
    [STATUS_LIST.PENDING_APPROVAL]: "#F59E0B", // text-yellow-500
    [STATUS_LIST.APPROVED]: "#10B981", // text-green-500
    [STATUS_LIST.REJECT]: "#EF4444" // text-red-500
}

export const STATUS_LIST_MAP_NAME: Record<typeof STATUS_LIST[keyof typeof STATUS_LIST], string> = {
    [STATUS_LIST.DRAFT]: "Draft",
    [STATUS_LIST.PENDING_APPROVAL]: "Pending",
    [STATUS_LIST.APPROVED]: "Approved",
    [STATUS_LIST.REJECT]: "Reject"
}
