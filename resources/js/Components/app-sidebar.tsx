"use client"

import * as React from "react"
import {
    AudioWaveform, Blocks, Book,
    BookOpen,
    Bot, Calendar,
    Command, Flower,
    Frame,
    GalleryVerticalEnd, Home, Image,
    Map, MoreHorizontal,
    PieChart,
    Settings2,
    SquareTerminal, User, UserCog, Users, UsersRound,
} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {NavProjects} from "@/components/nav-projects"
import {NavUser} from "@/components/nav-user"
import {TeamSwitcher} from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import {NavGroup} from "@/Components/NavGroup";
import {usePage} from "@inertiajs/react";

// This is sample data.
const data = {
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
}

const data2 = {
    navigation: {
        groups: [
            {
                items: [
                    {
                        icon: Home,
                        name: "Home",
                        url: "/nexius-admin/",
                    },
                    {
                        icon: User,
                        name: "User management",
                        children: [
                            {
                                icon: Users,
                                name: "Users",
                                url: "/nexius-admin/users",
                            },
                            {
                                icon: UserCog,
                                name: "Roles",
                                url: "/nexius-admin/roles",
                            }
                        ]
                    },
                    {
                        icon: Image,
                        name: "Medias",
                        url: "/nexius-admin/medias"
                    },
                    {
                        icon: Flower,
                        name: "Appearance",
                        url: "/nexius-admin/templates",
                    },
                    {
                        icon: Blocks,
                        name: "Plugins",
                        url: "/nexius-admin/plugins",
                    },
                    {
                        icon: MoreHorizontal,
                        name: "More",
                    }
                ]
            }, {
                separator: false,
                name: "Gestion",
                items: [
                    {
                        icon: Book,
                        name: "Review",
                    },
                    {
                        icon: Calendar,
                        name: "Plannings",
                    },
                    {
                        icon: Settings2,
                        name: "Settings",
                    },
                    {
                        icon: MoreHorizontal,
                        name: "More",
                    }
                ]
            }
        ]
    }
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const auth = usePage().props.auth;

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader
                className="border-b h-16 py-0 justify-center group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <TeamSwitcher teams={data.teams}/>
            </SidebarHeader>
            <SidebarContent>
                <NavGroup groups={data2.navigation.groups}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={auth.user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
