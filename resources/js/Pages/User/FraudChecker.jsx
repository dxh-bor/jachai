import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Search,
    Loader2,
    ShieldCheck,
    AlertTriangle,
    CheckCircle,
    Info,
    Truck,
    TrendingUp,
    AlertCircle,
    Check
} from 'lucide-react';

export default function FraudChecker({ recentChecks, remainingChecks }) {
    const { flash } = usePage().props;
    const [result, setResult] = useState(flash.result || null);

    const { data, setData, post, processing, errors, reset } = useForm({
        phone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('checker.check'), {
            onSuccess: (page) => {
                if (page.props.flash.result) {
                    setResult(page.props.flash.result);
                    reset('phone');
                }
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Fraud Checker" />

            <div className="max-w-4xl mx-auto">
                <div className="mb-10 text-center">
                    <div className="flex justify-center mb-4">
                        <img src="/Jachai English.svg" alt="Jachai Logo" className="h-16 md:h-12 w-auto object-contain" />
                    </div>
                </div>

                {/* Search Tool */}
                <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-xl shadow-slate-200/40 mb-10 relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-60" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-60" />

                    <form onSubmit={submit} className="relative z-10">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <Search size={22} />
                                </div>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    placeholder="Enter 11-digit phone (e.g. 01700000000)"
                                    className="block w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                                    disabled={processing}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing || !data.phone}
                                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                {processing ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>Check Now <TrendingUp size={20} /></>
                                )}
                            </button>
                        </div>
                        {errors.phone && <p className="mt-3 text-sm text-red-500 font-bold ml-2 flex items-center gap-1.5">
                            <AlertCircle size={14} /> {errors.phone}
                        </p>}

                        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                                <Info size={16} className="text-slate-400" />
                                Analyzing Pathao, Steadfast & RedX
                            </span>
                            <div className="h-4 w-px bg-slate-200" />
                            <span className={cn(
                                "font-bold px-3 py-1 rounded-lg",
                                remainingChecks < 5 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                            )}>
                                {remainingChecks} checks remaining this month
                            </span>
                        </div>
                    </form>
                </div>

                {/* Result Section */}
                {result && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        {/* Score Card */}
                        <div className={cn(
                            "rounded-[2.5rem] p-10 border-2 shadow-2xl relative overflow-hidden",
                            result.risk_level === 'high' ? "bg-red-50 border-red-100 shadow-red-200/20" :
                                result.risk_level === 'medium' ? "bg-orange-50 border-orange-100 shadow-orange-200/20" :
                                    "bg-emerald-50 border-emerald-100 shadow-emerald-200/20"
                        )}>
                            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                                {/* Score Circle */}
                                <div className="relative flex items-center justify-center">
                                    <svg className="w-48 h-48 transform -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="transparent"
                                            className="text-white/50"
                                        />
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="transparent"
                                            strokeDasharray={552}
                                            strokeDashoffset={552 - (552 * result.score) / 100}
                                            strokeLinecap="round"
                                            className={cn(
                                                "transition-all duration-1000",
                                                result.risk_level === 'high' ? "text-red-500" :
                                                    result.risk_level === 'medium' ? "text-orange-500" :
                                                        "text-emerald-500"
                                            )}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-5xl font-black font-outfit text-slate-900">{result.score}</span>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fraud Score</span>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                                        <span className="text-2xl font-bold text-slate-900">{result.phone}</span>
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider",
                                            result.risk_level === 'high' ? "bg-red-600 text-white" :
                                                result.risk_level === 'medium' ? "bg-orange-500 text-white" :
                                                    "bg-emerald-600 text-white"
                                        )}>
                                            {result.risk_level} Risk
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black font-outfit text-slate-900 mb-4 leading-tight">
                                        {result.risk_level === 'high' ? "Highly Likely to Cancel/Return" :
                                            result.risk_level === 'medium' ? "Moderate Fraud Risk Detected" :
                                                "Trusted Customer - Safe to Ship"}
                                    </h2>
                                    <div className="p-5 rounded-2xl bg-white/60 border border-white/50 text-slate-700 leading-relaxed font-medium">
                                        {result.risk_level === 'high' ? "We recommend collecting full payment in advance. This phone number has a high cancellation and return history across multiple couriers." :
                                            result.risk_level === 'medium' ? "Consider calling the customer to confirm the order before shipping. Some irregular activity was detected in their history." :
                                                "This customer has a healthy delivery record. You can proceed with Cash on Delivery (COD) with confidence."}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metric Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <MetricCard label="Total Orders" value={result.total_orders} icon={Truck} color="indigo" />
                            <MetricCard label="Delivered" value={result.delivered} icon={CheckCircle} color="emerald" />
                            <MetricCard label="Cancelled" value={result.cancelled} icon={XCircle} color="red" />
                            <MetricCard label="Returned" value={result.returned} icon={AlertCircle} color="orange" />
                        </div>

                        {/* Courier Breakdown */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                                <Truck size={20} className="text-indigo-600" />
                                <h3 className="font-bold text-slate-900">Courier Wise History</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Courier</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Orders</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center text-emerald-600">Delivered</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center text-red-600">Cancelled</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center text-orange-600">Returned</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Success Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                        {Object.entries(result.courier_breakdown).map(([name, data]) => (
                                            <tr key={name} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 capitalize">{name}</td>
                                                <td className="px-6 py-4 text-center">{data.orders}</td>
                                                <td className="px-6 py-4 text-center text-emerald-600">{data.delivered}</td>
                                                <td className="px-6 py-4 text-center text-red-600">{data.cancelled}</td>
                                                <td className="px-6 py-4 text-center text-orange-600">{data.returned}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={cn(
                                                                    "h-full rounded-full",
                                                                    data.success_rate > 80 ? "bg-emerald-500" : data.success_rate > 50 ? "bg-orange-500" : "bg-red-500"
                                                                )}
                                                                style={{ width: `${data.success_rate}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm">{data.success_rate}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Community Fraud Reports */}
                        {result.reported_frauds && result.reported_frauds.length > 0 && (
                            <div className="bg-white p-6 rounded-3xl border border-red-100 shadow-sm shadow-red-50 mb-10">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <AlertCircle size={20} className="text-red-600" />
                                    Community & Partner Fraud Reports
                                </h3>
                                <div className="space-y-4">
                                    {result.reported_frauds.map(report => (
                                        <div key={report.id} className="p-4 rounded-2xl bg-red-50 border border-red-100/50 relative">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900">{report.phone}</span>
                                                    {report.name && <span className="text-xs font-bold text-slate-600 bg-slate-200/50 px-2 py-1 rounded-full">{report.name}</span>}
                                                </div>
                                                <span className="text-xs font-bold bg-white text-red-600 px-3 py-1 rounded-full shadow-sm">Reported via {report.source}</span>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed font-medium">"{report.details}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Flags */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-orange-500" />
                                    Risk Flags Detected
                                </h3>
                                <div className="space-y-2">
                                    {result.flags.length > 0 ? result.flags.map(flag => (
                                        <div key={flag} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-slate-700 font-bold text-sm">
                                            <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                            {flag.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </div>
                                    )) : (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm">
                                            <Check size={18} /> No risk flags detected
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                                <div className="bg-indigo-50 p-4 rounded-full mb-3 text-indigo-600">
                                    <ShieldCheck size={40} />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Last Analysis Time</h4>
                                <p className="text-sm text-slate-500">{new Date(result.last_fetched_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}

                {!result && (
                    <div className="text-center py-20 opacity-40">
                        <div className="flex justify-center mb-6">
                            <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                                <Search size={48} />
                            </div>
                        </div>
                        <p className="text-slate-400 font-medium">Detailed results will appear here after analysis</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

function MetricCard({ label, value, icon: Icon, color }) {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        red: "bg-red-50 text-red-600 border-red-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-indigo-200 transition-all">
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", colors[color])}>
                <Icon size={24} />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black text-slate-900">{value}</p>
        </div>
    );
}

function XCircle(props) {
    return <AlertCircle {...props} />;
}

function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}
