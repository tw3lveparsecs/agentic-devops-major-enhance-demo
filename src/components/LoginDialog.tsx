import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Lock } from '@phosphor-icons/react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = login(credentials);
      if (success) {
        toast.success('Imperial clearance verified. Welcome back.');
        onClose();
        setCredentials({ username: '', password: '' });
      } else {
        setError('Invalid credentials. Access denied by Imperial Security.');
      }
    } catch (err) {
      setError('System error. Contact Imperial IT division.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCredentials({ username: '', password: '' });
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-destructive-foreground font-bold">I</span>
            </div>
            <span>Imperial Access Control</span>
          </DialogTitle>
          <DialogDescription>
            Enter your Imperial credentials to access the supply system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Imperial ID</span>
            </Label>
            <Input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter your Imperial ID"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Access Code</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter your access code"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert className="border-destructive/50">
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full imperial-border"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying Clearance...' : 'Access Imperial Systems'}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">Demo Credentials:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Imperial IDs:</strong> tarkin, veers, piett, vader, ozzel</p>
                <p><strong>Access Code:</strong> empire</p>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}