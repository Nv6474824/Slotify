'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Calendar, Clock, MapPin, CheckCircle, XCircle, Clock3, Zap } from 'lucide-react';
import { toast } from 'sonner';
import QRCodeDisplay from '@/components/QRCodeDisplay';

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

const RESOURCES = {
  'Lab': ['Computer Lab 1', 'Computer Lab 2', 'Hardware Lab'],
  'Equipment': ['DSLR Camera', 'Projector', 'VR Headset'],
  'Auditorium': ['Main Auditorium', 'Mini Hall A', 'Mini Hall B'],
  'Library': ['Study Room 1', 'Study Room 2', 'Discussion Room'],
  'Gym': ['Morning Slot', 'Evening Slot', 'Weekend Slot']
};

const TIME_SLOTS = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM'
];

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allSystemBookings, setAllSystemBookings] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Form State
  const [resourceType, setResourceType] = useState<string>('Lab');
  const [resourceName, setResourceName] = useState<string>(RESOURCES['Lab'][0]);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>(TIME_SLOTS[0]);

  const loadBookings = (userId: string) => {
    const allBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
    setAllSystemBookings(allBookings);
    const userBookings = allBookings.filter(b => b.studentId === userId);
    // Sort by newest first
    userBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setBookings(userBookings);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'student') {
      router.push('/admin');
      return;
    }
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(parsedUser);
    loadBookings(parsedUser.id);

    // Real-time simulation
    const interval = setInterval(() => {
      loadBookings(parsedUser.id);
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const allBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // Prevent double booking logic
    const MAX_CAPACITY = 3;
    const currentBookingsCount = allBookings.filter(
      b => b.resourceName === resourceName && 
           b.date === date && 
           b.timeSlot === timeSlot &&
           b.status !== 'Rejected'
    ).length;

    if (currentBookingsCount >= MAX_CAPACITY) {
      toast.error('This resource is fully booked for the selected time slot.');
      return;
    }

    const userAlreadyBooked = allBookings.some(
      b => b.studentId === user.id &&
           b.resourceName === resourceName && 
           b.date === date && 
           b.timeSlot === timeSlot &&
           b.status !== 'Rejected'
    );

    if (userAlreadyBooked) {
      toast.error('You have already booked this resource for this time slot.');
      return;
    }

    const newBooking: Booking = {
      id: 'bk_' + Math.random().toString(36).substr(2, 9),
      studentId: user.id,
      studentName: user.name,
      resourceType,
      resourceName,
      date,
      timeSlot,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    allBookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(allBookings));
    
    setAllSystemBookings(allBookings);
    setBookings([newBooking, ...bookings]);
    setIsModalOpen(false);
    toast.success('Booking request submitted successfully!');
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

  // Calculate availability for the selected slot
  const MAX_CAPACITY = 3;
  const currentBookingsCount = allSystemBookings.filter(
    b => b.resourceName === resourceName && 
         b.date === date && 
         b.timeSlot === timeSlot &&
         b.status !== 'Rejected'
  ).length;

  let availabilityText = 'Available';
  let availabilityColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  let isBookable = true;

  if (currentBookingsCount >= MAX_CAPACITY) {
    availabilityText = 'Booked Full';
    availabilityColor = 'text-red-400 bg-red-500/10 border-red-500/20';
    isBookable = false;
  } else if (currentBookingsCount > 0) {
    availabilityText = `${MAX_CAPACITY - currentBookingsCount} slots left`;
    availabilityColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  }

  // Smart Slot Suggestor Logic
  const getSuggestedSlot = () => {
    if (!user) return null;
    
    let bestSlot = null;
    let maxAvailable = -1;

    for (const slot of TIME_SLOTS) {
      const bookedCount = allSystemBookings.filter(
        b => b.resourceName === resourceName && 
             b.date === date && 
             b.timeSlot === slot &&
             b.status !== 'Rejected'
      ).length;
      
      const available = MAX_CAPACITY - bookedCount;
      
      const userAlreadyBooked = allSystemBookings.some(
        b => b.studentId === user.id &&
             b.resourceName === resourceName && 
             b.date === date && 
             b.timeSlot === slot &&
             b.status !== 'Rejected'
      );

      if (!userAlreadyBooked && available > maxAvailable) {
        maxAvailable = available;
        bestSlot = slot;
      }
    }

    const currentAvailable = MAX_CAPACITY - currentBookingsCount;

    // Suggest if current is full, OR if there is another slot with significantly more availability
    if (maxAvailable > 0 && bestSlot !== timeSlot && bestSlot !== null) {
       if (currentAvailable === 0) {
          return { slot: bestSlot, reason: 'Current slot is full' };
       }
       if (maxAvailable > currentAvailable) {
          return { slot: bestSlot, reason: 'More availability' };
       }
    }
    return null;
  };

  const suggestion = getSuggestedSlot();

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name}!</h1>
          <p className="text-slate-400">Manage your campus resource bookings here.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Booking
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-white">{bookings.length}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Approved</h3>
          <p className="text-3xl font-bold text-emerald-400">
            {bookings.filter(b => b.status === 'Approved').length}
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Pending</h3>
          <p className="text-3xl font-bold text-amber-400">
            {bookings.filter(b => b.status === 'Pending').length}
          </p>
        </div>
      </div>

      {/* Booking History */}
      <div className="glass rounded-2xl overflow-hidden border border-white/5">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-semibold text-white">Your Bookings</h2>
        </div>
        
        {bookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>You haven&apos;t made any bookings yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 text-slate-300 text-sm">
                  <th className="p-4 font-medium">Resource</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-800/30 transition-colors">
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
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                <h2 className="text-xl font-semibold text-white">New Booking</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Resource Type</label>
                  <select
                    value={resourceType}
                    onChange={(e) => {
                      setResourceType(e.target.value);
                      setResourceName(RESOURCES[e.target.value as keyof typeof RESOURCES][0]);
                    }}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {Object.keys(RESOURCES).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Specific Resource</label>
                  <select
                    value={resourceName}
                    onChange={(e) => setResourceName(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {RESOURCES[resourceType as keyof typeof RESOURCES].map(res => (
                      <option key={res} value={res}>{res}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                {/* Availability Indicator */}
                <div className={`mt-2 p-3 rounded-xl border flex items-center justify-center gap-2 ${availabilityColor}`}>
                  <div className={`w-2 h-2 rounded-full ${availabilityColor.split(' ')[0].replace('text-', 'bg-')}`}></div>
                  <span className="text-sm font-medium">{availabilityText}</span>
                </div>

                {/* Smart Suggestion */}
                {suggestion && (
                  <div className="mt-2 p-3 rounded-xl border border-blue-500/30 bg-blue-500/10 flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">Smart Suggestion</span>
                    </div>
                    <p className="text-xs text-slate-300 text-center">
                      {suggestion.reason}. Try <button type="button" onClick={() => setTimeSlot(suggestion.slot)} className="text-blue-400 font-semibold hover:underline">{suggestion.slot}</button> instead.
                    </p>
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isBookable}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Details Modal (QR Code) */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl text-center p-8"
            >
              <div className="flex justify-end mb-2">
                <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{selectedBooking.resourceName}</h3>
              <p className="text-slate-400 text-sm mb-6">{selectedBooking.date} • {selectedBooking.timeSlot}</p>
              
              {selectedBooking.status === 'Approved' ? (
                <div className="mb-6 flex flex-col items-center">
                  <div className="bg-white p-6 rounded-xl inline-block shadow-xl">
                    <QRCodeDisplay value={JSON.stringify({
                      id: selectedBooking.id,
                      student: selectedBooking.studentName,
                      resource: selectedBooking.resourceName,
                      date: selectedBooking.date
                    })} />
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-slate-500 text-xs font-mono tracking-widest uppercase">{selectedBooking.id}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-emerald-400 text-sm font-medium">Scan QR to verify booking</p>
                </div>
              ) : (
                <div className="mb-6 p-8 bg-slate-800/50 rounded-xl border border-white/5">
                  <p className="text-slate-400 text-sm">
                    QR Code will be generated once the booking is approved.
                  </p>
                </div>
              )}
              
              <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(selectedBooking.status)}`}>
                {getStatusIcon(selectedBooking.status)}
                <span className="ml-2">{selectedBooking.status}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
