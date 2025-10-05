import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  User,
  SignOut,
  ArrowClockwise,
  Coins,
} from "@phosphor-icons/react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useInventory } from "../contexts/InventoryContext";
import { formatCredits } from "../lib/utils";
import { toast } from "sonner";

interface HeaderProps {
  onCartClick: () => void;
  onLoginClick: () => void;
}

export function Header({ onCartClick, onLoginClick }: HeaderProps) {
  const { itemCount } = useCart();
  const { user, logout, isAuthenticated, resetAllUserCredits } = useAuth();
  const { resetInventory } = useInventory();

  const handleResetAll = async () => {
    try {
      // Check if user has sufficient clearance level (9 or higher)
      if (user && user.clearanceLevel >= 9) {
        resetInventory();
        resetAllUserCredits();
        toast.success(
          "Imperial inventory and user credits restored to original levels"
        );
      } else {
        toast.error(
          "Insufficient clearance level for system operations (Level 9+ required)"
        );
      }
    } catch (error) {
      toast.error("Unable to verify clearance level");
    }
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-destructive-foreground font-bold text-lg">
                I
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Imperial Supply Hub
              </h1>
              <p className="text-sm text-muted-foreground">
                Starships & Vehicles Division
              </p>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name}
                  </p>
                  <div className="flex items-center justify-end space-x-2">
                    <p className="text-xs text-muted-foreground">
                      {user?.rank} - {user?.department}
                    </p>
                  </div>
                </div>

                {/* Credits Display */}
                <div className="flex items-center space-x-1 bg-muted px-3 py-1 rounded-md">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">
                    {formatCredits(user?.credits || 0)}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="hidden sm:flex"
                >
                  <SignOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={onLoginClick}>
                <User className="mr-2 h-4 w-4" />
                Imperial Login
              </Button>
            )}

            {/* Admin: Reset System Button (only for clearance level 9+) */}
            {isAuthenticated && user && user.clearanceLevel >= 9 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetAll}
                className="text-muted-foreground hover:text-foreground"
                title="Reset Imperial System (Clearance Level 9+ Required)"
              >
                <ArrowClockwise className="h-4 w-4" />
              </Button>
            )}

            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onCartClick}
              className="relative imperial-border"
            >
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
