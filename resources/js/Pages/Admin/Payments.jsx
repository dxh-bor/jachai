import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Search, 
    Filter, 
    Download, 
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    CreditCard
} from 'lucide-react';

export default function Payments({ payments, filters }) {
    const handleFilterChange = (key, value) => {
        router.get(route('admin.payments'), { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Payment History" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">Payment History</h1>
                    <p className="text-slate-500 font-medium">Monitor revenue and subscription payments</p>
                </div>
                
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                    <Download size={18} /> Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm mb-8 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-xl text-slate-500">
                        <Filter size={18} />
                    </div>
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Filter By:</span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <input
                        type="date"
                        value={filters.date_from || ''}
                        onChange={e => handleFilterChange('date_from', e.target.value)}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                    />
                    <span className="text-slate-300 font-bold">to</span>
                    <input
                        type="date"
                        value={filters.date_to || ''}
                        onChange={e => handleFilterChange('date_to', e.target.value)}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                    />
                </div>

                <select
                    value={filters.status || ''}
                    onChange={e => handleFilterChange('status', e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                >
                    <option value="">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>

                <button 
                    onClick={() => router.get(route('admin.payments'))}
                    className="ml-auto text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                    Reset Filters
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Transaction Details</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Plan</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Amount</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Method</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            {payments.data.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                                <CreditCard size={18} />
                                            </div>
                                            <div>
                                                <p className="text-slate-900">{payment.user.name}</p>
                                                <p className="text-xs text-slate-400 font-mono">TXN: {payment.transaction_id || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-wider">
                                            {payment.plan.name}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="text-lg font-black text-slate-900">৳{payment.amount}</span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                            {payment.payment_method || 'System'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider",
                                            payment.status === 'completed' ? "bg-emerald-50 text-emerald-700" :
                                            payment.status === 'failed' ? "bg-red-50 text-red-700" :
                                            "bg-orange-50 text-orange-700"
                                        )}>
                                            {payment.status === 'completed' ? <CheckCircle2 size={12} /> : 
                                             payment.status === 'failed' ? <XCircle size={12} /> : 
                                             <Clock size={12} />}
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-sm font-bold text-slate-900">{new Date(payment.created_at).toLocaleDateString()}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(payment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex justify-center gap-2">
                                            {payment.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Verify this payment and upgrade user plan?')) {
                                                                router.patch(route('admin.payments.update', payment.id), { status: 'completed' });
                                                            }
                                                        }}
                                                        className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                                                        title="Verify Payment"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Mark this payment as failed?')) {
                                                                router.patch(route('admin.payments.update', payment.id), { status: 'failed' });
                                                            }
                                                        }}
                                                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                                                        title="Mark Failed"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}
                                            {payment.status !== 'pending' && (
                                                <span className="text-xs font-bold text-slate-400 italic">Verified</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-500">
                        Total Revenue: <span className="text-emerald-600">৳{payments.data.reduce((acc, p) => acc + parseFloat(p.amount), 0).toFixed(2)}</span>
                    </p>
                    <div className="flex gap-2">
                        {payments.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                                    link.active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50",
                                    !link.url && "opacity-50 cursor-not-allowed"
                                )}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}
