import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#0F0F13] p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link href={route('home')} className="flex items-center gap-2 self-center font-medium text-white">
                    <div className="flex h-9 w-9 items-center justify-center">
                        {/* Logo can be added here */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-9 w-9 text-[#3B82F6]"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                            <path d="M2 17l10 5 10-5"></path>
                            <path d="M2 12l10 5 10-5"></path>
                        </svg>
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl border-[#2A2A36] bg-[#1A1A24] shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl text-white">{title}</CardTitle>
                            <CardDescription className="text-[#A0A0B8]">{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-8">{children}</CardContent>
                    </Card>
                </div>
            </div>

            <div className="text-center text-sm text-[#6C6C7F]">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</div>
        </div>
    );
}
