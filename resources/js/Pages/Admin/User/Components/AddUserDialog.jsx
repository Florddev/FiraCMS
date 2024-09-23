import * as React from "react"

import { cn } from "@/lib/utils"
import useMediaQuery from "@/Hooks/useMediaQuery"
import { Button } from "@/Components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/Components/ui/drawer"
import { Input } from "@/Components/ui/input"
import { PasswordInput } from "@/Components/ui/input-password"
import { Label } from "@/Components/ui/label"
import {ArrowUpRight} from "lucide-react";
import {useLaravelReactI18n} from "laravel-react-i18n";
import { Checkbox } from '@/Components/ui/checkbox';
import {Switch} from "@/Components/ui/switch";


export function AddUserDialog() {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { t, tChoice } = useLaravelReactI18n();

    const title = t('messages.add_user');
    const subtitle = 'Create a new user';

    const trigger = (
        <Button size="sm">
            { title }
            <ArrowUpRight className="ml-2 w-4 h-4"></ArrowUpRight>
        </Button>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{ trigger }</DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{ title }</DialogTitle>
                        <DialogDescription>{ subtitle }</DialogDescription>
                    </DialogHeader>
                    <ProfileForm />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{ trigger }</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{ title }</DrawerTitle>
                    <DrawerDescription>{ subtitle }</DrawerDescription>
                </DrawerHeader>
                <ProfileForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">{ t('messages.cancel')}</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function ProfileForm({ className }) {
    const { t, tChoice } = useLaravelReactI18n();

    return (
        <form className={cn("grid items-start gap-4", className)}>
            <div className="py-4 grid items-start gap-4">
                <div className="columns-2">
                    <div className="grid gap-2">
                        <Label htmlFor="firstname">Firstname</Label>
                        <Input type="text" id="firstname" placeholder="John" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lastname">Lastname</Label>
                        <Input type="text" id="lastname" placeholder="Snow" />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="john.snow@example.com" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <PasswordInput id="password"/>
                </div>
                <div className="block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            // checked={data.remember}
                            // onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                            User must change password at next login
                        </span>
                    </label>
                </div>
            </div>
            <Button type="submit">{ t('messages.create_user') }</Button>
        </form>
    )
}
