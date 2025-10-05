import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useKV } from '@github/spark/hooks';
import { CartItem, Vehicle } from '../types';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addToCart: (vehicle: Vehicle, quantity?: number) => void;
  removeFromCart: (vehicleId: string) => void;
  updateQuantity: (vehicleId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useKV<CartItem[]>('imperial-cart', []);

  // Compute total and item count directly when items change
  const total = useMemo(() => {
    const safeItems = items ?? [];
    return safeItems.reduce((total, item) => total + (item.vehicle.price * item.quantity), 0);
  }, [items]);

  const itemCount = useMemo(() => {
    const safeItems = items ?? [];
    return safeItems.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const addToCart = (vehicle: Vehicle, quantity = 1) => {
    // Check if there's enough stock
    if (vehicle.unitsInStock === 0) {
      toast.error(`${vehicle.name} is out of stock`);
      return;
    }

    setItems((currentItems) => {
      const safeItems = currentItems ?? [];
      const existingItem = safeItems.find(item => item.vehicle.id === vehicle.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        // Check if the new quantity would exceed available stock
        if (newQuantity > vehicle.unitsInStock) {
          toast.error(`Only ${vehicle.unitsInStock} units of ${vehicle.name} available. Cart has ${existingItem.quantity}.`);
          return safeItems;
        }
        
        toast.success(`Increased ${vehicle.name} quantity to ${newQuantity}`);
        return safeItems.map(item =>
          item.vehicle.id === vehicle.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Check if requested quantity exceeds stock
        if (quantity > vehicle.unitsInStock) {
          toast.error(`Only ${vehicle.unitsInStock} units of ${vehicle.name} available`);
          return safeItems;
        }
        
        toast.success(`${vehicle.name} added to requisition cart`);
        return [...safeItems, { vehicle, quantity }];
      }
    });
  };

  const removeFromCart = (vehicleId: string) => {
    setItems((currentItems) => {
      const safeItems = currentItems ?? [];
      const item = safeItems.find(item => item.vehicle.id === vehicleId);
      if (item) {
        toast.success(`${item.vehicle.name} removed from cart`);
      }
      return safeItems.filter(item => item.vehicle.id !== vehicleId);
    });
  };

  const updateQuantity = (vehicleId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(vehicleId);
      return;
    }

    setItems((currentItems) => {
      const safeItems = currentItems ?? [];
      const existingItem = safeItems.find(item => item.vehicle.id === vehicleId);
      
      if (existingItem) {
        // Check if requested quantity exceeds available stock
        if (quantity > existingItem.vehicle.unitsInStock) {
          toast.error(`Only ${existingItem.vehicle.unitsInStock} units of ${existingItem.vehicle.name} available`);
          return safeItems;
        }
      }
      
      return safeItems.map(item =>
        item.vehicle.id === vehicleId
          ? { ...item, quantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  const getTotal = () => total;
  const getItemCount = () => itemCount;

  return (
    <CartContext.Provider value={{
      items: items || [],
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}