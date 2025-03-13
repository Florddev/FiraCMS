"use client"

import {
    Folder,
    Forward,
    MoreHorizontal,
    Trash2,
    type LucideIcon, ChevronRight, Plus, Home,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
    useSidebar,
} from "@/Components/ui/sidebar"
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/Components/ui/collapsible";

export function NavItem({
    item,
    index
}: {
    item: {
        name?: string
        url?: string
        icon?: LucideIcon
        isActive?: boolean
        hasActive?: boolean
        children: this[]
    }
}) {
    const {isMobile} = useSidebar()

    return (
        <Collapsible key={index} defaultOpen={(item.isActive ?? false) || (item.hasActive ?? false)} className="group/collapsible" aria-expanded={true}>
            <SidebarMenuItem className="group/menu-item" data-active={item.isActive}>

                {item.url ? (
                    <SidebarMenuButton asChild tooltip={item.name} isActive={item.isActive}
                                       className="data-[active=true]:bg-primary/5 data-[active=true]:text-primary hover:bg-sidebar-accent">
                        <a href={item.url ?? '#'}>
                            {item.icon && <item.icon
                                className={"opacity-100 /*group-data-[state=open]/collapsible:opacity-0*/" + (item.children ? ' group-hover/collapsible:opacity-0' : '')}/>}
                            <span>{item.name}</span>
                        </a>
                    </SidebarMenuButton>
                ) : (
                    <CollapsibleTrigger asChild
                                        className="data-[active=true]:hover:!bg-primary/5 data-[active=true]:hover:!text-primary">
                        <SidebarMenuButton asChild tooltip={item.name} isActive={item.isActive}
                                           className="data-[active=true]:bg-primary/5 data-[active=true]:text-primary">
                            <a href={item.url ?? '#'}>
                                {item.icon && <item.icon
                                    className={"opacity-100 /*group-data-[state=open]/collapsible:opacity-0*/" + (item.children ? ' group-hover/collapsible:opacity-0' : '')}/>}
                                <span>{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                )}


                <SidebarMenuAction showOnHover
                                   className="group-data-[state=open]/collapsible:opacity-100 group-data-[active=true]/menu-item:hover:bg-primary/10 group-data-[active=true]/menu-item:!text-primary">
                    <Plus/>
                </SidebarMenuAction>
                <SidebarMenuAction showOnHover
                                   className="group-data-[state=open]/collapsible:opacity-100 group-data-[active=true]/menu-item:hover:bg-primary/10 group-data-[active=true]/menu-item:!text-primary right-7">
                    <MoreHorizontal/>
                </SidebarMenuAction>

                {item.children && (
                    <>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuAction
                                className="left-1 text-sidebar-accent-foreground data-[state=open]:opacity-0 group-data-[active=true]/menu-item:hover:bg-primary/10 group-data-[active=true]/menu-item:!text-primary"
                                showOnHover
                            >
                                <ChevronRight
                                    className="group-data-[state=open]/collapsible:rotate-90 transition-transform"/>
                            </SidebarMenuAction>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                            <SidebarMenuSub>

                                {item.children && item.children.map((child, index) => (
                                    <NavItem item={child} index={index} />
                                    // <SidebarMenuSubItem key={child.name}>
                                    //     <SidebarMenuSubButton asChild>
                                    //         <a href={child.url}>
                                    //             {child.icon && <child.icon/>}
                                    //             <span>{child.name}</span>
                                    //         </a>
                                    //     </SidebarMenuSubButton>
                                    // </SidebarMenuSubItem>
                                ))}


                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </>
                )}
            </SidebarMenuItem>
        </Collapsible>
    )
}
