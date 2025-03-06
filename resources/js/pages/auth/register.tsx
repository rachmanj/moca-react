import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { RegisterForm } from '@/types/index';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        username: '',
        email: '',
        project: '',
        department_id: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=outfit:400,500,600,700&display=swap" rel="stylesheet" />
            </Head>
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-[#A0A0B8]">
                            Name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                            className="border-[#2A2A36] bg-[#1A1A24] text-white placeholder:text-[#6C6C7F] focus:border-[#3B82F6] focus:ring-[#3B82F6]/10"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="username" className="text-[#A0A0B8]">
                            Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            required
                            tabIndex={2}
                            autoComplete="username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            disabled={processing}
                            placeholder="username"
                            className="border-[#2A2A36] bg-[#1A1A24] text-white placeholder:text-[#6C6C7F] focus:border-[#3B82F6] focus:ring-[#3B82F6]/10"
                        />
                        <InputError message={errors.username} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-[#A0A0B8]">
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={3}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                            className="border-[#2A2A36] bg-[#1A1A24] text-white placeholder:text-[#6C6C7F] focus:border-[#3B82F6] focus:ring-[#3B82F6]/10"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="project" className="text-[#A0A0B8]">
                            Project
                        </Label>
                        <Input
                            id="project"
                            type="text"
                            required
                            tabIndex={4}
                            value={data.project}
                            onChange={(e) => setData('project', e.target.value)}
                            disabled={processing}
                            placeholder="Project name"
                            className="border-[#2A2A36] bg-[#1A1A24] text-white placeholder:text-[#6C6C7F] focus:border-[#3B82F6] focus:ring-[#3B82F6]/10"
                        />
                        <InputError message={errors.project} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="department_id" className="text-[#A0A0B8]">
                            Department ID
                        </Label>
                        <Input
                            id="department_id"
                            type="text"
                            tabIndex={5}
                            value={data.department_id}
                            onChange={(e) => setData('department_id', e.target.value)}
                            disabled={processing}
                            placeholder="Department ID (optional)"
                            className="border-[#2A2A36] bg-[#1A1A24] text-white placeholder:text-[#6C6C7F] focus:border-[#3B82F6] focus:ring-[#3B82F6]/10"
                        />
                        <InputError message={errors.department_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-[#A0A0B8]">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={6}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                            className="border-[#2A2A36] bg-[#1A1A24] text-white placeholder:text-[#6C6C7F] focus:border-[#3B82F6] focus:ring-[#3B82F6]/10"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-[#A0A0B8]">
                            Confirm password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={7}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                            className="border-[#2A2A36] bg-[#1A1A24] text-white placeholder:text-[#6C6C7F] focus:border-[#3B82F6] focus:ring-[#3B82F6]/10"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)]"
                        tabIndex={8}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-[#A0A0B8]">
                    Already have an account?{' '}
                    <TextLink href={route('login')} className="text-[#3B82F6] hover:text-white" tabIndex={9}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
