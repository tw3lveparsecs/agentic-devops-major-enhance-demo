import React, { createContext, useContext, ReactNode } from 'react';
import { useKV } from '@github/spark/hooks';
import { vehicles as initialVehicles } from '../data/vehicles';
import { Vehicle } from '../types';

interface InventoryContextType {
  vehicles: Vehicle[];
  updateStock: (vehicleId: string, quantityToDeduct: number) => void;
  resetInventory: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

interface InventoryProviderProps {
  children: ReactNode;
}

type StockRecord = Record<string, number>;

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  // Store vehicle inventory in persistent storage
  const [vehicleStock, setVehicleStock] = useKV<StockRecord>('vehicle-inventory', 
    // Initialize with default stock amounts
    Object.fromEntries(initialVehicles.map(v => [v.id, v.unitsInStock]))
  );

  // Create vehicles with current stock levels
  const vehicles: Vehicle[] = initialVehicles.map(vehicle => ({
    ...vehicle,
    unitsInStock: vehicleStock?.[vehicle.id] ?? vehicle.unitsInStock,
    // Update availability based on current stock
    availability: (vehicleStock?.[vehicle.id] ?? vehicle.unitsInStock) === 0 ? 'out-of-stock' as const :
                 (vehicleStock?.[vehicle.id] ?? vehicle.unitsInStock) <= 50 ? 'limited' as const : 'in-stock' as const
  }));

  const updateStock = (vehicleId: string, quantityToDeduct: number) => {
    setVehicleStock((currentStock) => {
      const stock = currentStock ?? {};
      const currentAmount = stock[vehicleId] ?? initialVehicles.find(v => v.id === vehicleId)?.unitsInStock ?? 0;
      const newAmount = Math.max(0, currentAmount - quantityToDeduct);
      
      return {
        ...stock,
        [vehicleId]: newAmount
      };
    });
  };

  const resetInventory = () => {
    setVehicleStock(Object.fromEntries(initialVehicles.map(v => [v.id, v.unitsInStock])));
  };

  return (
    <InventoryContext.Provider value={{ vehicles, updateStock, resetInventory }}>
      {children}
    </InventoryContext.Provider>
  );
};