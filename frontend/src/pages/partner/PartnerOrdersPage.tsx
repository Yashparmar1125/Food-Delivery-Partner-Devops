import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { partnerAppApi } from '@/lib/partnerApp';
import { DeliveryOrder, PartnerMe } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Package, MapPin, DollarSign, CheckCircle2, Navigation, Clock, Power } from 'lucide-react';

interface OutletContextType {
  partner: PartnerMe | null;
  refreshProfile: () => Promise<void>;
}

export default function PartnerOrdersPage() {
  const { partner, refreshProfile } = useOutletContext<OutletContextType>();
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState<DeliveryOrder | null>(null);
  const [orderStage, setOrderStage] = useState<'PICKUP' | 'DELIVERING' | 'DONE'>('PICKUP');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await partnerAppApi.getAvailableOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptOrder = (order: DeliveryOrder) => {
    setActiveOrder(order);
    setOrderStage('PICKUP');
    setSuccessToast(`Accepted order ${order.orderId}! Navigate to restaurant.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleConfirmPickup = () => {
    setOrderStage('DELIVERING');
    setSuccessToast(`Picked up order! Proceeding to customer drop-off.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleCompleteDelivery = async () => {
    if (!activeOrder) return;
    try {
      await partnerAppApi.completeOrder(activeOrder.orderId, activeOrder.estimatedPayout);
      await refreshProfile();
      setOrders((prev) => prev.filter((o) => o.orderId !== activeOrder.orderId));
      setSuccessToast(`Order Delivered! ₹${activeOrder.estimatedPayout} credited to your earnings.`);
      setActiveOrder(null);
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err: any) {
      alert('Failed to complete delivery');
    }
  };

  if (!partner || partner.currentStatus !== 'ACTIVE') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-amber-900">
        <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2 animate-pulse" />
        <h3 className="font-bold text-base">Account Pending Verification</h3>
        <p className="text-xs text-amber-800 mt-1">
          Delivery dispatch will unlock once your documents are approved by the Back-Office team.
        </p>
      </div>
    );
  }

  if (!partner.isOnline) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <Power className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="font-bold text-base text-slate-800">You Are Currently Offline</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Please go online using the button in the top bar or dashboard to start receiving dispatches.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Delivery Dispatches</h1>
          <p className="text-xs text-slate-500">Live order assignments in {partner.city}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={loadOrders} className="text-xs font-semibold">
          Refresh Orders
        </Button>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Active Order In Progress Card */}
      {activeOrder && (
        <Card className="border-emerald-500 border-2 shadow-lg bg-emerald-50/20">
          <CardHeader className="bg-emerald-600 text-white py-3 px-4 rounded-t-lg">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-4 h-4 animate-spin" />
                Active Mission: {activeOrder.orderId}
              </span>
              <span className="text-xs font-bold bg-white text-emerald-800 px-2 py-0.5 rounded">
                ₹{activeOrder.estimatedPayout} Payout
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3.5">
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">{activeOrder.restaurantName} (Pickup)</span>
                  <span className="text-slate-500 text-[11px]">{activeOrder.restaurantAddress}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">{activeOrder.customerName} (Drop-off)</span>
                  <span className="text-slate-500 text-[11px]">{activeOrder.customerAddress}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              {orderStage === 'PICKUP' ? (
                <Button onClick={handleConfirmPickup} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs">
                  Confirm Food Pickup from Restaurant
                </Button>
              ) : (
                <Button onClick={handleCompleteDelivery} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
                  Complete Delivery & Collect ₹{activeOrder.estimatedPayout}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Orders Feed */}
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
            No orders available in your zone right now. Check back shortly!
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.orderId} className="border-slate-200 shadow-sm hover:border-slate-300 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{order.restaurantName}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                        {order.distanceKm} km
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{order.restaurantAddress}</p>
                    <p className="text-[11px] text-slate-600">Deliver to: <strong className="text-slate-800">{order.customerName}</strong></p>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-emerald-600">₹{order.estimatedPayout}</div>
                    <span className="text-[10px] text-slate-400 block">{order.itemCount} items</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    Ready for Pickup
                  </span>
                  <Button
                    size="sm"
                    disabled={!!activeOrder}
                    onClick={() => handleAcceptOrder(order)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4"
                  >
                    Accept Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
