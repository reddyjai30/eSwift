import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ReceiptTable } from '../ReceiptTable';
import { toast } from 'sonner';

interface OrderDetailsScreenProps {
  orderId: string;
  onBack: () => void;
  onViewQR: () => void;
  onRefund: () => void;
}

const mockOrderDetails = {
  id: '1',
  status: 'paid' as const,
  timestamp: 'Today, 2:30 PM',
  paymentMethod: 'RAZORPAY' as const,
  items: [
    {
      id: '1',
      name: 'Margherita Pizza',
      image: 'https://images.unsplash.com/photo-1572815438941-36e4b94f4dda?w=200',
      quantity: 2,
      price: 299,
    },
    {
      id: '2',
      name: 'Chicken Biryani',
      image: 'https://images.unsplash.com/photo-1752673508949-f4aeeaef75f0?w=200',
      quantity: 1,
      price: 349,
    },
  ],
  subtotal: 947,
  gstPercent: 5,
  gstAmount: 47.35,
  total: 994.35,
};

const statusConfig = {
  paid: { label: 'Paid', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  delivered: { label: 'Delivered', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  refunded: { label: 'Refunded', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  expired: { label: 'Expired', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
};

export function OrderDetailsScreen({ orderId, onBack, onViewQR, onRefund }: OrderDetailsScreenProps) {
  const order = mockOrderDetails;
  const config = statusConfig[order.status];

  const handleShare = () => {
    toast.success('Invoice link copied to clipboard');
  };

  const handleDownload = () => {
    toast.success('Invoice downloaded');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-default)] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[var(--bg-paper)] border-b border-[var(--divider)] shadow-e-1">
        <div className="flex items-center gap-3 h-14 px-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-lg bg-[var(--bg-default)] flex items-center justify-center hover:bg-[var(--surface)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
          <h1 className="font-bold text-lg text-[var(--text-primary)]">Order Details</h1>
          <div className="ml-auto">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-4 pb-6 space-y-4">
        {/* Status & Timestamp */}
        <div className="bg-[var(--bg-paper)] rounded-[var(--r-12)] p-4 shadow-e-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <Badge variant="outline" className={`${config.color} mb-2`}>
                {config.label}
              </Badge>
              <p className="text-sm text-[var(--text-secondary)]">{order.timestamp}</p>
            </div>
            <Badge variant="outline" className="bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--divider)]">
              {order.paymentMethod}
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">Order ID: #{orderId}</p>
        </div>

        {/* Receipt Table */}
        <ReceiptTable
          items={order.items}
          subtotal={order.subtotal}
          gstPercent={order.gstPercent}
          gstAmount={order.gstAmount}
          total={order.total}
        />

        {/* Actions */}
        <div className="space-y-2">
          {(order.status === 'paid' || order.status === 'expired') && (
            <>
              <Button
                onClick={onViewQR}
                className="w-full h-12 bg-[var(--primary)] hover:bg-[var(--primary)]/90"
              >
                View QR Code
              </Button>
              <Button
                onClick={onRefund}
                variant="outline"
                className="w-full h-12 border-[var(--divider)]"
              >
                Request Refund
              </Button>
            </>
          )}

          {order.status === 'delivered' && (
            <Button
              onClick={handleDownload}
              className="w-full h-12 bg-[var(--primary)] hover:bg-[var(--primary)]/90"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Invoice
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
