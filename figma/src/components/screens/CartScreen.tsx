import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trash2, Wallet as WalletIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { MenuItem } from '../MenuItem';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';

interface CartScreenProps {
  onBack: () => void;
  onCheckout: (useWallet: boolean) => void;
  walletBalance: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  isVeg: boolean;
  quantity: number;
}

const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    price: 299,
    image: 'https://images.unsplash.com/photo-1572815438941-36e4b94f4dda?w=200',
    isVeg: true,
    quantity: 2,
  },
  {
    id: '2',
    name: 'Chicken Biryani',
    price: 349,
    image: 'https://images.unsplash.com/photo-1752673508949-f4aeeaef75f0?w=200',
    isVeg: false,
    quantity: 1,
  },
];

export function CartScreen({ onBack, onCheckout, walletBalance }: CartScreenProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [useWallet, setUseWallet] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gstPercent = 5;
  const gstAmount = (subtotal * gstPercent) / 100;
  const total = subtotal + gstAmount;
  const walletShortage = useWallet ? Math.max(0, total - walletBalance) : 0;

  const handleAddItem = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
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
          <h1 className="font-bold text-lg text-[var(--text-primary)]">Your Cart</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-4 pb-32">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)]">Your cart is empty</p>
            <Button onClick={onBack} variant="outline" className="mt-4">
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart Items */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="relative">
                  <MenuItem
                    {...item}
                    onAdd={() => handleAddItem(item.id)}
                    onRemove={() => handleRemoveItem(item.id)}
                  />
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-[var(--error)]/10 text-[var(--error)] flex items-center justify-center hover:bg-[var(--error)]/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="bg-[var(--bg-paper)] rounded-[var(--r-12)] p-4 shadow-e-1 space-y-3">
              <h3 className="font-bold text-[var(--text-primary)]">Bill Summary</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Subtotal</span>
                  <span className="font-medium text-[var(--text-primary)] tabular-nums">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">GST ({gstPercent}%)</span>
                  <span className="font-medium text-[var(--text-primary)] tabular-nums">
                    ₹{gstAmount.toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-bold text-[var(--text-primary)]">Total</span>
                  <span className="font-bold text-[var(--text-primary)] tabular-nums">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-[var(--bg-paper)] rounded-[var(--r-12)] p-4 shadow-e-1 space-y-3">
              <h3 className="font-bold text-[var(--text-primary)]">Payment Method</h3>
              
              <div className="flex items-start gap-3">
                <Checkbox
                  id="use-wallet"
                  checked={useWallet}
                  onCheckedChange={(checked) => setUseWallet(!!checked)}
                />
                <div className="flex-1">
                  <label
                    htmlFor="use-wallet"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <WalletIcon className="w-5 h-5 text-[var(--primary)]" />
                    <span className="font-medium text-[var(--text-primary)]">
                      Pay via Wallet
                    </span>
                  </label>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 tabular-nums">
                    Balance: ₹{walletBalance.toFixed(2)}
                  </p>
                </div>
              </div>

              {walletShortage > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Insufficient balance. You need ₹{walletShortage.toFixed(2)} more. Please add funds or use a different payment method.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      {cartItems.length > 0 && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-[var(--bg-paper)] border-t border-[var(--divider)] p-4 shadow-e-3 z-40"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => onCheckout(useWallet)}
              disabled={useWallet && walletShortage > 0}
              className="w-full h-12 bg-gradient-primary text-white border-0 relative overflow-hidden"
            >
              <span className="relative z-10">
                {useWallet ? 'Pay from Wallet' : 'Proceed to Payment'}
                <span className="ml-2 font-bold tabular-nums">₹{total.toFixed(2)}</span>
              </span>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
