import { Star, MapPin, Clock, Plus, Minus, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { RestaurantCard } from './RestaurantCard';
import { OrderCard } from './OrderCard';
import { MenuItem } from './MenuItem';
import { ReceiptTable } from './ReceiptTable';
import { EmptyState } from './EmptyState';
import { useState } from 'react';

export function ComponentShowcase() {
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="min-h-screen bg-[var(--bg-default)] p-6 space-y-12">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          eSwift Component Library
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Complete design system with dark/light theme support
        </p>

        {/* Colors */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Brand Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-[var(--primary)]" />
              <p className="text-sm font-medium text-[var(--text-primary)]">Primary</p>
              <p className="text-xs text-[var(--text-secondary)]">#6C5CE7</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-[var(--accent)]" />
              <p className="text-sm font-medium text-[var(--text-primary)]">Accent</p>
              <p className="text-xs text-[var(--text-secondary)]">#00E5FF</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-[var(--success)]" />
              <p className="text-sm font-medium text-[var(--text-primary)]">Success</p>
              <p className="text-xs text-[var(--text-secondary)]">#22C55E</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-[var(--error)]" />
              <p className="text-sm font-medium text-[var(--text-primary)]">Error</p>
              <p className="text-xs text-[var(--text-secondary)]">#EF4444</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Typography</h2>
          <div className="space-y-3 bg-[var(--bg-paper)] rounded-lg p-6">
            <h1>Heading 1 - Bold 700</h1>
            <h2>Heading 2 - Bold 700</h2>
            <h3>Heading 3 - Bold 700</h3>
            <p>Body Text - Regular 400</p>
            <p className="text-sm text-[var(--text-secondary)]">Secondary Text - Regular 400</p>
            <p className="tabular-nums font-bold">Tabular Numbers: ₹1,234.56</p>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-[var(--primary)]">Primary Button</Button>
            <Button variant="outline">Secondary Button</Button>
            <Button variant="ghost">Tertiary Button</Button>
            <Button disabled>Disabled Button</Button>
            <Button size="icon" className="bg-[var(--primary)]">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Inputs & Controls</h2>
          <div className="grid gap-4 max-w-md">
            <Input placeholder="Search restaurants..." />
            <div className="flex items-center gap-3">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm">Pay via Wallet</label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Dark Mode</span>
              <Switch />
            </div>
          </div>
        </section>

        {/* Chips/Badges */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Chips & Status Badges</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default" className="bg-[var(--primary)]">Filter Active</Badge>
            <Badge variant="outline">Filter Inactive</Badge>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              Paid
            </Badge>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              Delivered
            </Badge>
            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
              Refunded
            </Badge>
            <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
              Expired
            </Badge>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Cards</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-[var(--text-primary)] mb-3">Restaurant Card</h3>
              <div className="max-w-sm">
                <RestaurantCard
                  id="1"
                  name="Spice Garden"
                  image="https://images.unsplash.com/photo-1728910758653-7e990e489cac?w=400"
                  rating={4.5}
                  cuisines={['Indian', 'Biryani', 'Tandoor']}
                  distance="2.3 km"
                  eta="25-30 min"
                />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[var(--text-primary)] mb-3">Order Card</h3>
              <div className="max-w-sm">
                <OrderCard
                  id="1"
                  status="paid"
                  total={947}
                  timestamp="Today, 2:30 PM"
                  items={[
                    { name: 'Pizza', image: 'https://images.unsplash.com/photo-1572815438941-36e4b94f4dda?w=200' },
                    { name: 'Biryani' },
                  ]}
                />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[var(--text-primary)] mb-3">Menu Item</h3>
              <div className="max-w-md">
                <MenuItem
                  id="1"
                  name="Margherita Pizza"
                  price={299}
                  image="https://images.unsplash.com/photo-1572815438941-36e4b94f4dda?w=200"
                  isVeg={true}
                  quantity={quantity}
                  onAdd={() => setQuantity(q => q + 1)}
                  onRemove={() => setQuantity(q => Math.max(0, q - 1))}
                  description="Fresh tomatoes, mozzarella, basil"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Receipt Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Receipt Table</h2>
          <div className="max-w-md">
            <ReceiptTable
              items={[
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
                  quantity: 1,
                  price: 349,
                },
              ]}
              subtotal={947}
              gstPercent={5}
              gstAmount={47.35}
              total={994.35}
            />
          </div>
        </section>

        {/* Empty State */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Empty States</h2>
          <div className="bg-[var(--bg-paper)] rounded-lg">
            <EmptyState
              icon={Package}
              title="No orders yet"
              description="Your order history will appear here once you place your first order"
              actionLabel="Browse Restaurants"
              onAction={() => {}}
            />
          </div>
        </section>

        {/* Elevation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Elevation (Shadows)</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[var(--bg-paper)] rounded-lg p-6 shadow-e-1">
              <p className="text-sm text-center text-[var(--text-secondary)]">Level 1</p>
            </div>
            <div className="bg-[var(--bg-paper)] rounded-lg p-6 shadow-e-2">
              <p className="text-sm text-center text-[var(--text-secondary)]">Level 2</p>
            </div>
            <div className="bg-[var(--bg-paper)] rounded-lg p-6 shadow-e-3">
              <p className="text-sm text-center text-[var(--text-secondary)]">Level 3</p>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Spacing (8pt Grid)</h2>
          <div className="space-y-2 bg-[var(--bg-paper)] rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-1 bg-[var(--primary)]" style={{ height: 'var(--s-8)' }} />
              <span className="text-sm text-[var(--text-secondary)]">8px</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 bg-[var(--primary)]" style={{ height: 'var(--s-16)' }} />
              <span className="text-sm text-[var(--text-secondary)]">16px</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 bg-[var(--primary)]" style={{ height: 'var(--s-24)' }} />
              <span className="text-sm text-[var(--text-secondary)]">24px</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 bg-[var(--primary)]" style={{ height: 'var(--s-32)' }} />
              <span className="text-sm text-[var(--text-secondary)]">32px</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
