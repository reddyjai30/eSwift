import { motion } from 'motion/react';
import { Star, MapPin, Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  cuisines: string[];
  distance: string;
  eta: string;
  onClick?: () => void;
}

export function RestaurantCard({ 
  name, 
  image, 
  rating, 
  cuisines, 
  distance, 
  eta,
  onClick 
}: RestaurantCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left bg-[var(--bg-paper)] rounded-[var(--r-12)] overflow-hidden shadow-e-1 hover:shadow-e-3 transition-all duration-[var(--motion-fast)]"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div
          className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        >
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-white font-medium tabular-nums">{rating.toFixed(1)}</span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="font-bold text-[var(--text-primary)] line-clamp-1">{name}</h3>
        
        {/* Cuisine Tags */}
        <div className="flex flex-wrap gap-1.5">
          {cuisines.slice(0, 3).map((cuisine, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
            >
              <Badge 
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors"
              >
                {cuisine}
              </Badge>
            </motion.div>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="tabular-nums">{distance}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="tabular-nums">{eta}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
