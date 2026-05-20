import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { User, Mail, Shield, Calendar, Camera } from 'lucide-react';

export default function Profile() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <AuthenticatedLayout>
            <Head title="My Profile" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
                <p className="text-slate-500">Manage your account information and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600"></div>
                        <div className="px-6 pb-8 -mt-16 text-center">
                            <div className="relative inline-block">
                                <div className="h-32 w-32 rounded-3xl bg-white p-1.5 shadow-xl mx-auto">
                                    <div className="h-full w-full rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700 text-4xl font-bold border-2 border-white overflow-hidden">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                        ) : (
                                            user.name.charAt(0)
                                        )}
                                    </div>
                                </div>
                                <button className="absolute bottom-1 right-1 bg-white p-2 rounded-xl shadow-lg border border-slate-100 text-slate-600 hover:text-indigo-600 transition-all">
                                    <Camera size={18} />
                                </button>
                            </div>

                            <div className="mt-4">
                                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                                <p className="text-slate-500 text-sm">{user.email}</p>
                            </div>

                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider border border-indigo-100">
                                    {user.role}
                                </span>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider border border-emerald-100">
                                    Active Account
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900">Personal Information</h3>
                            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Edit Profile</button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1.5">Full Name</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                        <User size={18} className="text-slate-400" />
                                        <span className="text-slate-900 font-medium">{user.name}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1.5">Email Address</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                        <Mail size={18} className="text-slate-400" />
                                        <span className="text-slate-900 font-medium">{user.email}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1.5">Account Role</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                        <Shield size={18} className="text-slate-400" />
                                        <span className="text-slate-900 font-medium capitalize">{user.role}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1.5">Member Since</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                        <Calendar size={18} className="text-slate-400" />
                                        <span className="text-slate-900 font-medium">May 2026</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <h4 className="text-sm font-bold text-slate-900 mb-4">Security</h4>
                                <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
