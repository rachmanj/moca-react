import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { LoginForm } from '@/types/index';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        login: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Log in to your account" description="">
            <Head title="Log in">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=outfit:400,500,600,700&display=swap" rel="stylesheet" />
            </Head>

            {status && <div className="mb-6 rounded-md bg-[#1A2C1A] p-4 text-center text-sm font-medium text-[#4ADE80]">{status}</div>}

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="login" className="text-[#A0A0B8]">
                            Username or Email
                        </Label>
                        <Input
                            id="login"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="username email"
                            value={data.login}
                            onChange={(e) => setData('login', e.target.value)}
                            placeholder="Username or email"
                            className="border-[#2A2A36] bg-[#1A1A24] text-white placeholder:text-[#6C6C7F] focus:border-[#3B82F6] focus:ring-[#3B82F6]/10"
                        />
                        <InputError message={errors.login} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="text-[#A0A0B8]">
                                Password
                            </Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm text-[#8A8AFF] hover:text-white" tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            className="border-[#2A2A36] bg-[#1A1A24] text-white placeholder:text-[#6C6C7F] focus:border-[#3B82F6] focus:ring-[#3B82F6]/10"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            tabIndex={3}
                            className="border-[#2A2A36] bg-[#1A1A24] text-[#3B82F6] focus:ring-[#3B82F6]/10"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked as boolean)}
                        />
                        <Label htmlFor="remember" className="text-[#A0A0B8]">
                            Remember me
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)]"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Log in
                    </Button>
                </div>

                <div className="text-center text-sm text-[#A0A0B8]">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} className="text-[#3B82F6] hover:text-white" tabIndex={5}>
                        Sign up
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
