import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from '@phosphor-icons/react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useInventory } from '../contexts/InventoryContext';
import { formatCredits } from '../lib/utils';
import { toast } from 'sonner';

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutDialog({ isOpen, onClose }: CheckoutDialogProps) {
  const [orderData, setOrderData] = useState({
    department: '',
    missionCode: '',
    priority: 'standard',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const { items, clearCart, total } = useCart();
  const { user, isAuthenticated, deductCredits } = useAuth();
  const { updateStock } = useInventory();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Check if user has enough credits
    if (!user || user.credits < total) {
      setIsProcessing(false);
      toast.error(`Insufficient credits. You have ${formatCredits(user?.credits || 0)} but need ${formatCredits(total)}.`);
      return;
    }

    // Check stock availability for all items
    const stockShortage = items.find(item => item.vehicle.unitsInStock < item.quantity);
    if (stockShortage) {
      setIsProcessing(false);
      toast.error(`Insufficient stock for ${stockShortage.vehicle.name}. Only ${stockShortage.vehicle.unitsInStock} units available.`);
      return;
    }

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Deduct credits from user account
    const creditsDeducted = deductCredits(total);
    if (!creditsDeducted) {
      setIsProcessing(false);
      toast.error('Credit deduction failed. Please try again.');
      return;
    }

    // Deduct inventory for each item
    items.forEach(item => {
      updateStock(item.vehicle.id, item.quantity);
    });

    const newOrderId = `IMP-${Date.now().toString().slice(-6)}`;
    setOrderId(newOrderId);
    setOrderComplete(true);
    
    toast.success(`Requisition ${newOrderId} approved - ${formatCredits(total)} deducted`);
    
    setIsProcessing(false);
  };

  const handleClose = () => {
    if (orderComplete) {
      clearCart();
      setOrderComplete(false);
      setOrderData({ department: '', missionCode: '', priority: 'standard', notes: '' });
    }
    onClose();
  };

  if (orderComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-100" />
              </div>
              <span>Requisition Approved</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-muted-foreground">
              Your vehicle requisition has been approved.
            </p>

            <div className="bg-muted p-4 rounded-lg">
              <p className="font-mono text-lg font-bold text-destructive">
                Order #{orderId}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Processing time: 3-5 standard days
              </p>
              <p className="text-xs text-green-400 mt-2">
                ✓ {formatCredits(total)} deducted
              </p>
              <p className="text-xs text-green-400">
                ✓ Inventory updated
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              You will receive deployment coordinates once your requisition is processed.
            </p>

            <Button onClick={handleClose} className="w-full">
              Return to Supply Hub
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Imperial Vehicle Requisition</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Officer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Requisitioning Officer</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={user?.name || ''} disabled />
              </div>
              <div>
                <Label>Rank</Label>
                <Input value={user?.rank || ''} disabled />
              </div>
            </div>
            <div>
              <Label>Department</Label>
              <Input value={user?.department || ''} disabled />
            </div>
          </div>

          <Separator />

          {/* Mission Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mission Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Deployment Department</Label>
                <Input
                  id="department"
                  value={orderData.department}
                  onChange={(e) => setOrderData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="e.g., Death Star Operations"
                  required
                />
              </div>
              <div>
                <Label htmlFor="missionCode">Mission Code</Label>
                <Input
                  id="missionCode"
                  value={orderData.missionCode}
                  onChange={(e) => setOrderData(prev => ({ ...prev, missionCode: e.target.value }))}
                  placeholder="e.g., FALCON-PURSUIT"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Mission Notes</Label>
              <Textarea
                id="notes"
                value={orderData.notes}
                onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional deployment requirements or specifications"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Requisition Summary</h3>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.vehicle.id} className="flex items-center justify-between p-3 border border-border rounded">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.vehicle.image}
                      alt={item.vehicle.name}
                      className="w-12 h-12 object-cover rounded bg-muted"
                    />
                    <div>
                      <p className="font-medium">{item.vehicle.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCredits(item.vehicle.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {formatCredits(item.vehicle.price * item.quantity)}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Your Credits:</span>
                <span className="text-sm font-medium">
                  {formatCredits(user?.credits || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Requisition Cost:</span>
                <span className="text-destructive">{formatCredits(total)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Remaining After Purchase:</span>
                <span className={`font-medium ${(user?.credits || 0) - total < 0 ? 'text-destructive' : 'text-green-400'}`}>
                  {formatCredits((user?.credits || 0) - total)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 imperial-border"
              disabled={isProcessing || (user?.credits || 0) < total}
            >
              {isProcessing ? 'Processing Requisition...' : 
               (user?.credits || 0) < total ? 'Insufficient Credits' : 
               'Submit Requisition'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}