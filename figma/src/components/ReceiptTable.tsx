import { ImageWithFallback } from './figma/ImageWithFallback';

interface ReceiptItem {
  id: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
}

interface ReceiptTableProps {
  items: ReceiptItem[];
  subtotal: number;
  gstPercent: number;
  gstAmount: number;
  total: number;
}

export function ReceiptTable({ items, subtotal, gstPercent, gstAmount, total }: ReceiptTableProps) {
  return (
    <div className="bg-[var(--bg-paper)] rounded-[var(--r-12)] p-4 space-y-3">
      {/* Header */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 pb-2 border-b border-[var(--divider)]">
        <div className="text-xs font-medium text-[var(--text-secondary)]">Item</div>
        <div className="text-xs font-medium text-[var(--text-secondary)] text-right min-w-[40px]">Qty</div>
        <div className="text-xs font-medium text-[var(--text-secondary)] text-right min-w-[60px]">Price</div>
        <div className="text-xs font-medium text-[var(--text-secondary)] text-right min-w-[70px]">Total</div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item.id}>
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center">
              {/* Item with thumbnail */}
              <div className="flex items-center gap-2 min-w-0">
                {item.image && (
                  <div className="w-8 h-8 rounded-md overflow-hidden bg-[var(--surface)] flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="text-sm text-[var(--text-primary)] line-clamp-1">{item.name}</span>
              </div>

              {/* Quantity */}
              <div className="text-sm text-[var(--text-primary)] text-right tabular-nums min-w-[40px]">
                {item.quantity}
              </div>

              {/* Price */}
              <div className="text-sm text-[var(--text-secondary)] text-right tabular-nums min-w-[60px]">
                ₹{item.price.toFixed(2)}
              </div>

              {/* Line Total */}
              <div className="text-sm font-medium text-[var(--text-primary)] text-right tabular-nums min-w-[70px]">
                ₹{(item.quantity * item.price).toFixed(2)}
              </div>
            </div>
            
            {/* Dashed separator */}
            {idx < items.length - 1 && (
              <div className="border-t border-dashed border-[var(--divider)] mt-2" />
            )}
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="pt-2 border-t border-[var(--divider)] space-y-2">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-[var(--text-secondary)]">Subtotal</span>
          <span className="text-sm font-medium text-[var(--text-primary)] tabular-nums">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        {/* GST */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-[var(--text-secondary)]">GST ({gstPercent}%)</span>
          <span className="text-sm font-medium text-[var(--text-primary)] tabular-nums">
            ₹{gstAmount.toFixed(2)}
          </span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-2 border-t border-[var(--divider)]">
          <span className="font-bold text-[var(--text-primary)]">Total</span>
          <span className="font-bold text-[var(--text-primary)] tabular-nums">
            ₹{total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
