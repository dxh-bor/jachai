import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit2, 
    Power, 
    Check, 
    X, 
    Shield, 
    Zap, 
    Building2,
    Info
} from 'lucide-react';

export default function Plans({ plans }) {
    const [editingPlan, setEditingPlan] = useState(null);
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: '',
        price: '',
        api_limit: '',
        description: '',
        is_active: true,
    });

    const openEdit = (plan) => {
        setEditingPlan(plan);
        setData({
            name: plan.name,
            price: plan.price,
            api_limit: plan.api_limit,
            description: plan.description || '',
            is_active: plan.is_active,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.plans.update', editingPlan.id), {
            onSuccess: () => {
                setEditingPlan(null);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Plan Management" />

            <div className="flex items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">Plan Management</h1>
                    <p className="text-slate-500 font-medium">Control subscription tiers, pricing and limits</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 flex flex-col relative group">
                        <div className="absolute top-6 right-6 flex gap-2">
                            <button 
                                onClick={() => openEdit(plan)}
                                className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            >
                                <Edit2 size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className={cn(
                                "h-14 w-14 rounded-2xl flex items-center justify-center",
                                plan.name.includes('Basic') ? "bg-slate-100 text-slate-600" :
                                plan.name.includes('Pro') ? "bg-indigo-100 text-indigo-600" :
                                "bg-purple-100 text-purple-600"
                            )}>
                                {plan.name.includes('Basic') ? <Shield size={28} /> :
                                 plan.name.includes('Pro') ? <Zap size={28} /> :
                                 <Building2 size={28} />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 font-outfit">{plan.name}</h3>
                                <div className="flex items-center gap-2">
                                    <div className={cn("h-2 w-2 rounded-full", plan.is_active ? "bg-emerald-500" : "bg-red-500")} />
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        {plan.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <span className="text-4xl font-black text-slate-900">৳{plan.price}</span>
                            <span className="text-slate-400 font-bold ml-1">/mo</span>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">API Limit</span>
                                <span className="text-sm font-black text-indigo-600">{plan.api_limit} Checks</span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium px-2">
                                {plan.description}
                            </p>
                        </div>

                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mt-auto">
                            Last Updated: {new Date(plan.updated_at).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editingPlan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-xl font-black font-outfit text-slate-900">Edit {editingPlan.name} Plan</h3>
                            <button onClick={() => setEditingPlan(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Plan Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-semibold"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-500 font-bold">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Price (BDT)</label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-semibold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">API Limit</label>
                                    <input
                                        type="number"
                                        value={data.api_limit}
                                        onChange={e => setData('api_limit', e.target.value)}
                                        className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-semibold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows="3"
                                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-semibold"
                                />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="h-5 w-5 text-indigo-600 border-slate-300 rounded-lg focus:ring-indigo-500 cursor-pointer"
                                />
                                <label htmlFor="is_active" className="text-sm font-bold text-slate-700 cursor-pointer uppercase tracking-widest">
                                    Set as Active Plan
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingPlan(null)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}
