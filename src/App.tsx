import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { InventoryProvider, useInventory } from './contexts/InventoryContext';
import { Header } from './components/Header';
import { VehicleFilters } from './components/VehicleFilters';
import { VehicleCard } from './components/VehicleCard';
import { VehicleDetails } from './components/VehicleDetails';
import { CartSheet } from './components/CartSheet';
import { LoginDialog } from './components/LoginDialog';
import { CheckoutDialog } from './components/CheckoutDialog';
import { Vehicle } from './types';
import { toast } from 'sonner';

function AppContent() {
  const [filters, setFilters] = useState({
    category: 'all',
    manufacturer: 'All Manufacturers',
    priceRange: 'all',
    search: ''
  });
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { vehicles } = useInventory();

  // Parse price range from string filter
  const parsePriceRange = (priceRange: string): [number, number] => {
    if (priceRange === 'all') return [0, Infinity];
    const [min, max] = priceRange.split('-').map(Number);
    return [min || 0, max || Infinity];
  };

  // Filter vehicles based on selected criteria
  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesCategory = filters.category === 'all' || vehicle.category === filters.category;
    const matchesManufacturer = filters.manufacturer === 'All Manufacturers' || vehicle.manufacturer === filters.manufacturer;
    
    const [minPrice, maxPrice] = parsePriceRange(filters.priceRange);
    const matchesPrice = vehicle.price >= minPrice && vehicle.price <= maxPrice;
    
    const matchesSearch = filters.search === '' || 
      vehicle.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      vehicle.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesManufacturer && matchesPrice && matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
      />
      
      <main className="container mx-auto px-4 py-8">

        {/* Filters at the top */}
        <div className="mb-8">
          <VehicleFilters
            filters={filters}
            onFiltersChange={setFilters}
            resultsCount={filteredVehicles.length}
          />
        </div>

        {/* Vehicle Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Imperial Arsenal ({filteredVehicles.length} vehicles)
            </h2>
          </div>
          
          {vehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                Loading Imperial vehicles...
              </p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                No vehicles match your search criteria.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVehicles.map(vehicle => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onViewDetails={(vehicle) => setSelectedVehicle(vehicle)}
                  onLoginRequired={() => setIsLoginOpen(true)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals and Dialogs */}
      <VehicleDetails
        vehicle={selectedVehicle}
        isOpen={selectedVehicle !== null}
        onClose={() => setSelectedVehicle(null)}
        onLoginRequired={() => setIsLoginOpen(true)}
      />

      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          // Check if user is authenticated before allowing checkout
          if (!isAuthenticated) {
            toast.error('Imperial clearance required for requisitions. Please log in.');
            setIsLoginOpen(true);
          } else {
            setIsCheckoutOpen(true);
          }
        }}
      />

      <LoginDialog
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;