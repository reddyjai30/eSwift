import { useState } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { MenuItem } from '../MenuItem';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface MenuScreenProps {
  restaurantId: string;
  restaurantName: string;
  onBack: () => void;
  onViewCart: () => void;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  isVeg: boolean;
  category: string;
  description: string;
}

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    price: 299,
    image: 'https://images.unsplash.com/photo-1572815438941-36e4b94f4dda?w=200',
    isVeg: true,
    category: 'Pizzas',
    description: 'Fresh tomatoes, mozzarella, basil',
  },
  {
    id: '2',
    name: 'Chicken Biryani',
    price: 349,
    image: 'https://images.unsplash.com/photo-1752673508949-f4aeeaef75f0?w=200',
    isVeg: false,
    category: 'Main Course',
    description: 'Aromatic rice with tender chicken',
  },
  {
    id: '3',
    name: 'Classic Burger',
    price: 199,
    image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?w=200',
    isVeg: false,
    category: 'Burgers',
    description: 'Beef patty, lettuce, tomato, cheese',
  },
  {
    id: '4',
    name: 'Penne Arrabiata',
    price: 279,
    image: 'https://images.unsplash.com/photo-1749169337822-d875fd6f4c9d?w=200',
    isVeg: true,
    category: 'Pasta',
    description: 'Spicy tomato sauce with garlic',
  },
  {
    id: '5',
    name: 'California Roll',
    price: 399,
    image: 'https://images.unsplash.com/photo-1700324822763-956100f79b0d?w=200',
    isVeg: false,
    category: 'Sushi',
    description: 'Crab, avocado, cucumber',
  },
  {
    id: '6',
    name: 'Paneer Tikka Pizza',
    price: 329,
    image: 'https://images.unsplash.com/photo-1572815438941-36e4b94f4dda?w=200',
    isVeg: true,
    category: 'Pizzas',
    description: 'Tandoori paneer, bell peppers, onions',
  },
];

export function MenuScreen({ restaurantId, restaurantName, onBack, onViewCart }: MenuScreenProps) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState('Pizzas');

  const categories = Array.from(new Set(mockMenuItems.map((item) => item.category)));

  const handleAddItem = (itemId: string) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    toast.success('Added to cart', {
      duration: 1500,
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const cartItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [itemId, qty]) => {
    const item = mockMenuItems.find((i) => i.id === itemId);
    return sum + (item?.price || 0) * qty;
  }, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-default)] flex flex-col">
      {/* Header with Restaurant Image */}
      <div className="relative h-48 bg-[var(--surface)]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1572815438941-36e4b94f4dda?w=800)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        </div>
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="font-bold text-2xl text-white">{restaurantName}</h1>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-0 z-30 bg-[var(--bg-default)] border-b border-[var(--divider)] px-4 pt-3">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="w-full justify-start overflow-x-auto bg-transparent p-0 h-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="flex-shrink-0 data-[state=active]:text-[var(--primary)] data-[state=active]:border-b-2 data-[state=active]:border-[var(--primary)] rounded-none pb-3"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-4 pt-4 pb-24 space-y-3">
        {mockMenuItems
          .filter((item) => item.category === activeCategory)
          .map((item) => (
            <MenuItem
              key={item.id}
              {...item}
              quantity={cart[item.id] || 0}
              onAdd={() => handleAddItem(item.id)}
              onRemove={() => handleRemoveItem(item.id)}
            />
          ))}
      </div>

      {/* Cart FAB */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-20 left-4 right-4 z-40">
          <Button
            onClick={onViewCart}
            className="w-full h-14 bg-[var(--primary)] hover:bg-[var(--primary)]/90 shadow-e-3 text-white"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            <span className="flex-1">View Cart</span>
            <div className="flex items-center gap-2">
              <span className="font-bold tabular-nums">{cartItemsCount} items</span>
              <span className="w-px h-5 bg-white/30" />
              <span className="font-bold tabular-nums">₹{cartTotal.toFixed(2)}</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
