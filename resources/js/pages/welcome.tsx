import { type SharedData } from '@/types/index';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="MODA - Oldcores Management System">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
                <style>{`
                    body {
                        font-family: 'Roboto', sans-serif;
                    }
                `}</style>
            </Head>
            <div
                className="relative flex min-h-screen flex-col items-center justify-center text-white"
                style={{
                    backgroundColor: '#0A0F1A',
                    backgroundImage: `
                        linear-gradient(to bottom, rgba(10, 15, 26, 0.85), rgba(10, 15, 26, 0.8)),
                        url('/bg-image.png')
                    `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Overlay Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxRTI5M0IiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

                {/* Main Content - Centered */}
                <div className="relative w-full max-w-4xl px-4 py-16 text-center">
                    {/* Animated Gradient Border */}
                    <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-[#1E3A8A]/20 via-[#3B82F6]/20 to-[#1E3A8A]/20 p-[1px] opacity-70 blur-xl"></div>

                    {/* Main Typography */}
                    <h1 className="font-roboto mb-4 text-6xl font-black tracking-tighter text-white md:text-7xl lg:text-8xl">MOCA</h1>

                    <h2 className="font-roboto mb-12 text-xl font-light text-[#94A3B8] md:text-2xl">Management System of Oldcores APS</h2>

                    {/* Buttons */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href={route('login')}
                            className="group relative w-full overflow-hidden rounded-lg border border-[#1E293B] bg-[#0F172A]/80 px-8 py-4 text-center text-lg font-medium text-white backdrop-blur-sm transition-all hover:border-[#3B82F6]/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] sm:w-auto"
                        >
                            <span className="relative z-10">Login</span>
                            <div className="absolute inset-0 -z-0 translate-y-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-20"></div>
                        </Link>

                        <Link
                            href={route('register')}
                            className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-8 py-4 text-center text-lg font-medium text-white shadow-lg transition-all hover:shadow-[0_8px_30px_rgba(59,130,246,0.5)] sm:w-auto"
                        >
                            <span className="relative z-10">Register</span>
                            <div className="absolute inset-0 -z-0 translate-y-full bg-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-20"></div>
                        </Link>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -right-20 -z-10 h-64 w-64 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] opacity-10 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 -z-10 h-64 w-64 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] opacity-10 blur-3xl"></div>
                </div>
            </div>
        </>
    );
}
