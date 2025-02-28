import InputError from '@/components/InputError';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Permission {
    id: string;
    name: string;
    guard_name?: string;
}

interface Role {
    id: string;
    name: string;
    guard_name?: string;
}

interface RoleFormProps {
    role?: Role | null;
    permissions: Permission[];
    rolePermissions?: string[];
    submitLabel?: string;
}

export default function RoleForm({ role = null, permissions = [], rolePermissions = [], submitLabel = 'Save' }: RoleFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name || '',
        permissions: rolePermissions || [],
    });

    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(rolePermissions || []);

    const handlePermissionToggle = (permissionId: string) => {
        setSelectedPermissions((prev) => {
            const newSelection = prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId];

            setData('permissions', newSelection);
            return newSelection;
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (role) {
            put(route('roles.update', role.id));
        } else {
            post(route('roles.store'));
        }
    };

    // Group permissions by category (assuming naming convention like "view users", "edit users", etc.)
    const groupedPermissions = permissions.reduce<Record<string, Array<{ id: string; action: string; name: string }>>>((groups, permission) => {
        const parts = permission.name.split(' ');
        const action = parts[0]; // e.g., "view", "create", "edit", "delete"
        const resource = parts.slice(1).join(' '); // e.g., "users", "inventory", etc.

        if (!groups[resource]) {
            groups[resource] = [];
        }

        groups[resource].push({
            id: permission.id,
            action: action,
            name: permission.name,
        });

        return groups;
    }, {});

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{role ? 'Edit Role' : 'Create Role'}</CardTitle>
                    <CardDescription>
                        {role ? 'Update role information and permission assignments.' : 'Create a new role and assign permissions.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Role Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="space-y-2">
                        <Label>Permissions</Label>
                        <div className="space-y-6">
                            {Object.entries(groupedPermissions).map(([resource, perms]) => (
                                <div key={resource} className="space-y-2">
                                    <h3 className="text-sm font-medium capitalize">{resource}</h3>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
                                        {perms.map((permission) => (
                                            <div key={permission.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`permission-${permission.id}`}
                                                    checked={selectedPermissions.includes(permission.id)}
                                                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                                                />
                                                <Label htmlFor={`permission-${permission.id}`} className="cursor-pointer capitalize">
                                                    {permission.action}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.permissions} className="mt-2" />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {submitLabel}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
