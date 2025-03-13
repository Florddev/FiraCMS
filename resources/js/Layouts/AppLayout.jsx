import React, {useState} from 'react';
import {Head, Link, usePage} from "@inertiajs/react";
import {
    Bell,
    Blocks,
    CircleUser, Flower,
    Home, Image,
    Menu,
    Users
} from "lucide-react";
import {Button} from "@/Components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/Components/ui/card";
import {Sheet, SheetContent, SheetTrigger} from "@/Components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/Components/ui/dropdown-menu";
import {PluginHook} from "@/hooks";
import ApplicationLogo from "@/Components/ApplicationLogo";
import LanguageSelector from "@/Components/App/LanguageSelector";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/Components/ui/breadcrumb";
import {useTranslations} from "@/Hooks/useTranslations";
import {AppSidebar} from "@/Components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/Components/ui/sidebar";
import {Separator} from "@/Components/ui/separator";

function AppLayout({current_page, title, children}) {
    const [avatarPath, setAvatarPath] = useState('');
    const {t, tChoice, tPlural} = useTranslations();

    const {auth, app} = usePage().props;

    const navLinksClass = (active = false) => {
        return `flex items-center text-li gap-3 rounded-lg px-3 py-1.5 ` + (active ? `font-medium bg-primary/5 transition-all text-primary` : `font-normal text-muted-foreground transition-all hover:bg-muted`) + ` /*hover:text-primary*/`;
    }

    const navigation = (
        <>
            <nav className="grid items-start px-2 text-sm font-medium gap-0.5">
                <Link href="#" className={navLinksClass(current_page === 'home')}>
                    <Home className="h-4 w-4"/>
                    {t('messages.home')}
                </Link>
                <Link href="#" className={navLinksClass(current_page === 'users')}>
                    <Users className="h-4 w-4"/>
                    {t('messages.user_management')}
                </Link>
                <Link href="#" className={navLinksClass(current_page === 'medias')}>
                    <Image className="h-4 w-4"/>
                    {tPlural('messages.media')}
                </Link>
                <Link href="#" className={navLinksClass(current_page === 'apparence')}>
                    <Flower className="h-4 w-4"/>
                    {t('messages.appearance')}
                </Link>
                <Link href="#" className={navLinksClass(current_page === 'plugins')}>
                    <Blocks className="h-4 w-4"/>
                    {tPlural('messages.plugin')}
                    {/*<Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">*/}
                    {/*    6*/}
                    {/*</Badge>*/}
                </Link>
            </nav>
            <PluginHook name="dashboard-navigation"/>
        </>
    );

    const navigation_footer = (
        <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                    Unlock all features and get unlimited access to our support team.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                    Upgrade
                </Button>
            </CardContent>
        </Card>
    );

    const breadcrumb = (window.location.pathname.split(`${app?.admin?.prefix ?? ''}/`)[1] ?? '').split('/');
    console.log(breadcrumb);

    return (
        <>
            <Head title={title}/>
            <SidebarProvider>
                <AppSidebar/>
                <SidebarInset>
                    <header
                        className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] border-b ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1"/>
                            <Separator orientation="vertical" className="mr-2 h-4"/>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {breadcrumb.map((value, i) => (
                                        i !== breadcrumb.length ? (
                                            <BreadcrumbItem className="hidden md:block">
                                                <BreadcrumbLink href="#">
                                                    {t(`messages.${value}`)}
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                        ) : (
                                            <BreadcrumbItem>
                                                <BreadcrumbPage>{t(`messages.${value}`)}</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        )
                                    ))}
                                    {/*<BreadcrumbItem className="hidden md:block">*/}
                                    {/*    <BreadcrumbLink href="#">*/}
                                    {/*        {t('messages.user_management')}*/}
                                    {/*    </BreadcrumbLink>*/}
                                    {/*</BreadcrumbItem>*/}
                                    {/*<BreadcrumbSeparator className="hidden md:block" />*/}
                                    {/*<BreadcrumbItem>*/}
                                    {/*    <BreadcrumbPage>{tPlural('messages.user')}</BreadcrumbPage>*/}
                                    {/*</BreadcrumbItem>*/}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>


                    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
                        <div className="hidden border-r bg-muted/40 md:block sticky top-0 max-h-screen">
                            <div className="flex h-full max-h-screen flex-col gap-2">
                                <div className="flex h-14 items-center border-b px-4">
                                    <Link href="/" className="flex items-center gap-3 font-semibold">
                                        <ApplicationLogo className="h-6 w-6 fill-primary"/>
                                        <span className="">{app.name}</span>
                                    </Link>
                                    <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                                        <Bell className="h-4 w-4"/>
                                        <span className="sr-only">Toggle notifications</span>
                                    </Button>
                                </div>
                                <div className="flex-1">
                                    {navigation}
                                </div>
                                <div className="mt-auto p-4">
                                    {navigation_footer}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <header className="flex h-14 items-center gap-4 border-b bg-card z-10 px-4 sticky top-0">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                            <Menu className="h-5 w-5"/>
                                            <span className="sr-only">Toggle navigation menu</span>
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="flex flex-col">
                                        {navigation}
                                        <div className="mt-auto">
                                            {navigation_footer}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                                <div className="w-full flex items-center gap-2">
                                    {/*
                            <Users className="h-4 w-4" />
                            <span className="text-sm font-bold">{title}</span>
                            */}

                                    <Breadcrumb>
                                        <BreadcrumbList>
                                            <BreadcrumbItem>
                                                <BreadcrumbLink href="/" className="flex items-center gap-2">
                                                    <Users className="h-4 w-4"/>
                                                    {title}
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator/>
                                            <BreadcrumbItem>
                                                <BreadcrumbPage className="flex items-center gap-2">
                                                    {tPlural('user')}
                                                </BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </BreadcrumbList>
                                    </Breadcrumb>

                                </div>
                                <div className="flex items-center gap-2">
                                    <LanguageSelector/>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="secondary" size="sm">
                                                {auth?.user?.name}
                                                <CircleUser size="icon" className="rounded-full h-5 w-5 ml-2"/>
                                                <span className="sr-only">Toggle user menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem>
                                                <Link href={route('profile.edit')} method="get"
                                                      as="button">Profil</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={route('logout')} method="post" as="button">Logout</Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </header>
                            <main className="h-full flex-1 flex-col md:flex">

                                {/*<h2>Sélectionnez un avatar</h2>*/}
                                {/*<img src={avatarPath} alt="Avatar" />*/}
                                {/*<MediaManager setter={setAvatarPath} />*/}

                                {children}
                            </main>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}

export default AppLayout;
