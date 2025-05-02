import {useQuery} from "@tanstack/react-query";
import {httpGet} from "@/utils/api";
import {API_ROUTES} from "@/routes/api";
import {ResDoorTypes} from "@/hooks/doorTypes/model";

/**
 * Hook to fetch door types from the API
 * @returns Query result containing door types data
 */
export const useDoorTypes = () => {
    return useQuery({
        queryKey: ['door_types'],
        queryFn: async () => {
            const resp = await httpGet({
                uri: API_ROUTES.DOOR_TYPES
            });
            return await resp.json() as { data: ResDoorTypes };
        }
    });
};