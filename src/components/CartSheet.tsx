import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Trash, Plus, Minus } from '@phosphor-icons/react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useInventory } from '../contexts/InventoryContext';
import { formatCredits } from '../lib/utils';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartSheet({ isOpen, onClose, onCheckout }: CartSheetProps) {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { vehicles } = useInventory();

  // Get current vehicle data with updated stock
  const getCurrentVehicle = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };



  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Please log in to complete your requisition.');
      return;
    }
    onCheckout();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Requisition Cart</span>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                Clear All
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground">Add some Imperial vehicles to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const currentVehicle = getCurrentVehicle(item.vehicle.id);
                const isAtStockLimit = currentVehicle ? item.quantity >= currentVehicle.unitsInStock : true;
                
                return (
                  <div key={item.vehicle.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                    <img
                      src={item.vehicle.image}
                      alt={item.vehicle.name}
                      className="w-16 h-16 object-cover rounded bg-muted"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{item.vehicle.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.vehicle.manufacturer}</p>
                      <p className="text-sm font-medium text-destructive">
                        {formatCredits(item.vehicle.price)}
                      </p>
                      
                      {/* Stock information */}
                      <p className="text-xs text-muted-foreground">
                        Stock: {currentVehicle?.unitsInStock ?? 0} available
                      </p>

                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.vehicle.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <Badge variant="outline" className="px-3">
                          {item.quantity}
                        </Badge>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.vehicle.id, item.quantity + 1)}
                          disabled={isAtStockLimit}
                          className="h-8 w-8 p-0"
                          title={isAtStockLimit ? 'Maximum stock reached' : 'Increase quantity'}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.vehicle.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive ml-auto"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="flex-col space-y-4">
            <Separator />
            
            <div className="space-y-2">
              {isAuthenticated && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Your Credits:</span>
                  <span className="font-medium">
                    {formatCredits(user?.credits || 0)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-2xl font-bold text-destructive">
                  {formatCredits(total)}
                </span>
              </div>

              {isAuthenticated && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Remaining:</span>
                  <span className={`font-medium ${(user?.credits || 0) - total < 0 ? 'text-destructive' : 'text-green-400'}`}>
                    {formatCredits((user?.credits || 0) - total)}
                  </span>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                * Prices in Imperial Credits. Subject to fleet command approval.
              </p>
            </div>

            <Button
              className="w-full imperial-border"
              onClick={handleCheckout}
              disabled={!isAuthenticated || (user?.credits || 0) < total}
            >
              {!isAuthenticated ? 'Login Required' : 
               (user?.credits || 0) < total ? 'Insufficient Credits' : 
               'Process Requisition'}
            </Button>

            {!isAuthenticated && (
              <p className="text-xs text-center text-muted-foreground">
                Imperial clearance required for vehicle requisition
              </p>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}