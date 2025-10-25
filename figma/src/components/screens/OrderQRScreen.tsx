import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { QRCard } from '../QRCard';
import { Button } from '../ui/button';
import { RefundProgress } from '../RefundProgress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface OrderQRScreenProps {
  orderId: string;
  onBack: () => void;
}

export function OrderQRScreen({ orderId, onBack }: OrderQRScreenProps) {
  const [isExpired, setIsExpired] = useState(false);
  const [refundStage, setRefundStage] = useState<'idle' | 'initiated' | 'in-progress' | 'success'>('idle');
  const [refundMethod, setRefundMethod] = useState<'wallet' | 'original'>('wallet');
  const [showRefundDialog, setShowRefundDialog] = useState(false);

  const handleExpire = () => {
    setIsExpired(true);
  };

  const handleRefundConfirm = (method: 'wallet' | 'original') => {
    setRefundMethod(method);
    setShowRefundDialog(false);
    
    // Simulate refund stages
    setRefundStage('initiated');
    setTimeout(() => setRefundStage('in-progress'), 1500);
    setTimeout(() => setRefundStage('success'), 3000);
  };

  const orderTotal = 994.35;

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
          <h1 className="font-bold text-lg text-[var(--text-primary)]">
            {isExpired ? 'QR Expired' : 'Order QR Code'}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-6 pb-6 space-y-6">
        {/* QR Card */}
        <QRCard
          orderId={orderId}
          expiresInSeconds={isExpired ? 0 : 180} // 3 minutes for demo
          onExpire={handleExpire}
        />

        {/* Refund Progress */}
        <RefundProgress
          stage={refundStage}
          method={refundMethod}
          amount={orderTotal}
        />

        {/* Refund Options */}
        {isExpired && refundStage === 'idle' && (
          <div className="space-y-3">
            <p className="text-sm text-[var(--text-secondary)] text-center">
              Your QR code has expired. You can request a refund to your wallet or original payment method.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleRefundConfirm('wallet')}
                className="h-12 bg-[var(--primary)] hover:bg-[var(--primary)]/90"
              >
                Refund to Wallet
              </Button>
              <Button
                onClick={() => setShowRefundDialog(true)}
                variant="outline"
                className="h-12 border-[var(--divider)]"
              >
                Refund to Original
              </Button>
            </div>
          </div>
        )}

        {/* Info Banner */}
        {!isExpired && refundStage === 'idle' && (
          <div className="bg-[var(--info)]/10 border border-[var(--info)]/20 rounded-lg p-4">
            <p className="text-sm text-[var(--info)]">
              Please show this QR code at the counter to collect your order. The code will auto-refresh every 30 seconds.
            </p>
          </div>
        )}
      </div>

      {/* Refund Confirmation Dialog */}
      <AlertDialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refund to Original Method</AlertDialogTitle>
            <AlertDialogDescription>
              The refund will be processed to your original payment method. It may take 5-7 business days to reflect in your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleRefundConfirm('original')}>
              Confirm Refund
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
