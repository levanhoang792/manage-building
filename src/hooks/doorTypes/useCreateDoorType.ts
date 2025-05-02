import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpPost } from "@/utils/api";
import { API_ROUTES } from "@/routes/api";
import { CreateDoorTypeDto, DoorType } from "@/hooks/doorTypes/model";

/**
 * Hook to create a new door type
 * @returns Mutation for creating door types
 */
export const useCreateDoorType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateDoorTypeDto) => {
      const resp = await httpPost({
        uri: API_ROUTES.DOOR_TYPE_CREATE,
        body: JSON.stringify(params),
      });
      return await resp.json() as { data: DoorType };
    },
    onSuccess: () => {
      // Invalidate the door types query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['door_types'] });
    },
  });
};