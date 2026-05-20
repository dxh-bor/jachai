import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Search, 
    MoreVertical, 
    User as UserIcon, 
    Shield, 
    Calendar,
    Power,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { debounce } from 'lodash';

export default function Users({ users, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = debounce((value) => {
        router.get(route('admin.users'), { search: value }, { preserveState: true, replace: true });
    }, 500);

    const toggleStatus = (id) => {
        router.patch(route('admin.users.update', id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="User Management" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">User Management</h1>
                    <p className="text-slate-500 font-medium">Manage accounts, plans and platform access</p>
                </div>
                
                <div className="relative group min-w-[320px]">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            handleSearch(e.target.value);
                        }}
                        placeholder="Search by name or email..."
                        className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">User Details</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Plan</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Usage</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Joined Date</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{user.name}</p>
                                                <p className="text-sm text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider">
                                            {user.active_plan?.plan?.name || 'No Plan'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-sm font-bold text-slate-900">{user.active_plan?.checks_used || 0}</span>
                                            <div className="w-16 h-1 bg-slate-100 rounded-full">
                                                <div 
                                                    className="h-full bg-indigo-500 rounded-full" 
                                                    style={{ width: `${Math.min((user.active_plan?.checks_used / (user.active_plan?.plan?.api_limit || 1)) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex flex-col items-center gap-0.5">
                                            <span className="text-sm font-bold text-slate-700">{new Date(user.created_at).toLocaleDateString()}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">At {new Date(user.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        {user.is_active ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-wider">
                                                <CheckCircle2 size={12} /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-black uppercase tracking-wider">
                                                <XCircle size={12} /> Banned
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button 
                                            onClick={() => toggleStatus(user.id)}
                                            className={cn(
                                                "p-2 rounded-xl transition-all",
                                                user.is_active ? "text-slate-400 hover:text-red-600 hover:bg-red-50" : "text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
                                            )}
                                            title={user.is_active ? 'Deactivate User' : 'Activate User'}
                                        >
                                            <Power size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-500">
                        Showing <span className="text-slate-900">{users.from}-{users.to}</span> of <span className="text-slate-900">{users.total}</span> users
                    </p>
                    <div className="flex gap-2">
                        {users.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url}
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
