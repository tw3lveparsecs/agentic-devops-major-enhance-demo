import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from '@phosphor-icons/react';
import { Vehicle } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCredits } from '../lib/utils';
import { toast } from 'sonner';

interface VehicleDetailsProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onLoginRequired: () => void;
}

export function VehicleDetails({ vehicle, isOpen, onClose, onLoginRequired }: VehicleDetailsProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!vehicle) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {vehicle.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image and Basic Info */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-64 object-cover rounded-lg bg-muted"
              />
              <Badge 
                className={`absolute top-4 right-4 ${getAvailabilityColor(vehicle.availability)}`}
              >
                {getAvailabilityText(vehicle.availability)}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-destructive">
                  {formatCredits(vehicle.price)}
                </span>
                <Badge variant="outline">
                  {vehicle.classification}
                </Badge>
              </div>
              
              {/* Stock information */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <span className="text-sm font-medium text-muted-foreground">Units Available:</span>
                <span className={`text-lg font-bold ${
                  vehicle.unitsInStock === 0 ? 'text-destructive' :
                  vehicle.unitsInStock <= 50 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {vehicle.unitsInStock.toLocaleString()}
                </span>
              </div>
              
              <p className="text-muted-foreground">{vehicle.manufacturer}</p>
              <p className="text-foreground">{vehicle.description}</p>
            </div>

            <Button
              className="w-full imperial-border"
              onClick={handleAddToCart}
              disabled={vehicle.availability === 'out-of-stock'}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Requisition Cart
            </Button>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-muted-foreground">Length</h4>
                    <p className="text-foreground">{vehicle.specifications.length}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">Crew</h4>
                    <p className="text-foreground">{vehicle.specifications.crew}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-muted-foreground">Maximum Speed</h4>
                    <p className="text-foreground">{vehicle.specifications.speed}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">Hyperdrive</h4>
                    <p className="text-foreground">{vehicle.specifications.hyperdrive}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-muted-foreground">Shielding</h4>
                  <p className="text-foreground">{vehicle.specifications.shielding}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-muted-foreground mb-2">Armament</h4>
                  <div className="space-y-1">
                    {vehicle.specifications.armament.map((weapon, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-destructive rounded-full mr-2"></span>
                        <span className="text-foreground">{weapon}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}