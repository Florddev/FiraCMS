import React, { useState } from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/Components/ui/command";
import { Checkbox } from "@/Components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

export default function PermissionManagement({ allPermissions, selectedPermissions, onPermissionToggle, searchable = true }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPermissions = allPermissions.filter(permission =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <Command>
                {searchable && (
                    <CommandInput
                        placeholder="Rechercher une permission..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        className="border-0"
                        style={{'boxShadow': 'none'}}
                    />
                )}
                <CommandList>
                    <CommandEmpty>Aucune permission trouvée.</CommandEmpty>
                    <CommandGroup>
                        {filteredPermissions.map((permission) => {
                            const isSelected = selectedPermissions && selectedPermissions.includes(permission.id);
                            return (
                                <CommandItem
                                    key={permission.id}
                                    onSelect={() => onPermissionToggle(permission.id)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => onPermissionToggle(permission.id)}
                                        />
                                        <span>{permission.name}</span>
                                    </div>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
    );
}
