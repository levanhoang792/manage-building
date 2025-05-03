import {useQuery} from "@tanstack/react-query";
import {httpGet} from "@/utils/api";
import {API_ROUTES} from "@/routes/api";
import {DoorType} from "@/hooks/doorTypes/model";

/**
 * Hook to fetch a specific door type by ID
 * @param id The ID of the door type to fetch
 * @returns Query result containing the door type data
 */
export const useDoorTypeDetail = (id: number) => {
    return useQuery({
        queryKey: ['door_type', id],
        queryFn: async () => {
            const uri = API_ROUTES.DOOR_TYPE_DETAIL.replace(':id', id.toString());

            const resp = await httpGet({
                uri,
            });
            return await resp.json() as { data: DoorType };
        },
        // Only fetch if ID is provided
        enabled: !!id,
    });
};