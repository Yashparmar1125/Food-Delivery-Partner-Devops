import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { PartnerMe } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DollarSign, Package, TrendingUp, Calendar, CheckCircle2, CreditCard } from 'lucide-react';

interface OutletContextType {
  partner: PartnerMe | null;
}

export default function PartnerEarningsPage() {
  const { partner } = useOutletContext<OutletContextType>();

  const earnings = partner?.totalEarnings || 0;
  const deliveries = partner?.completedDeliveries || 0;
  const avgPerTrip = deliveries > 0 ? (earnings / deliveries).toFixed(2) : '0.00';

  const mockTrips = [
    { id: 'TRIP-8921', restaurant: 'Burger King - Central Hub', time: 'Today, 2:15 PM', payout: 75.0, tip: 20.0 },
    { id: 'TRIP-8919', restaurant: 'Subway Fresh Eats', time: 'Today, 1:04 PM', payout: 92.5, tip: 15.0 },
    { id: 'TRIP-8914', restaurant: 'Pizza Express Gourmet', time: 'Yesterday, 8:40 PM', payout: 110.0, tip: 30.0 },
  ];

  return (
    <div className="space-y-5 font-sans">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Earnings & Payouts</h1>
        <p className="text-xs text-slate-500">Track your delivery income, incentives, and bank transfers</p>
      </div>

      {/* Hero Earnings Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Accumulated Balance</span>
            <div className="text-3xl font-black mt-1 text-emerald-400">₹{earnings.toFixed(2)}</div>
            <span className="text-[11px] text-slate-300 mt-1 block">Scheduled for next Tuesday payout</span>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl">
            <DollarSign className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Payout UPI: <strong>{partner?.upiId || 'Not linked'}</strong></span>
          </div>
          <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
            Auto-Transfer Enabled
          </span>
        </div>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <Package className="w-4 h-4 text-blue-600" />
            <span>Total Deliveries</span>
          </div>
          <div className="text-xl font-black text-slate-900">{deliveries}</div>
          <span className="text-[10px] text-slate-400">Completed trips</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span>Average per Trip</span>
          </div>
          <div className="text-xl font-black text-slate-900">₹{avgPerTrip}</div>
          <span className="text-[10px] text-purple-600 font-semibold">Base fee + surge</span>
        </div>
      </div>

      {/* Completed Trips Log */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-200/80">
          <CardTitle className="text-sm">Recent Trip Deliveries</CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-slate-100">
          {mockTrips.map((trip) => (
            <div key={trip.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{trip.restaurant}</span>
                  <span className="text-[10px] font-mono text-slate-400">{trip.id}</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">{trip.time}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-slate-900">₹{(trip.payout + trip.tip).toFixed(2)}</div>
                <span className="text-[10px] text-emerald-600 font-semibold">Tip: ₹{trip.tip}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
