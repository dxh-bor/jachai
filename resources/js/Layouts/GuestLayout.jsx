import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/Jachai English.svg" alt="Jachai Logo" className="h-10 w-auto" />
                    </Link>
                </div>
                <h2 className="text-center text-3xl font-extrabold font-outfit text-slate-900">{title}</h2>
                <p className="mt-2 text-center text-sm text-slate-500">
                    {subtitle}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl border border-slate-100 sm:px-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-purple-50 rounded-full blur-3xl opacity-50" />
                    
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
