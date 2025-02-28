import InputError from '@/components/InputError';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

export default function PermissionForm({ permission = null, submitLabel = 'Save' }: { permission: any; submitLabel: string }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: permission?.name || '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (permission) {
            put(route('permissions.update', permission.id));
        } else {
            post(route('permissions.store'));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{permission ? 'Edit Permission' : 'Create Permission'}</CardTitle>
                    <CardDescription>{permission ? 'Update permission information.' : 'Create a new permission.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Permission Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="e.g., view users, create posts, etc."
                        />
                        <p className="text-sm text-gray-500">Use a verb followed by a resource name, e.g., "view users", "create posts", etc.</p>
                        <InputError message={errors.name} className="mt-2" />
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
