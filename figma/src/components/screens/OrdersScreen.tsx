import { useState } from 'react';
import { Package } from 'lucide-react';
import { OrderCard } from '../OrderCard';
import { EmptyState } from '../EmptyState';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

interface OrdersScreenProps {
  onOrderClick: (orderId: string) => void;
}

interface Order {
  id: string;
  status: 'paid' | 'delivered' | 'refunded' | 'expired';
  total: number;
  timestamp: string;
  items: { name: string; image?: string }[];
}

const mockOrders: Order[] = [
  {
    id: '1',
    status: 'paid',
    total: 947,
    timestamp: 'Today, 2:30 PM',
    items: [
      { name: 'Margherita Pizza', image: 'https://images.unsplash.com/photo-1572815438941-36e4b94f4dda?w=200' },
      { name: 'Chicken Biryani', image: 'https://images.unsplash.com/photo-1752673508949-f4aeeaef75f0?w=200' },
    ],
  },
  {
    id: '2',
    status: 'delivered',
    total: 628,
    timestamp: 'Yesterday, 7:15 PM',
    items: [
      { name: 'Classic Burger', image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?w=200' },
      { name: 'Penne Arrabiata', image: 'https://images.unsplash.com/photo-1749169337822-d875fd6f4c9d?w=200' },
    ],
  },
  {
    id: '3',
    status: 'expired',
    total: 419,
    timestamp: 'Oct 23, 6:45 PM',
    items: [
      { name: 'California Roll', image: 'https://images.unsplash.com/photo-1700324822763-956100f79b0d?w=200' },
    ],
  },
  {
    id: '4',
    status: 'refunded',
    total: 329,
    timestamp: 'Oct 20, 8:20 PM',
    items: [
      { name: 'Paneer Tikka Pizza', image: 'https://images.unsplash.com/photo-1572815438941-36e4b94f4dda?w=200' },
    ],
  },
];

export function OrdersScreen({ onOrderClick }: OrdersScreenProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'past'>('all');

  const filteredOrders = mockOrders.filter((order) => {
    if (filter === 'all') return true;
    if (filter === 'active') return order.status === 'paid';
    if (filter === 'past') return ['delivered', 'refunded', 'expired'].includes(order.status);
    return true;
  });

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList className="w-full grid grid-cols-3 bg-[var(--bg-paper)] h-10">
          <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
          <TabsTrigger value="active" className="text-sm">Active</TabsTrigger>
          <TabsTrigger value="past" className="text-sm">Past</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Your order history will appear here once you place your first order"
        />
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              {...order}
              onClick={() => onOrderClick(order.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
