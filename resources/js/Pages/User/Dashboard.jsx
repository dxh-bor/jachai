import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Calendar, 
    CheckCircle2, 
    AlertCircle, 
    History, 
    ArrowUpRight,
    Search
} from 'lucide-react';

export default function Dashboard({ activePlan, recentChecks }) {
    const usagePercent = activePlan ? (activePlan.checks_used / activePlan.plan.api_limit) * 100 : 0;
    
    return (
        <AuthenticatedLayout>
            <Head title="User Dashboard" />
            
            <div className="mb-8">
                <h1 className="text-2xl font-bold font-outfit text-slate-900">Account Overview</h1>
                <p className="text-slate-500">Monitor your fraud check limits and recent activity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Plan Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Calendar size={80} />
                    </div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">Current Plan</p>
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-2xl font-bold text-slate-900">{activePlan?.plan.name || 'No Plan'}</h3>
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Active
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar size={16} />
                        <span>Expires: {activePlan ? new Date(activePlan.expires_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </div>

                {/* Usage Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm md:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1">API Usage</p>
                            <h3 className="text-2xl font-bold text-slate-900">
                                {activePlan?.checks_used || 0} <span className="text-slate-400 text-lg">/ {activePlan?.plan.api_limit || 0}</span>
                            </h3>
                        </div>
                        <Link 
                            href={route('plans')}
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                        >
                            Upgrade Plan
                        </Link>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                            <span className={usagePercent > 80 ? 'text-orange-600' : 'text-slate-400'}>
                                {usagePercent.toFixed(1)}% Used
                            </span>
                            <span className="text-slate-400">
                                {activePlan ? (activePlan.plan.api_limit - activePlan.checks_used) : 0} Checks Remaining
                            </span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className={cn(
                                    "h-full transition-all duration-1000 ease-out rounded-full",
                                    usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-orange-500' : 'bg-indigo-600'
                                )}
                                style={{ width: `${Math.min(usagePercent, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Checks */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-xl">
                            <History size={20} className="text-slate-600" />
                        </div>
                        <h3 className="font-bold text-slate-900">Recent Fraud Checks</h3>
                    </div>
                    <Link href={route('checker')} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                        New Check <ArrowUpRight size={16} />
                    </Link>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Level</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentChecks.length > 0 ? recentChecks.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                                <Search size={14} />
                                            </div>
                                            <span className="font-semibold text-slate-900">{log.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-700">{log.score_returned}/100</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                            log.risk_level === 'high' ? "bg-red-100 text-red-700" :
                                            log.risk_level === 'medium' ? "bg-orange-100 text-orange-700" :
                                            "bg-green-100 text-green-700"
                                        )}>
                                            {log.risk_level === 'high' ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                                            {log.risk_level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(log.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                        No recent checks found. Start by checking a phone number.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}
