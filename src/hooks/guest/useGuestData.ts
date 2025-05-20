import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {httpGet} from '@/utils/api';
import {ResBuildingList} from '@/hooks/buildings/model';
import {ResFloorList} from '@/hooks/floors/model';
import {ResDoorList} from '@/hooks/doors/model';
import {DoorCoordinate} from '@/hooks/doorCoordinates/model';

interface DoorCoordinatesResponse {
    success: boolean;
    message: string;
    data: DoorCoordinate[];
}

// Hook lấy danh sách tòa nhà cho khách
export const useGetGuestBuildingsInfinite = (params?: { limit?: number }) => {
    return useInfiniteQuery({
        queryKey: ['guest-buildings-infinite', params],
        queryFn: async ({pageParam = 1}) => {
            const queryParams = {
                ...params,
                page: pageParam,
                limit: params?.limit || 20
            };
            const queryString = buildQueryString(queryParams);
            const resp = await httpGet({
                uri: `/guest/buildings${queryString}`
            });
            return await resp.json() as ResBuildingList;
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage.data) return undefined;
            const totalPages = Math.ceil(lastPage.data.total / (lastPage.data.limit || 20));
            return lastPage.data.page < totalPages ? lastPage.data.page + 1 : undefined;
        },
        initialPageParam: 1
    });
};

// Hook lấy danh sách tầng cho khách
export const useGetGuestFloors = (buildingId: string | number, params?: { limit?: number }) => {
    return useQuery({
        queryKey: ['guest-floors', buildingId, params],
        queryFn: async () => {
            const queryString = buildQueryString(params);
            const resp = await httpGet({
                uri: `/guest/buildings/${buildingId}/floors${queryString}`
            });
            return await resp.json() as ResFloorList;
        },
        enabled: !!buildingId
    });
};

// Helper function to build query string
const buildQueryString = (params?: { [key: string]: string | number | boolean | undefined | null }) => {
    if (!params) return '';
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
        }
    });
    return `?${searchParams.toString()}`;
};

// Hook lấy danh sách cửa cho khách
export const useGetGuestDoors = (
    buildingId: string | number,
    floorId: string | number,
    params?: { limit?: number }
) => {
    return useQuery({
        queryKey: ['guest-doors', buildingId, floorId, params],
        queryFn: async () => {
            const queryString = buildQueryString(params);
            const resp = await httpGet({
                uri: `/guest/buildings/${buildingId}/floors/${floorId}/doors${queryString}`
            });
            return await resp.json() as ResDoorList;
        },
        enabled: !!buildingId && !!floorId
    });
};

// Hook lấy danh sách tọa độ cửa cho khách
export const useGetGuestDoorCoordinates = (
    buildingId: string | number,
    floorId: string | number,
    doorIds: (string | number)[]
) => {
    return useQuery({
        queryKey: ['guest-door-coordinates', buildingId, floorId, doorIds],
        queryFn: async () => {
            if (!buildingId || !floorId || doorIds.length === 0) return [];
            
            const responses = await Promise.all(
                doorIds.map(async doorId => {
                    try {
                        const resp = await httpGet({
                            uri: `/guest/buildings/${buildingId}/floors/${floorId}/doors/${doorId}/coordinates`
                        });
                        const data = await resp.json() as DoorCoordinatesResponse;
                        console.log('Debug - Door Coordinates Response:', {
                            doorId,
                            data
                        });
                        return {
                            doorId,
                            data: data.data // Return the coordinates array directly
                        };
                    } catch (error) {
                        console.error('Error fetching door coordinates:', {
                            doorId,
                            error
                        });
                        return {
                            doorId,
                            data: []
                        };
                    }
                })
            );
            
            return responses;
        },
        enabled: !!buildingId && !!floorId && doorIds.length > 0
    });
}; 