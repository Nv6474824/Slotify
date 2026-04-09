'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { CalendarCheck, Clock, ShieldCheck, Zap, ArrowRight, Laptop, Dumbbell, BookOpen } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Clock className="w-6 h-6 text-blue-400" />,
      title: "Real-time Availability",
      description: "Check resource availability instantly and book without conflicts."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      title: "Secure Booking",
      description: "Your bookings are secured with unique QR codes for verification."
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      title: "Instant Notifications",
      description: "Get notified immediately when your booking is approved or rejected."
    }
  ];

  const resources = [
    { name: "Computer Labs", icon: <Laptop className="w-8 h-8" />, color: "from-blue-500 to-cyan-400" },
    { name: "Gym Slots", icon: <Dumbbell className="w-8 h-8" />, color: "from-purple-500 to-pink-400" },
    { name: "Library Study Rooms", icon: <BookOpen className="w-8 h-8" />, color: "from-emerald-500 to-teal-400" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              Modern Campus Resource Management
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Book Campus Facilities <br className="hidden md:block" />
              <span className="text-gradient">With Zero Friction</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              The all-in-one platform for students to reserve labs, equipment, gym slots, and study rooms instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
              >
                Student Login
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/admin-login"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-white/10 rounded-xl transition-all"
              >
                Admin Portal
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 border-t border-white/5 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-slate-400">Book any campus resource in seconds</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((resource, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-8 rounded-2xl text-center group"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${resource.color} bg-opacity-10 mb-6 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {resource.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{resource.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-8 rounded-2xl"
              >
                <div className="bg-slate-800/50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-white/5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
