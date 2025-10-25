import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { RestaurantCard } from '../RestaurantCard';
import { Skeleton } from '../ui/skeleton';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  cuisines: string[];
  distance: string;
  eta: string;
}

interface RestaurantsScreenProps {
  onRestaurantClick: (id: string) => void;
}

const cuisineFilters = ['Veg', 'Non-Veg', 'Fast Food', 'Premium', 'Rating 4+'];

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Spice Garden',
    image: 'https://images.unsplash.com/photo-1728910758653-7e990e489cac?w=400',
    rating: 4.5,
    cuisines: ['Indian', 'Biryani', 'Tandoor'],
    distance: '2.3 km',
    eta: '25-30 min',
  },
  {
    id: '2',
    name: 'Pizza Italiano',
    image: 'https://images.unsplash.com/photo-1572815438941-36e4b94f4dda?w=400',
    rating: 4.7,
    cuisines: ['Italian', 'Pizza', 'Pasta'],
    distance: '1.8 km',
    eta: '20-25 min',
  },
  {
    id: '3',
    name: 'Burger Junction',
    image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?w=400',
    rating: 4.3,
    cuisines: ['Fast Food', 'Burgers', 'Fries'],
    distance: '3.1 km',
    eta: '30-35 min',
  },
  {
    id: '4',
    name: 'Sushi House',
    image: 'https://images.unsplash.com/photo-1700324822763-956100f79b0d?w=400',
    rating: 4.8,
    cuisines: ['Japanese', 'Sushi', 'Ramen'],
    distance: '4.2 km',
    eta: '35-40 min',
  },
];

export function RestaurantsScreen({ onRestaurantClick }: RestaurantsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const filteredRestaurants = mockRestaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisines.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
        <Input
          type="text"
          placeholder="Search restaurants or cuisines"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 bg-[var(--bg-paper)] border-[var(--divider)] shadow-e-1"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-paper)] border border-[var(--divider)] text-sm font-medium text-[var(--text-primary)] flex-shrink-0 hover:bg-[var(--surface)] transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
        {cuisineFilters.map((filter) => {
          const isSelected = selectedFilters.includes(filter);
          return (
            <Badge
              key={filter}
              variant={isSelected ? 'default' : 'outline'}
              className={`px-3 py-2 cursor-pointer flex-shrink-0 transition-all duration-[var(--motion-fast)] ${
                isSelected
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--bg-paper)] text-[var(--text-secondary)] border-[var(--divider)] hover:bg-[var(--surface)]'
              }`}
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </Badge>
          );
        })}
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full aspect-[16/9] rounded-[var(--r-12)]" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </>
        ) : (
          <>
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                {...restaurant}
                onClick={() => onRestaurantClick(restaurant.id)}
              />
            ))}
          </>
        )}
      </div>

      {!isLoading && filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)]">No restaurants found</p>
        </div>
      )}
    </div>
  );
}
