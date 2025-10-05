import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from '@phosphor-icons/react';
import { Vehicle } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCredits } from '../lib/utils';
import { toast } from 'sonner';

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails: (vehicle: Vehicle) => void;
  onLoginRequired: () => void;
}

export function VehicleCard({ vehicle, onViewDetails, onLoginRequired }: VehicleCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Imperial clearance required for requisitions. Please log in.');
      onLoginRequired();
      return;
    }
    addToCart(vehicle);
    toast.success(`${vehicle.name} added to requisition cart`);
  };



  const getAvailabilityColor = (availability: Vehicle['availability']) => {
    switch (availability) {
      case 'in-stock':
        return 'bg-green-900 text-green-100';
      case 'limited':
        return 'bg-yellow-900 text-yellow-100';
      case 'out-of-stock':
        return 'bg-red-900 text-red-100';
    }
  };

  const getAvailabilityText = (availability: Vehicle['availability']) => {
    switch (availability) {
      case 'in-stock':
        return 'In Stock';
      case 'limited':
        return 'Limited Supply';
      case 'out-of-stock':
        return 'Out of Stock';
    }
  };

  return (
    <Card className="group hover:imperial-glow transition-all duration-300 bg-card border-border">
      <CardHeader className="pb-3">
        <div className="relative">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-48 object-cover rounded-md bg-muted"
          />
          <Badge 
            className={`absolute top-2 right-2 ${getAvailabilityColor(vehicle.availability)}`}
          >
            {getAvailabilityText(vehicle.availability)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground">{vehicle.name}</h3>
          <p className="text-sm text-muted-foreground">{vehicle.manufacturer}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{vehicle.description}</p>
          
          {/* Stock information */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Units Available:</span>
            <span className={`font-medium ${
              vehicle.unitsInStock === 0 ? 'text-destructive' :
              vehicle.unitsInStock <= 50 ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {vehicle.unitsInStock.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-destructive">
              {formatCredits(vehicle.price)}
            </span>
            <Badge variant="outline" className="text-xs">
              {vehicle.classification}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(vehicle)}
          className="flex-1"
        >
          <Eye className="mr-2 h-4 w-4" />
          Details
        </Button>
        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={vehicle.availability === 'out-of-stock'}
          className="flex-1 imperial-border"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Requisition
        </Button>
      </CardFooter>
    </Card>
  );
}