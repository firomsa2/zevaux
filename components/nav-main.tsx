// "use client";

// import { ChevronRight, type LucideIcon } from "lucide-react";

// import {
//   SidebarGroup,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
// } from "@/components/ui/sidebar";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "./ui/collapsible";

// export function NavMain({
//   items,
// }: {
//   items: {
//     title: string;
//     url: string;
//     icon?: LucideIcon;
//     isActive?: boolean;
//     items?: {
//       title: string;
//       url: string;
//     }[];
//   }[];
// }) {
//   const pathname = usePathname();
//   return (
//     // <SidebarGroup>
//     //   <SidebarMenu className="space-y-4">
//     //     {items.map((item) => {
//     //       const isActive = pathname === item.url;
//     //       const Icon = item.icon;

//     //       return (
//     //         <Collapsible
//     //           key={item.title}
//     //           asChild
//     //           defaultOpen={item.isActive}
//     //           className="group/collapsible"
//     //         >
//     //           <SidebarMenuItem>
//     //             {/* MAIN ITEM (parent) */}
//     //             <CollapsibleTrigger asChild>
//     //               <SidebarMenuButton
//     //                 asChild
//     //                 className={cn(
//     //                   "flex items-center transition-colors",
//     //                   isActive
//     //                     ? "!bg-primary !text-white hover:!bg-opacity-90"
//     //                     : "text-secondary hover:bg-surface hover:text-primary"
//     //                 )}
//     //               >
//     //                 <Link href={item.url}>
//     //                   <Icon className="h-5 w-5" />
//     //                   <span className="text-lg">{item.title}</span>

//     //                   {/* Arrow icon */}
//     //                   {item.items && (
//     //                     <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//     //                   )}
//     //                 </Link>
//     //               </SidebarMenuButton>
//     //             </CollapsibleTrigger>

//     //             {/* SUB MENU (children) */}
//     //             {item.items && (
//     //               <CollapsibleContent>
//     //                 <SidebarMenuSub>
//     //                   {item.items.map((sub) => (
//     //                     <SidebarMenuSubItem key={sub.title}>
//     //                       <SidebarMenuSubButton asChild>
//     //                         <Link href={sub.url}>
//     //                           <span>{sub.title}</span>
//     //                         </Link>
//     //                       </SidebarMenuSubButton>
//     //                     </SidebarMenuSubItem>
//     //                   ))}
//     //                 </SidebarMenuSub>
//     //               </CollapsibleContent>
//     //             )}
//     //           </SidebarMenuItem>
//     //         </Collapsible>
//     //       );
//     //     })}
//     //   </SidebarMenu>
//     // </SidebarGroup>

//     <SidebarGroup>
//       <SidebarMenu className="space-y-2">
//         {items.map((item) => {
//           const Icon = item.icon;
//           const hasChildren = item.items?.length > 0;

//           // Is parent active?
//           const isActiveParent =
//             pathname === item.url ||
//             item.items?.some((child) => pathname === child.url);

//           return (
//             <Collapsible
//               key={item.title}
//               asChild
//               defaultOpen={item.isActive || isActiveParent}
//               className="group/collapsible"
//             >
//               <SidebarMenuItem>
//                 {/* ------ Parent Button (with collapsible trigger) ------ */}
//                 <CollapsibleTrigger asChild disabled={!hasChildren}>
//                   <SidebarMenuButton
//                     asChild
//                     className={cn(
//                       "flex items-center transition-colors",
//                       isActiveParent
//                         ? "!bg-primary !text-white hover:!bg-opacity-90"
//                         : "text-secondary hover:bg-surface hover:text-primary"
//                     )}
//                   >
//                     <Link href={item.url}>
//                       {Icon && (
//                         <Icon style={{ width: "20px", height: "20px" }} />
//                       )}
//                       <span className="text-lg">{item.title}</span>

//                       {/* Only show chevron if item has children */}
//                       {hasChildren && (
//                         <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                       )}
//                     </Link>
//                   </SidebarMenuButton>
//                 </CollapsibleTrigger>

//                 {/* ------ Sub Items ------ */}
//                 {hasChildren && (
//                   <CollapsibleContent>
//                     <SidebarMenuSub>
//                       {item.items.map((sub) => {
//                         const isActiveSub = pathname === sub.url;

//                         return (
//                           <SidebarMenuSubItem key={sub.title}>
//                             <SidebarMenuSubButton
//                               asChild
//                               className={cn(
//                                 "pl-9", // indent
//                                 isActiveSub && "font-medium underline"
//                               )}
//                             >
//                               <Link href={sub.url}>
//                                 <span>{sub.title}</span>
//                               </Link>
//                             </SidebarMenuSubButton>
//                           </SidebarMenuSubItem>
//                         );
//                       })}
//                     </SidebarMenuSub>
//                   </CollapsibleContent>
//                 )}
//               </SidebarMenuItem>
//             </Collapsible>
//           );
//         })}
//       </SidebarMenu>
//     </SidebarGroup>
//   );
// }

"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useState } from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>(() => {
    // Initialize with items that are active or have active children
    return items
      .filter((item) => {
        const isActiveParent =
          pathname === item.url ||
          item.items?.some((child) => pathname === child.url);
        return isActiveParent;
      })
      .map((item) => item.title);
  });

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.items && item.items.length > 0;
          const isActiveParent =
            pathname === item.url ||
            item.items?.some((child) => pathname === child.url);
          const isOpen = openItems.includes(item.title);

          return (
            <SidebarMenuItem key={item.title}>
              <Collapsible
                open={isOpen}
                onOpenChange={() => toggleItem(item.title)}
                className="group/collapsible"
              >
                {/* Parent Item */}
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "w-full flex items-center text-md text-secondary justify-between px-3 py-2.5 rounded-lg transition-all",
                      isActiveParent
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <div>
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 flex-1"
                      >
                        {Icon && <Icon className="h-4 w-4 shrink-0" />}
                        <span className="truncate">{item.title}</span>
                      </Link>
                      {hasChildren && (
                        <ChevronRight className="h-3 w-3 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {/* Child Items */}
                {hasChildren && (
                  <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <SidebarMenuSub className="mt-1">
                      {item.items?.map((child) => {
                        const ChildIcon = child.icon;
                        const isActiveChild = pathname === child.url;

                        return (
                          <SidebarMenuSubItem key={child.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                "pl-3 pr-3 py-2 text-sm text-secondary rounded-lg transition-colors",
                                isActiveChild
                                  ? "bg-secondary text-secondary-foreground font-medium"
                                  : "hover:bg-accent hover:text-accent-foreground"
                              )}
                            >
                              <Link href={child.url}>
                                <div className="flex items-center gap-3">
                                  {ChildIcon && (
                                    <ChildIcon className="h-3.5 w-3.5" />
                                  )}
                                  <span>{child.title}</span>
                                </div>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </Collapsible>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
