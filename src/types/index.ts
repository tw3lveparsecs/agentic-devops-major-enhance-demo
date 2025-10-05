export interface Vehicle {
  id: string;
  name: string;
  category: 'starfighter' | 'transport' | 'capital-ship' | 'support';
  manufacturer: string;
  price: number;
  image: string;
  specifications: {
    length: string;
    crew: string;
    speed: string;
    armament: string[];
    shielding: string;
    hyperdrive: string;
  };
  availability: 'in-stock' | 'limited' | 'out-of-stock';
  description: string;
  classification: string;
  unitsInStock: number;
}

export interface CartItem {
  vehicle: Vehicle;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  rank: string;
  clearanceLevel: number;
  department: string;
  credits: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  orderDate: string;
  estimatedDelivery: string;
}