import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
    LayoutDashboard,
    ShieldCheck,
    CreditCard,
    User as UserIcon,
    Users,
    FileText,
    LogOut,
    Menu,
    X,
    Bell,
    Settings,
    ChevronRight,
    Search
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const NavLink = ({ href, active, children, icon: Icon }) => (
    <Link
        href={href}
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            active
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
        )}
    >
        <Icon size={20} className={cn(
            "transition-colors",
            active ? "text-white" : "text-slate-400 group-hover:text-indigo-600"
        )} />
        <span className="font-medium">{children}</span>
        {active && <ChevronRight size={16} className="ml-auto" />}
    </Link>
);

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const isAdmin = auth.user.role === 'admin';

    const userNavigation = [
        { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, active: route().current('dashboard') },
        { name: 'Fraud Checker', href: route('checker'), icon: ShieldCheck, active: route().current('checker') },
        { name: 'Report Fraud', href: route('report.fraud'), icon: FileText, active: route().current('report.fraud') },
        { name: 'My Plans', href: route('plans'), icon: CreditCard, active: route().current('plans') },
        { name: 'Profile', href: route('profile'), icon: UserIcon, active: route().current('profile') },
    ];

    const adminNavigation = [
        { name: 'Admin Dashboard', href: route('admin.dashboard'), icon: LayoutDashboard, active: route().current('admin.dashboard') },
        { name: 'Users Management', href: route('admin.users'), icon: Users, active: route().current('admin.users') },
        { name: 'Plan Management', href: route('admin.plans'), icon: FileText, active: route().current('admin.plans') },
        { name: 'Payment History', href: route('admin.payments'), icon: CreditCard, active: route().current('admin.payments') },
    ];

    const navigation = isAdmin ? adminNavigation : userNavigation;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
            {/* Sidebar (Only for Admins) */}
            {isAdmin && (
                <aside
                    className={cn(
                        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static",
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="h-full flex flex-col px-6 py-8">
                        <div className="flex items-center gap-3 mb-12 px-2">
                            <img src="/Jachai English.svg" alt="Jachai Logo" className="h-10 w-auto" />
                        </div>

                        <nav className="flex-1 space-y-1">
                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">
                                Main Menu
                            </div>
                            {navigation.map((item) => (
                                <NavLink key={item.name} href={item.href} icon={item.icon} active={item.active}>
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>

                        <div className="mt-auto pt-8 border-t border-slate-100">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Sign Out</span>
                            </Link>
                        </div>
                    </div>
                </aside>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center px-4 sm:px-8 sticky top-0 z-40 w-full">
                    <div className="flex items-center flex-1">
                        {/* Hamburger Menu (Admin Mobile) */}
                        {isAdmin && (
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 mr-4"
                            >
                                <Menu size={24} />
                            </button>
                        )}
                        
                        {/* Brand Logo (User only or Admin Mobile) */}
                        {(!isAdmin || (isAdmin && !isSidebarOpen)) && (
                            <div className="flex items-center gap-3">
                                <img src="/Jachai English.svg" alt="Jachai Logo" className="h-8 sm:h-10 w-auto" />
                            </div>
                        )}

                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-4 sm:gap-6 ml-auto">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all hidden sm:block">
                            <Bell size={20} />
                        </button>
                        
                        <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                        
                        {/* Profile Dropdown */}
                        <HeadlessMenu as="div" className="relative">
                            <HeadlessMenu.Button className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-slate-900">{auth.user.name}</p>
                                    <p className="text-xs text-slate-500 capitalize">{auth.user.role}</p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                                    {auth.user.avatar ? (
                                        <img src={auth.user.avatar} alt={auth.user.name} className="h-full w-full object-cover" />
                                    ) : (
                                        auth.user.name.charAt(0)
                                    )}
                                </div>
                            </HeadlessMenu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-slate-200 rounded-xl shadow-xl focus:outline-none overflow-hidden z-50">
                                    <div className="py-1">
                                        {!isAdmin && navigation.map((item) => (
                                            <HeadlessMenu.Item key={item.name}>
                                                {({ active }) => (
                                                    <Link
                                                        href={item.href}
                                                        className={cn(
                                                            active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700',
                                                            'flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors'
                                                        )}
                                                    >
                                                        <item.icon size={16} className={cn(active ? 'text-indigo-600' : 'text-slate-400')} />
                                                        {item.name}
                                                    </Link>
                                                )}
                                            </HeadlessMenu.Item>
                                        ))}
                                        
                                        {!isAdmin && <div className="my-1 border-t border-slate-100" />}

                                        {/* Show simple profile link for admin if they don't have user navigation */}
                                        {isAdmin && (
                                            <HeadlessMenu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href={route('profile')}
                                                        className={cn(
                                                            active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700',
                                                            'flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors'
                                                        )}
                                                    >
                                                        <UserIcon size={16} className={cn(active ? 'text-indigo-600' : 'text-slate-400')} />
                                                        Profile
                                                    </Link>
                                                )}
                                            </HeadlessMenu.Item>
                                        )}
                                        
                                        <HeadlessMenu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className={cn(
                                                        active ? 'bg-red-50 text-red-600' : 'text-slate-700',
                                                        'flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors w-full text-left'
                                                    )}
                                                >
                                                    <LogOut size={16} className={cn(active ? 'text-red-600' : 'text-slate-400')} />
                                                    Sign out
                                                </Link>
                                            )}
                                        </HeadlessMenu.Item>
                                    </div>
                                </HeadlessMenu.Items>
                            </Transition>
                        </HeadlessMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
