// import {cn} from "@/lib/utils";
// import {Button, Field, Input, Label} from "@headlessui/react";
// import {EyeSlashIcon, MagnifyingGlassIcon, PencilSquareIcon} from "@heroicons/react/20/solid";
// import {CloudArrowUpIcon} from "@heroicons/react/24/outline";
// import Image from "next/image";
// import Start from "@/assets/icons/start.svg"
// import Like from "@/assets/icons/like.svg";
// import Dislike from "@/assets/icons/dislike.svg";
// import {PagePropsPromise, Params} from "@/routes/client";
// import {notFound} from "next/navigation";
// import {fetch3dModel, fetch3dModelDetail} from "@/hooks/models/use3dModel";
// import AdsBanner from "@/app/components/AdsBanner";
// import {Res3dModelDataData} from "@/hooks/models/model";
// import AdsItem from "@/app/models/components/AdsItem";
// import ProductItem from "@/app/models/components/ProductItem";
// import ViewDetail from "@/app/models/detail/[id]/components/ViewDetail";
// import Colors from "@/app/components/Colors";
// import Link from "next/link";
//
// type ParamsProps = Params & {
//     id?: string;
// }
//
// export default async function ProductDetail({params}: PagePropsPromise) {
//     const pathParams: ParamsProps = await params;
//     const id = pathParams.id;
//
//     let itemDataRes: Res3dModelDataData | null = null;
//     if (id) {
//         const res = await fetch3dModelDetail(id); // Fetch từ server trước khi render
//         itemDataRes = res.data;
//     }
//
//     if (!itemDataRes) return notFound();
//
//     const model3d = await fetch3dModel({
//         limit: 18,
//         page: 1
//     }); // Fetch từ server trước khi render
//
//     return (
//         <div className={cn("container mx-auto")}>
//             <div className={cn("pt-6 flex gap-6")}>
//                 <Field className={cn("flex-grow")}>
//                     <Label className={cn("hidden")}>Search text</Label>
//                     <div className={cn("relative flex items-center w-full")}>
//                         <MagnifyingGlassIcon className={cn("size-5 absolute left-6")}/>
//                         <Input
//                             name="full_name"
//                             type="text"
//                             placeholder="Search in 3D model..."
//                             className={cn(
//                                 "h-[52px] w-full rounded-lg bg-[#F8F8F8] border border-[#C9CDD4]",
//                                 "px-12 outline-none text-sm/5"
//                             )}
//                         />
//                     </div>
//                 </Field>
//
//                 <Button
//                     className={cn(
//                         "px-8 flex justify-center items-center gap-2 rounded-lg border border-black",
//                         "hover:bg-[#7D3200] hover:text-white hover:border-transparent transition-colors"
//                     )}
//                     style={{boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.10), 0px 8px 10px -6px rgba(0, 0, 0, 0.10)"}}
//                 >
//                     Upload model
//                     <CloudArrowUpIcon className={cn("size-5")}/>
//                 </Button>
//             </div>
//
//             <AdsBanner/>
//
//             <div
//                 className={cn("flex justify-between flex-col xl:flex-row max-w-[1344px] px-4 pb-3 mx-auto mt-6 gap-12")}>
//                 <div className={cn("flex gap-6 flex-grow h-[690px]")}>
//                     <ViewDetail data={itemDataRes}/>
//                 </div>
//                 <div className={cn("flex flex-col flex-grow")}>
//                     <div className={cn("flex flex-col gap-8 p-8 border border-[#E5E7EB] rounded-[12px]")}>
//                         <div className={cn("flex justify-start items-center gap-4")}>
//                             <Image
//                                 src="/images/avt.png"
//                                 alt="Avatar"
//                                 className={cn("object-contain")}
//                                 priority
//                                 width={40}
//                                 height={40}
//                             />
//                             <p className={cn("font-normal text-[20px]")}>Wiliam nguyen</p>
//                             <div className={cn("w-[6px] h-[6px] rounded-[40px] bg-black")}/>
//                             <p className={cn("font-normal text-[20px]")}>1024 follow</p>
//                         </div>
//                         <div className={cn("flex flex-col gap-1")}>
//                             <h2 className={cn("font-semibold text-[28px] flex items-center gap-4")}>
//                                 {itemDataRes.name}
//                                 <Button>
//                                     <PencilSquareIcon className={cn("size-6 mt-1")}/>
//                                 </Button>
//                             </h2>
//                             <p className={cn("font-medium text-[16px]")}>ID: {itemDataRes.id}</p>
//                         </div>
//                         <div className={cn("flex justify-between")}>
//                             <div className={cn("flex gap-8 items-center")}>
//                                 <Button className={cn("flex items-center")}>
//                                     <EyeSlashIcon className={cn("size-6")}/>
//                                     <span className="sr-only">View Product</span>
//                                 </Button>
//                                 <Button className={cn("flex items-center")}>
//                                     <Start
//                                         width={24}
//                                         height={24}
//                                         className={cn(
//                                             "transition",
//                                             itemDataRes.is_favorite
//                                                 ? "text-[#FFC107] hover:text-[#DFDFDF]"
//                                                 : "text-[#DFDFDF] hover:text-[#FFC107]",
//                                         )}
//                                     />
//                                     <span className="sr-only">View Star Info</span>
//                                 </Button>
//
//                             </div>
//
//                             <Button
//                                 className={cn(
//                                     "px-8 py-3 rounded-lg border border-[#222] text-sm/5 font-semibold",
//                                     "flex justify-center items-center",
//                                     "transition hover:bg-[#7D3200] hover:text-white"
//                                 )}
//                             >
//                                 Add my library
//                             </Button>
//                         </div>
//                         <div className={cn("flex flex-col gap-2 justify-between pt-4 border-t")}>
//                             <div className={cn("flex justify-between")}>
//                                 <p className={cn("font-normal text-[16px] text-[#4B5563]")}>Platform:</p>
//                                 <p className={cn("font-semibold text-[16px]")}>
//                                     {itemDataRes.platform.name}
//                                 </p>
//                             </div>
//                             <div className={cn("flex justify-between")}>
//                                 <p className={cn("font-normal text-[16px] text-[#4B5563]")}>Render:</p>
//                                 <p className={cn("font-semibold text-[16px]")}>
//                                     {itemDataRes.render.name}
//                                 </p>
//                             </div>
//                             <div className={cn("flex justify-between")}>
//                                 <p className={cn("font-normal text-[16px] text-[#4B5563]")}>Color:</p>
//                                 <Colors
//                                     className={cn("gap-2")}
//                                     buttonColor={{
//                                         className: cn("size-6")
//                                     }}
//                                     colors={itemDataRes.colors.map((color) => color.hex_code)}
//                                     disabled={true}
//                                 />
//                             </div>
//                             <div className={cn("flex justify-between")}>
//                                 <p className={cn("font-normal text-[16px] text-[#4B5563]")}>Materials:</p>
//                                 <p className={cn("font-semibold text-[16px] text-[#222]")}>
//                                     {itemDataRes.materials.map((material) => material.name).join(", ")}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                     <div className={cn("flex justify-between mt-6")}>
//                         <Link
//                             href={itemDataRes.file_path}
//                             download={true}
//                             className={cn(
//                                 "w-full max-w-[460px] px-8 py-3 rounded-lg border border-[#222] text-[20px] font-normal",
//                                 "flex justify-center items-center bg-[#7D3200] text-white transition",
//                                 "hover:bg-white hover:text-black"
//                             )}
//                         >
//                             Free Download
//                         </Link>
//                     </div>
//                     <div className={cn("flex justify-start gap-2 mt-6")}>
//                         <p className={cn("font-normal text-[20px] text-[#4B5563]")}>Tag:</p>
//                         <div className={cn("flex justify-start flex-wrap  gap-2")}>
//                             {itemDataRes.tags.map((tag, index) => (
//                                 <p
//                                     key={index}
//                                     className={cn(
//                                         "font-medium text-sm text-[#4B5563] rounded-[6px] bg-[#F0F0F0] px-3 py-1",
//                                     )}
//                                 >
//                                     {tag.name}
//                                 </p>
//                             ))}
//                         </div>
//                     </div>
//                     <div className={cn("flex justify-start mt-10 gap-12")}>
//                         <div className={cn("flex gap-3")}>
//                             <Button className={cn("flex items-center")}>
//                                 <Like width={32} height={32}/>
//                             </Button>
//                             <p className={cn("font-normal text-[20px] text-[#333]")}>1534</p>
//                         </div>
//                         <div className={cn("flex gap-3")}>
//                             <Button className={cn("flex items-center")}>
//                                 <Dislike width={32} height={32}/>
//                             </Button>
//                             <p className={cn("font-normal text-[20px] text-[#333]")}>1534</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             <div className={cn("flex justify-between gap-6 mb-[80px] mt-[100px]")}>
//                 <div className={cn("flex-grow")}>
//                     <div className={cn("flex justify-between mb-10")}>
//                         <h2 className={cn("text-[36px] font-semibold")}>Similar models</h2>
//                     </div>
//
//                     <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6")}>
//                         {
//                             model3d.data.map((item, index) => (
//                                 item.is_ads
//                                     ? <AdsItem key={index} data={item}/>
//                                     : <ProductItem key={index} data={item}/>
//                             ))
//                         }
//                     </div>
//
//                     <div className={cn("mt-10 flex justify-center")}>
//                         <Button
//                             className={cn(
//                                 "py-3 rounded-lg border border-[#222] text-[20px] font-semibold",
//                                 "flex justify-center items-center bg-[#7D3200] text-[#fff] transition w-[166px]"
//                             )}
//                         >
//                             Show more
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
