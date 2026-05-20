import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Check, Shield, Zap, Building2, Star } from 'lucide-react';

export default function Plans({ plans, activePlanId }) {
    return (
        <AuthenticatedLayout>
            <Head title="Pricing Plans" />

            <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black font-outfit text-slate-900 mb-4 tracking-tight">Simple, Transparent Pricing</h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Choose the plan that fits your business scale. Protect your profit by detecting serial returners and cancellers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div 
                            key={plan.id}
                            className={cn(
                                "relative flex flex-col p-8 bg-white rounded-[2.5rem] border shadow-xl transition-all duration-300 hover:scale-[1.02]",
                                plan.name === 'Pro' ? "border-indigo-500 ring-4 ring-indigo-50" : "border-slate-100 shadow-slate-200/40"
                            )}
                        >
                            {plan.name === 'Pro' && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-indigo-200">
                                    <Star size={12} fill="currentColor" /> Most Popular
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-6">
                                <div className={cn(
                                    "p-3 rounded-2xl",
                                    plan.name === 'Enterprise' ? "bg-purple-100 text-purple-600" :
                                    plan.name === 'Pro' ? "bg-indigo-100 text-indigo-600" :
                                    "bg-slate-100 text-slate-600"
                                )}>
                                    {plan.name === 'Enterprise' ? <Building2 size={24} /> :
                                     plan.name === 'Pro' ? <Zap size={24} /> :
                                     <Shield size={24} />}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 font-outfit">{plan.name}</h3>
                            </div>

                            <div className="mb-8">
                                <span className="text-4xl font-black text-slate-900">৳{plan.price}</span>
                                <span className="text-slate-400 font-bold ml-1">/month</span>
                            </div>

                            <p className="text-slate-500 text-sm font-medium mb-8 flex-1">
                                {plan.description}
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-slate-700 font-bold">
                                    <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                    <span>{plan.api_limit} Checks / Month</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700 font-bold">
                                    <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                    <span>Priority Support</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700 font-bold opacity-60">
                                    <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                    <span>Real-time Courier Sync</span>
                                </div>
                            </div>

                            {activePlanId === plan.id ? (
                                <button disabled className="w-full py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Check size={18} strokeWidth={3} /> Current Plan
                                </button>
                            ) : (
                                <Link 
                                    href="#"
                                    className={cn(
                                        "w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-center transition-all",
                                        plan.name === 'Pro' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700" : "bg-slate-900 text-white hover:bg-slate-800"
                                    )}
                                >
                                    {plan.price === "0.00" ? 'Get Started' : 'Upgrade Now'}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}
