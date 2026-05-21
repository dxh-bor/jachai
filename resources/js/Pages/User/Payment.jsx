import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, Copy, CreditCard, Wallet } from 'lucide-react';

export default function Payment({ plan }) {
    const { data, setData, post, processing, errors } = useForm({
        plan_id: plan.id,
        amount: plan.price,
        payment_method: 'bkash',
        transaction_id: '',
    });

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payment.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Complete Payment" />

            <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Column 1: Payment Instructions */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl p-8 h-fit">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                                <CreditCard size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 font-outfit">Payment Instructions</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-bold text-slate-700">bKash / Nagad / Rocket</span>
                                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-wider">Personal Account</span>
                                </div>
                                <p className="text-sm text-slate-500 mb-4">Please send the exact amount to the following number:</p>
                                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                                    <span className="text-lg font-black text-slate-900">+880 17XXXXXXXX</span>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard('+880 17XXXXXXXX')}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-indigo-600"
                                        title="Copy Number"
                                    >
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    <span>Send money to the number above</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    <span>Copy the Transaction ID from your app</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    <span>Enter the Transaction ID in the form below</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Payment Form */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                                <Wallet size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 font-outfit">Submit Transaction</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Selected Plan</label>
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold">
                                    {plan.name} - ৳{plan.price}/mo
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Payment Method</label>
                                <select
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value)}
                                    className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                                >
                                    <option value="bkash">bKash</option>
                                    <option value="nagad">Nagad</option>
                                    <option value="rocket">Rocket</option>
                                </select>
                                {errors.payment_method && <p className="text-red-500 text-xs mt-1 font-medium">{errors.payment_method}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Amount Paid (৳)</label>
                                <input
                                    type="number"
                                    value={data.amount}
                                    readOnly
                                    className="block w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold cursor-not-allowed focus:outline-none"
                                />
                                {errors.amount && <p className="text-red-500 text-xs mt-1 font-medium">{errors.amount}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Transaction ID</label>
                                <input
                                    type="text"
                                    value={data.transaction_id}
                                    onChange={(e) => setData('transaction_id', e.target.value)}
                                    placeholder="e.g. ABC123XYZ"
                                    className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                                />
                                {errors.transaction_id && <p className="text-red-500 text-xs mt-1 font-medium">{errors.transaction_id}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                            >
                                {processing ? 'Submitting...' : 'Submit Payment'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
