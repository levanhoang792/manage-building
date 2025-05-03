import {useMutation, useQueryClient} from "@tanstack/react-query";
import {httpDelete} from "@/utils/api";
import {API_ROUTES} from "@/routes/api";

/**
 * Hook to delete a door type
 * @returns Mutation for deleting door types
 */
export const useDeleteDoorType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const uri = API_ROUTES.DOOR_TYPE_DELETE.replace(':id', id.toString());

            const resp = await httpDelete({
                uri,
            });
            return await resp.json() as { success: boolean };
        },
        onSuccess: (_, id) => {
            // Invalidate the door types query to refetch the data
            queryClient.invalidateQueries({queryKey: ['door_types']});
            // Also remove the specific door type query from cache
            queryClient.removeQueries({queryKey: ['door_type', id]});
        },
    });
};