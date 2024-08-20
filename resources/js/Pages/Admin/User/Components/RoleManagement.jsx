import React, { useState } from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/Components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import PermissionManagement from './PermissionManagement';

export default function IntegratedRoleManagement({ user, roles, permissions, onUpdateUser, onUpdateRoles }) {
    const [selectedRoles, setSelectedRoles] = useState(new Set(user.roles.map(role => role.id)));
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRoles, setEditingRoles] = useState(roles);

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRoleSelect = async (roleId) => {
        const newSelectedRoles = new Set(selectedRoles);
        if (newSelectedRoles.has(roleId)) {
            newSelectedRoles.delete(roleId);
        } else {
            newSelectedRoles.add(roleId);
        }
        setSelectedRoles(newSelectedRoles);

        const updatedUser = {
            ...user,
            roles: roles.filter(role => newSelectedRoles.has(role.id))
        };
        await onUpdateUser(updatedUser);
    };

    const handleEditRoles = () => {
        setEditingRoles(roles);
        setIsDialogOpen(true);
    };

    const handleSaveRole = async (roleId) => {
        const roleToUpdate = editingRoles.find(role => role.id === roleId);
        if (roleToUpdate) {
            await onUpdateRoles(roleToUpdate);
            console.log("Saving role:", roleToUpdate);
        }
    };

    const handleRoleNameChange = (roleId, newName) => {
        setEditingRoles(editingRoles.map(role =>
            role.id === roleId ? { ...role, name: newName } : role
        ));
    };

    const handlePermissionToggle = (roleId, permissionId) => {
        setEditingRoles(editingRoles.map(role => {
            if (role.id === roleId) {
                const updatedPermissions = role.permissions.includes(permissionId)
                    ? role.permissions.filter(id => id !== permissionId)
                    : [...role.permissions, permissionId];
                return { ...role, permissions: updatedPermissions };
            }
            return role;
        }));
    };

    return (
        <div className="space-y-4">
            <Command>
                <CommandInput
                    placeholder="Rechercher un rôle..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    className="border-0"
                    style={{'boxShadow': 'none'}}
                />
                <CommandList>
                    <CommandEmpty>Aucun rôle trouvé.</CommandEmpty>
                    <CommandGroup>
                        {filteredRoles.map((role) => {
                            const isSelected = selectedRoles.has(role.id);
                            return (
                                <CommandItem
                                    key={role.id}
                                    onSelect={() => handleRoleSelect(role.id)}
                                >
                                    <div
                                        className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            isSelected
                                                ? "bg-primary text-primary-foreground"
                                                : "opacity-50 [&_svg]:invisible"
                                        )}
                                    >
                                        <CheckIcon className={cn("h-4 w-4")} />
                                    </div>
                                    <span>{role.name}</span>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup>
                        <CommandItem
                            onSelect={handleEditRoles}
                            className="justify-center text-center"
                        >
                            Éditer les rôles
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Éditer les rôles</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        <Accordion type="single" collapsible className="w-full">
                            {editingRoles.map((role) => (
                                <AccordionItem key={role.id} value={role.id}>
                                    <AccordionTrigger>{role.name}</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4">
                                            <Input
                                                value={role.name}
                                                onChange={(e) => handleRoleNameChange(role.id, e.target.value)}
                                                placeholder="Nom du rôle"
                                            />
                                            <div className="space-y-2">
                                                {/*<h4 className="font-medium">Permissions:</h4>*/}
                                                <PermissionManagement
                                                    allPermissions={permissions}
                                                    selectedPermissions={role.permissions}
                                                    onPermissionToggle={(permissionId) => handlePermissionToggle(role.id, permissionId)}
                                                    searchable={true}
                                                />
                                            </div>
                                            <Button onClick={() => handleSaveRole(role.id)}>
                                                Sauvegarder les modifications
                                            </Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
