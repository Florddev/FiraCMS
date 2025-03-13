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
    SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarSeparator,
    useSidebar,
} from "@/Components/ui/sidebar"
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/Components/ui/collapsible";
import {NavItem} from "@/Components/NavItem";

export function NavGroup({
    groups,
}: {
    groups: {
        name?: string
        items: NavItem[]
        separator?: boolean
    }[]
}) {

    const setActive = i => {
        if(i.url == window.location.pathname) i.isActive = true;

        if(i.children) {
            i.children.forEach(setActive);
            i.hasActive = i.children.some(c => c.isActive || c.hasActive);
        }
    }
    groups.forEach(group => group.items.forEach(setActive));

    console.log(groups);

    return groups.map((group) => (
        <>
            {group.separator && (<SidebarSeparator />)}
            <SidebarGroup>
                {group.name != null ? (
                    <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
                ) : null}
                <SidebarMenu className="gap-0.5">
                    {group.items.map((item, index) => (
                        <NavItem item={item} index={index} />
                    ))}


                    {/*<SidebarMenuItem key={item.name}>*/}
                    {/*  <SidebarMenuButton asChild>*/}
                    {/*    <a href={item.url}>*/}
                    {/*      <item.icon />*/}
                    {/*      <span>{item.name}</span>*/}
                    {/*    </a>*/}
                    {/*  </SidebarMenuButton>*/}
                    {/*  <DropdownMenu>*/}
                    {/*    <DropdownMenuTrigger asChild>*/}
                    {/*      <SidebarMenuAction showOnHover>*/}
                    {/*        <MoreHorizontal />*/}
                    {/*        <span className="sr-only">More</span>*/}
                    {/*      </SidebarMenuAction>*/}
                    {/*    </DropdownMenuTrigger>*/}
                    {/*    <DropdownMenuContent*/}
                    {/*      className="w-48 rounded-lg"*/}
                    {/*      side={isMobile ? "bottom" : "right"}*/}
                    {/*      align={isMobile ? "end" : "start"}*/}
                    {/*    >*/}
                    {/*      <DropdownMenuItem>*/}
                    {/*        <Folder className="text-muted-foreground" />*/}
                    {/*        <span>View Project</span>*/}
                    {/*      </DropdownMenuItem>*/}
                    {/*      <DropdownMenuItem>*/}
                    {/*        <Forward className="text-muted-foreground" />*/}
                    {/*        <span>Share Project</span>*/}
                    {/*      </DropdownMenuItem>*/}
                    {/*      <DropdownMenuSeparator />*/}
                    {/*      <DropdownMenuItem>*/}
                    {/*        <Trash2 className="text-muted-foreground" />*/}
                    {/*        <span>Delete Project</span>*/}
                    {/*      </DropdownMenuItem>*/}
                    {/*    </DropdownMenuContent>*/}
                    {/*  </DropdownMenu>*/}
                    {/*</SidebarMenuItem>*/}

                    {/*<SidebarMenuItem>*/}
                    {/*    <SidebarMenuButton className="text-sidebar-foreground/70">*/}
                    {/*        <MoreHorizontal className="text-sidebar-foreground/70"/>*/}
                    {/*        <span>More</span>*/}
                    {/*    </SidebarMenuButton>*/}
                    {/*</SidebarMenuItem>*/}
                </SidebarMenu>
            </SidebarGroup>
        </>
        )
    )
}
