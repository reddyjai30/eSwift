import { Plus, Minus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';

interface MenuItemProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  isVeg: boolean;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  description?: string;
}

export function MenuItem({ 
  name, 
  price, 
  image, 
  isVeg, 
  quantity, 
  onAdd, 
  onRemove,
  description 
}: MenuItemProps) {
  return (
    <div className="flex gap-3 p-3 bg-[var(--bg-paper)] rounded-[var(--r-12)] shadow-e-1">
      {/* Image */}
      {image && (
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-[var(--surface)] flex-shrink-0">
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          {/* Veg/Non-veg indicator */}
          <div className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
            isVeg ? 'border-green-600' : 'border-red-600'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-[var(--text-primary)] line-clamp-1">{name}</h4>
            {description && (
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-0.5">
                {description}
              </p>
            )}
            <p className="font-bold text-[var(--text-primary)] mt-1 tabular-nums">₹{price.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex-shrink-0">
        {quantity === 0 ? (
          <button
            onClick={onAdd}
            className="w-9 h-9 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center hover:bg-[var(--primary)]/90 active:scale-95 transition-all duration-[var(--motion-fast)] shadow-e-1"
          >
            <Plus className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-[var(--primary)] rounded-lg px-1 py-1">
            <button
              onClick={onRemove}
              className="w-7 h-7 rounded-md bg-white/20 hover:bg-white/30 active:scale-90 transition-all duration-[var(--motion-fast)] flex items-center justify-center text-white"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-white min-w-[20px] text-center tabular-nums">{quantity}</span>
            <button
              onClick={onAdd}
              className="w-7 h-7 rounded-md bg-white/20 hover:bg-white/30 active:scale-90 transition-all duration-[var(--motion-fast)] flex items-center justify-center text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
