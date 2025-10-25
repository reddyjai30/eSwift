import { Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useState } from 'react';

interface WalletScreenProps {
  balance: number;
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  timestamp: string;
  method: 'WALLET' | 'RAZORPAY';
  description: string;
  linkedOrderId?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'debit',
    amount: 947,
    timestamp: 'Today, 2:30 PM',
    method: 'WALLET',
    description: 'Food order payment',
    linkedOrderId: '#ORD1001',
  },
  {
    id: '2',
    type: 'credit',
    amount: 500,
    timestamp: 'Yesterday, 11:20 AM',
    method: 'RAZORPAY',
    description: 'Wallet top-up',
  },
  {
    id: '3',
    type: 'credit',
    amount: 419,
    timestamp: 'Oct 23, 7:15 PM',
    method: 'WALLET',
    description: 'Refund for cancelled order',
    linkedOrderId: '#ORD1003',
  },
  {
    id: '4',
    type: 'debit',
    amount: 628,
    timestamp: 'Oct 22, 8:45 PM',
    method: 'WALLET',
    description: 'Food order payment',
    linkedOrderId: '#ORD1002',
  },
];

export function WalletScreen({ balance }: WalletScreenProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  return (
    <div className="px-4 pt-4 pb-6 space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-[var(--r-16)] p-6 shadow-e-3 text-white">
        <p className="text-sm opacity-90 mb-2">Wallet Balance</p>
        <h2 className="text-4xl font-bold mb-6 tabular-nums">₹{balance.toFixed(2)}</h2>
        <Button 
          className="w-full h-11 bg-white text-[var(--primary)] hover:bg-white/90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Funds
        </Button>
      </div>

      {/* Transactions */}
      <div>
        <h3 className="font-bold text-[var(--text-primary)] mb-3">Recent Transactions</h3>
        <div className="space-y-2">
          {mockTransactions.map((txn) => (
            <button
              key={txn.id}
              onClick={() => setSelectedTransaction(txn)}
              className="w-full bg-[var(--bg-paper)] rounded-[var(--r-12)] p-4 shadow-e-1 hover:shadow-e-2 transition-all duration-[var(--motion-fast)] active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  txn.type === 'credit' 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-red-500/10 text-red-500'
                }`}>
                  {txn.type === 'credit' ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-[var(--text-primary)] line-clamp-1">
                    {txn.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-[var(--text-secondary)]">{txn.timestamp}</p>
                    <Badge 
                      variant="outline" 
                      className="text-xs px-1.5 py-0 bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--divider)]"
                    >
                      {txn.method}
                    </Badge>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p className={`font-bold tabular-nums ${
                    txn.type === 'credit' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Details Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              {selectedTransaction?.type === 'credit' ? 'Credit' : 'Debit'} transaction
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              {/* Transaction Info */}
              <div className="bg-[var(--surface)] rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Amount</span>
                  <span className={`font-bold tabular-nums ${
                    selectedTransaction.type === 'credit' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {selectedTransaction.type === 'credit' ? '+' : '-'}₹{selectedTransaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Time</span>
                  <span className="text-sm text-[var(--text-primary)]">{selectedTransaction.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Method</span>
                  <Badge variant="outline" className="bg-[var(--bg-paper)] text-[var(--text-secondary)] border-[var(--divider)]">
                    {selectedTransaction.method}
                  </Badge>
                </div>
              </div>

              {/* Linked Order */}
              {selectedTransaction.linkedOrderId ? (
                <div>
                  <h4 className="font-medium text-[var(--text-primary)] mb-2">Linked Order</h4>
                  <div className="bg-[var(--surface)] rounded-lg p-3">
                    <p className="text-sm text-[var(--text-secondary)]">Order ID: {selectedTransaction.linkedOrderId}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      2× Margherita Pizza, 1× Chicken Biryani
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-[var(--text-secondary)]">No linked order</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
