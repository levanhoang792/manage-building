// import {httpGet, httpPost} from "@/utils/api";
// import {API_ROUTES} from "@/routes/api";
// import {ResRequest} from "@/hooks/model";
// import {
//     ReqCreateLibrary,
//     ReqCreateModelLibrary,
//     ResCreateLibrary,
//     ResCreateModelLibrary,
//     ResLibraries
// } from "@/hooks/library/model";
// import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
//
// const queryKey = "library";
//
// const fetchLibrary = async () => {
//     const resp = await httpGet(
//         {
//             uri: API_ROUTES.LIBRARIES
//         }
//     )
//     return await resp.json() as ResRequest<Array<ResLibraries>>;
// }
//
// const useLibrary = () => {
//     return useQuery({
//         queryKey: [queryKey],
//         queryFn: () => fetchLibrary(),
//     })
// }
//
// /*const fetchLibraryDetail = async (id: string) => {
//     const resp = await httpGet(
//         {
//             uri: API_ROUTES.PRODUCTS_DETAIL.replace(":id", id)
//         }
//     )
//     return await resp.json() as ResRequest<Res3dModelDetailData>;
// }*/
//
// const createLibrary = async (params: ReqCreateLibrary) => {
//     const resp = await httpPost(
//         {
//             uri: API_ROUTES.LIBRARIES,
//             options: {body: JSON.stringify(params)}
//         },
//     )
//     return await resp.json() as ResRequest<ResCreateLibrary>;
// }
//
// const useLibraryCreate = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: createLibrary,
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: [queryKey]}).then(r => console.log("Re-fetching data: ", r));
//         },
//         onError: () => {
//         }
//     });
// };
//
// const createModelLibrary = async (params: ReqCreateModelLibrary) => {
//     const resp = await httpPost(
//         {
//             uri: API_ROUTES.LIBRARIES_ADD_MODEL.replace(":id", String(params.library_id)),
//             options: {body: JSON.stringify(params)}
//         },
//     )
//     return await resp.json() as ResRequest<ResCreateModelLibrary>;
// }
//
// const useCreateModelLibrary = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: createModelLibrary,
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: [queryKey]}).then(r => console.log("Re-fetching data: ", r));
//         },
//         onError: () => {
//         }
//     });
// };
//
// export {
//     fetchLibrary,
//
//     useLibrary,
//     useLibraryCreate,
//     useCreateModelLibrary
// };