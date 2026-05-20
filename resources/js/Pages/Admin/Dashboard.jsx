import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, 
    CreditCard, 
    ShieldCheck, 
    TrendingUp, 
    UserPlus,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';

export default function AdminDashboard({ stats, incomeSummary, recentPayments }) {
    const data = incomeSummary.map(item => ({
        name: item.month,
        total: parseFloat(item.total)
    }));

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="mb-10">
                <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">Enterprise Overview</h1>
                <p className="text-slate-500 font-medium">Global platform metrics and revenue tracking</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <AdminStatCard 
                    label="Total Registered Users" 
                    value={stats.total_users} 
                    icon={Users} 
                    color="blue"
                    trend="+12% from last month"
                />
                <AdminStatCard 
                    label="Monthly Revenue" 
                    value={`৳${stats.monthly_revenue}`} 
                    icon={CreditCard} 
                    color="emerald"
                    trend="Target: ৳50,000"
                />
                <AdminStatCard 
                    label="Checks Today" 
                    value={stats.checks_today} 
                    icon={ShieldCheck} 
                    color="indigo"
                    trend="Live Monitoring"
                />
                <AdminStatCard 
                    label="Active Subscriptions" 
                    value={stats.active_subs} 
                    icon={UserPlus} 
                    color="purple"
                    trend="94% Retention"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 font-outfit">Revenue Summary</h3>
                            <p className="text-sm text-slate-400 font-medium">Income tracking for last 6 months</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                            <TrendingUp size={14} /> Growing
                        </div>
                    </div>
                    
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ 
                                        borderRadius: '16px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        padding: '12px 16px'
                                    }}
                                />
                                <Bar dataKey="total" radius={[8, 8, 0, 0]} barSize={40}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#4f46e5' : '#e2e8f0'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100/50">
                    <h3 className="text-xl font-bold font-outfit mb-6">Recent Payments</h3>
                    <div className="space-y-6">
                        {recentPayments.map((payment) => (
                            <div key={payment.id} className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-white shrink-0">
                                    {payment.user.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">{payment.user.name}</p>
                                    <p className="text-xs text-white/50">{payment.plan.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-emerald-400">৳{payment.amount}</p>
                                    <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">
                                        {new Date(payment.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link 
                        href={route('admin.payments')}
                        className="mt-8 flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-sm font-bold tracking-widest uppercase"
                    >
                        View All History <ArrowUpRight size={18} />
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function AdminStatCard({ label, value, icon: Icon, color, trend }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-lg">
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-4", colors[color])}>
                <Icon size={24} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-3xl font-black text-slate-900 mb-2 font-outfit">{value}</h3>
            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                {trend}
            </p>
        </div>
    );
}

function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}
