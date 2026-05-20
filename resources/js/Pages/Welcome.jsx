import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { 
    ShieldCheck, 
    Zap, 
    BarChart3, 
    Search, 
    ArrowRight, 
    CheckCircle2, 
    Globe, 
    Truck,
    Shield
} from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Head title="Protect Your E-commerce From Fraud" />
            
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-3">
                            <img src="/Jachai English.svg" alt="Jachai Logo" className="h-10 w-auto" />
                        </div>
                        
                        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
                            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a>
                            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
                        </div>

                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link 
                                    href={route('dashboard')}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                                        Sign In
                                    </Link>
                                    <Link 
                                        href={route('register')}
                                        className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 overflow-hidden relative">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-[120px] -z-10" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-black uppercase tracking-widest mb-8 border border-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Zap size={16} fill="currentColor" /> Trusted by 500+ BD Sellers
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black font-outfit text-slate-900 mb-8 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Stop E-commerce Fraud <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Before You Ship.</span>
                    </h1>
                    
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 font-medium">
                        Analyze customer delivery history across Pathao, Steadfast, and RedX. Detect serial returners and save on shipping costs instantly.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Link 
                            href={route('register')}
                            className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center gap-2"
                        >
                            Start Free Check <ArrowRight size={22} />
                        </Link>
                        <a 
                            href="#how-it-works"
                            className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            Watch Demo
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto py-12 px-8 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-white/50 shadow-2xl shadow-slate-200/50 animate-in fade-in zoom-in duration-1000 delay-500">
                        <div>
                            <p className="text-3xl font-black text-slate-900 font-outfit">1M+</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Numbers Indexed</p>
                        </div>
                        <div className="border-l border-slate-200 pl-8">
                            <p className="text-3xl font-black text-slate-900 font-outfit">98%</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Accuracy Rate</p>
                        </div>
                        <div className="border-l border-slate-200 pl-8">
                            <p className="text-3xl font-black text-slate-900 font-outfit">3</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Major Couriers</p>
                        </div>
                        <div className="border-l border-slate-200 pl-8">
                            <p className="text-3xl font-black text-slate-900 font-outfit">৳0</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Free To Start</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black font-outfit text-slate-900 mb-4 tracking-tight">Supercharge Your Business</h2>
                        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                            Powerful tools designed to help Bangladeshi merchants thrive in a high-return market.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={Globe} 
                            title="Cross-Courier Analysis" 
                            description="Real-time data synchronization from Pathao, Steadfast, and RedX for a complete customer profile."
                            color="indigo"
                        />
                        <FeatureCard 
                            icon={BarChart3} 
                            title="Fraud Risk Scoring" 
                            description="Our AI-driven algorithm calculates a risk score from 0-100 based on verified delivery success rates."
                            color="purple"
                        />
                        <FeatureCard 
                            icon={Shield} 
                            title="Serial Returner Alert" 
                            description="Instant flags for customers who consistently return or cancel orders across different platforms."
                            color="rose"
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-32 bg-slate-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-indigo-500/10 rounded-[3rem] blur-2xl" />
                            <div className="relative bg-white p-8 rounded-[3rem] border border-slate-200 shadow-2xl">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">1</div>
                                        <div className="flex-1">
                                            <p className="font-black text-slate-900">Enter Phone Number</p>
                                            <p className="text-sm text-slate-500 font-medium">Any 11-digit BD number</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-60">
                                        <div className="h-12 w-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl">2</div>
                                        <div className="flex-1">
                                            <p className="font-black text-slate-900">Analyze Couriers</p>
                                            <p className="text-sm text-slate-500 font-medium">Checking 3 major databases...</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                                        <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                                            <Search size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-slate-900">Get Result Score</p>
                                            <p className="text-sm text-indigo-700 font-bold">85 - Safe to Ship!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-4xl font-black font-outfit text-slate-900 mb-8 tracking-tight">How It Works</h2>
                            <div className="space-y-8">
                                <StepItem title="Connect Your Account" description="Register and get access to our real-time courier aggregation engine." />
                                <StepItem title="Check Before Shipping" description="Simply paste the customer's phone number into the fraud checker tool." />
                                <StepItem title="Make Informed Decisions" description="See exactly how many orders they've received, cancelled, or returned." />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex items-center gap-3">
                            <img src="/Jachai English.svg" alt="Jachai Logo" className="h-8 sm:h-10 lg:h-12 w-auto object-contain" />
                        </div>
                        
                        <div className="flex gap-6 sm:gap-10 text-sm font-bold text-slate-500 uppercase tracking-widest flex-wrap justify-center">
                            <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
                        </div>
                        
                        <p className="text-slate-500 text-sm font-medium text-center">
                            © 2026 Jachai. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description, color }) {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-600",
        purple: "bg-purple-50 text-purple-600",
        rose: "bg-rose-50 text-rose-600",
    };
    
    return (
        <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
            <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110", colors[color])}>
                <Icon size={32} />
            </div>
            <h3 className="text-2xl font-black font-outfit text-slate-900 mb-4">{title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium">{description}</p>
        </div>
    );
}

function StepItem({ title, description }) {
    return (
        <div className="flex gap-5">
            <div className="mt-1 flex-shrink-0">
                <CheckCircle2 size={24} className="text-emerald-500" />
            </div>
            <div>
                <h4 className="text-xl font-black text-slate-900 mb-1">{title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}
