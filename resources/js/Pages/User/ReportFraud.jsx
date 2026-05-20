import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, FileText, Phone, User as UserIcon, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function ReportFraud({ reports }) {
    const { flash } = usePage().props;
    
    const { data, setData, post, processing, errors, reset } = useForm({
        phone: '',
        name: '',
        details: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('report.fraud.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Report Fraud" />

            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-extrabold font-outfit text-slate-900 mb-2">Report a Fraudulent Customer</h1>
                    <p className="text-slate-500">Help the community by reporting customers who cancel or return orders without valid reasons.</p>
                </div>

                {flash?.success && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-3 font-medium">
                        <AlertCircle size={20} />
                        {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-28">
                            <h2 className="text-xl font-bold font-outfit text-slate-900 mb-6 flex items-center gap-2">
                                <Plus size={20} className="text-indigo-600" /> Add New Report
                            </h2>
                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <Phone size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            placeholder="e.g. 01712345678"
                                            required
                                        />
                                    </div>
                                    {errors.phone && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Customer Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <UserIcon size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            placeholder="Optional"
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Fraud Details *</label>
                                    <textarea
                                        value={data.details}
                                        onChange={(e) => setData('details', e.target.value)}
                                        rows="4"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                                        placeholder="Describe the incident (e.g. refused to pay delivery charge, cancelled upon arrival...)"
                                        required
                                    ></textarea>
                                    {errors.details && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.details}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm h-full">
                            <h2 className="text-xl font-bold font-outfit text-slate-900 mb-6 flex items-center gap-2">
                                <FileText size={20} className="text-indigo-600" /> Your Submitted Reports
                            </h2>

                            {reports && reports.length > 0 ? (
                                <div className="space-y-4">
                                    {reports.map((report) => (
                                        <div key={report.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-white hover:border-indigo-100 transition-all group">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900">{report.phone}</span>
                                                    {report.name && (
                                                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">{report.name}</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                                                    {new Date(report.created_at).toLocaleDateString()}
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full",
                                                        report.status ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                                    )}>
                                                        {report.status ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100 group-hover:border-indigo-50 transition-colors">
                                                "{report.details}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
                                        <FileText size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">No reports yet</h3>
                                    <p className="text-slate-500 text-sm">You haven't submitted any fraud reports manually.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
