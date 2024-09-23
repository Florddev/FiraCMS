import React, {useState} from 'react';
import {Link, usePage} from "@inertiajs/react";
import {
    Bell,
    Blocks, CirclePlus,
    CircleUser, Flower,
    Home, Image,
    LineChart,
    Menu,
    Package,
    Package2,
    Search,
    ShoppingCart,
    Users
} from "lucide-react";
import {Button} from "@/Components/ui/button";
import {Badge} from "@/Components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/Components/ui/card";
import {Sheet, SheetContent, SheetTrigger} from "@/Components/ui/sheet";
import {Input} from "@/Components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/Components/ui/dropdown-menu";
import {PluginHook} from "@/hooks.jsx";
import MediaManager from "@/Components/App/MediaManager.jsx";
import ApplicationLogo from "@/Components/ApplicationLogo.jsx";
import LanguageSelector from "@/Components/App/LanguageSelector.jsx";
import {useLaravelReactI18n} from "laravel-react-i18n";

function AppLayout({ current_page, children }) {
    const [avatarPath, setAvatarPath] = useState('');
    const { t, tChoice } = useLaravelReactI18n();

    const auth = usePage().props.auth;

    const navLinksClass = (active = false) => {
        return `flex items-center text-li gap-3 rounded-lg px-3 py-1.5 ` + (active ? `font-medium bg-primary/5 transition-all text-primary` : `font-normal text-muted-foreground transition-all hover:bg-muted`) + ` /*hover:text-primary*/`;
    }

    const navigation = (
        <>
            <nav className="grid items-start px-2 text-sm font-medium gap-0.5">
                <Link href="#" className={navLinksClass(current_page === 'home')}>
                    <Home className="h-4 w-4" />
                    {t('messages.home')}
                </Link>
                <Link href="#" className={navLinksClass(current_page === 'users')}>
                    <Users className="h-4 w-4" />
                    {tChoice('messages.user', 2)}
                </Link>
                <Link href="#" className={navLinksClass(current_page === 'medias')}>
                    <Image className="h-4 w-4" />
                    {tChoice('messages.media', 2)}
                </Link>
                <Link href="#" className={navLinksClass(current_page === 'apparence')}>
                    <Flower className="h-4 w-4" />
                    {t('messages.appearance')}
                </Link>
                <Link href="#" className={navLinksClass(current_page === 'plugins')}>
                    <Blocks className="h-4 w-4" />
                    {tChoice('messages.plugin', 2)}
                    {/*<Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">*/}
                    {/*    6*/}
                    {/*</Badge>*/}
                </Link>
            </nav>
            <PluginHook name="dashboard-navigation" />
        </>
    );

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block sticky top-0 max-h-screen">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4">
                        <Link href="/" className="flex items-center gap-3 font-semibold">
                            <ApplicationLogo className="h-6 w-6 fill-primary" />
                            <span className="">Nexius</span>
                        </Link>
                        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </div>
                    <div className="flex-1">
                        { navigation }
                    </div>
                    <div className="mt-auto p-4">
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
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 sticky top-0">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            { navigation }
                            <div className="mt-auto">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Upgrade to Pro</CardTitle>
                                        <CardDescription>
                                            Unlock all features and get unlimited access to our
                                            support team.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button size="sm" className="w-full">
                                            Upgrade
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                    size=""
                                />
                            </div>
                        </form>
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageSelector/>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="sm">
                                    {auth?.user?.name}
                                    <CircleUser size="icon" className="rounded-full h-5 w-5 ml-2" />
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href={route('profile.edit')} method="get" as="button">Profil</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={route('logout')} method="post" as="button">Logout</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main>

                    {/*<h2>Sélectionnez un avatar</h2>*/}
                    {/*<img src={avatarPath} alt="Avatar" />*/}
                    {/*<MediaManager setter={setAvatarPath} />*/}

                    { children }
                </main>
            </div>
        </div>
    );
}

export default AppLayout;
