import InputError from '@/components/InputError';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Role {
    id: string;
    name: string;
    guard_name?: string;
}

interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    project: string;
    department_id: string;
}

interface UserFormProps {
    user?: User | null;
    roles: Role[];
    userRoles: string[];
    submitLabel?: string;
}

export default function UserForm({ user = null, roles = [], userRoles = [], submitLabel = 'Save' }: UserFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        project: user?.project || '',
        department_id: user?.department_id || '',
        password: '',
        password_confirmation: '',
        roles: userRoles || [],
    });

    const [selectedRoles, setSelectedRoles] = useState<string[]>(userRoles || []);

    const handleRoleToggle = (roleId: string) => {
        setSelectedRoles((prev) => {
            const newSelection = prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId];

            setData('roles', newSelection);
            return newSelection;
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (user) {
            put(route('users.update', user.id));
        } else {
            post(route('users.store'));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{user ? 'Edit User' : 'Create User'}</CardTitle>
                    <CardDescription>
                        {user ? 'Update user information and role assignments.' : 'Create a new user and assign roles.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={data.username} onChange={(e) => setData('username', e.target.value)} required />
                            <InputError message={errors.username} className="mt-2" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="project">Project</Label>
                            <Input id="project" value={data.project} onChange={(e) => setData('project', e.target.value)} required />
                            <InputError message={errors.project} className="mt-2" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="department_id">Department ID</Label>
                            <Input id="department_id" value={data.department_id} onChange={(e) => setData('department_id', e.target.value)} />
                            <InputError message={errors.department_id} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password {user && '(leave blank to keep current)'}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required={!user}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required={!user}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Roles</Label>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            {roles.map((role) => (
                                <div key={role.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`role-${role.id}`}
                                        checked={selectedRoles.includes(role.id)}
                                        onCheckedChange={() => handleRoleToggle(role.id)}
                                    />
                                    <Label htmlFor={`role-${role.id}`} className="cursor-pointer">
                                        {role.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.roles} className="mt-2" />
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
