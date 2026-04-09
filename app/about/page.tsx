import { CalendarCheck, Users, Shield, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Slotify</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          We are on a mission to simplify campus life by making resource booking seamless, transparent, and efficient for every student.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div className="glass p-8 rounded-3xl">
          <div className="aspect-video bg-slate-800/50 rounded-2xl flex items-center justify-center border border-white/5">
            <CalendarCheck className="w-24 h-24 text-blue-500/50" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">The Problem We Solve</h2>
          <p className="text-slate-400 mb-6 leading-relaxed">
            For years, students have struggled with outdated booking systems, double-booked rooms, and long waiting lines just to use basic campus facilities. We believe your time should be spent learning, not waiting.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Slotify replaces manual ledgers and clunky portals with a modern, real-time platform. Whether you need a high-end PC in the lab, a quiet study room, or a slot at the gym, Slotify handles it instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 rounded-2xl text-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
          <p className="text-slate-400">Book resources in under 10 seconds. Real-time availability means no more conflicts.</p>
        </div>
        
        <div className="glass-card p-8 rounded-2xl text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Secure & Verified</h3>
          <p className="text-slate-400">Every booking generates a unique QR code, ensuring that the right student gets the right resource.</p>
        </div>

        <div className="glass-card p-8 rounded-2xl text-center">
          <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Built for Students</h3>
          <p className="text-slate-400">Designed with a student-first approach, featuring an intuitive UI that works flawlessly on mobile.</p>
        </div>
      </div>
    </div>
  );
}
