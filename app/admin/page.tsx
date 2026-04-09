'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Check, X, Calendar, Clock, User as UserIcon, CheckCircle, XCircle, Clock3, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Booking = {
  id: string;
  studentId: string;
  studentName: string;
  resourceType: string;
  resourceName: string;
  date: string;
  timeSlot: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const loadBookings = () => {
    const allBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
    // Sort by newest first
    allBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setBookings(allBookings);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/admin-login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(parsedUser);
    loadBookings();

    // Real-time simulation
    const interval = setInterval(() => {
      loadBookings();
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  const handleStatusChange = (bookingId: string, newStatus: 'Approved' | 'Rejected') => {
    const allBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updatedBookings = allBookings.map(b => 
      b.id === bookingId ? { ...b, status: newStatus } : b
    );
    
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    
    if (newStatus === 'Approved') {
      toast.success('Booking approved successfully');
    } else {
      toast.error('Booking rejected');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'Rejected': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock3 className="w-5 h-5 text-amber-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-slate-400">Manage all campus resource booking requests.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-blue-500">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Total Requests</h3>
          <p className="text-3xl font-bold text-white">{bookings.length}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-amber-500">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Pending</h3>
          <p className="text-3xl font-bold text-amber-400">
            {bookings.filter(b => b.status === 'Pending').length}
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-emerald-500">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Approved</h3>
          <p className="text-3xl font-bold text-emerald-400">
            {bookings.filter(b => b.status === 'Approved').length}
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-red-500">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-red-400">
            {bookings.filter(b => b.status === 'Rejected').length}
          </p>
        </div>
      </div>

      {/* All Bookings */}
      <div className="glass rounded-2xl overflow-hidden border border-white/5">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Recent Requests</h2>
        </div>
        
        {bookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No booking requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 text-slate-300 text-sm">
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium">Resource</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                          <UserIcon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{booking.studentName}</div>
                          <div className="text-xs text-slate-400 text-mono">{booking.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-white">{booking.resourceName}</div>
                      <div className="text-sm text-slate-400">{booking.resourceType}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-slate-300 text-sm mb-1">
                        <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                        {booking.date}
                      </div>
                      <div className="flex items-center text-slate-400 text-sm">
                        <Clock className="w-4 h-4 mr-2 text-slate-500" />
                        {booking.timeSlot}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1.5">{booking.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {booking.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleStatusChange(booking.id, 'Approved')}
                            className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'Rejected')}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500 italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
