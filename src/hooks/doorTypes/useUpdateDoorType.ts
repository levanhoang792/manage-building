import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpPut } from "@/utils/api";
import { API_ROUTES } from "@/routes/api";
import { DoorType, UpdateDoorTypeDto } from "@/hooks/doorTypes/model";

/**
 * Hook to update an existing door type
 * @returns Mutation for updating door types
 */
export const useUpdateDoorType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateDoorTypeDto) => {
      const { id, ...updateData } = params;
      const uri = API_ROUTES.DOOR_TYPE_UPDATE.replace(':id', id.toString());
      
      const resp = await httpPut({
        uri,
        body: JSON.stringify(updateData),
      });
      return await resp.json() as { data: DoorType };
    },
    onSuccess: (_, variables) => {
      // Invalidate the door types query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['door_types'] });
      // Also invalidate the specific door type query
      queryClient.invalidateQueries({ queryKey: ['door_type', variables.id] });
    },
  });
};