import Link from 'next/link';
import { CalendarCheck, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass mt-auto border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30">
                <CalendarCheck className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xl font-bold text-gradient">Slotify</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-xs">
              The modern resource booking system for students. Book labs, equipment, and facilities with ease.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/login" className="hover:text-blue-400 transition-colors">Student Login</Link></li>
              <li><Link href="/admin-login" className="hover:text-blue-400 transition-colors">Admin Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>helpdesk@slotify.in</li>
              <li>+91 90000 50001</li>
              <li>Knowledge Park 3</li>
              <li>Greater Noida 201306</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Slotify. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
