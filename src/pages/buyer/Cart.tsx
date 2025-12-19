import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, calculateItemPrice, getDistanceFactor, getDemandFactor } from '@/lib/pricing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { ShoppingCart, Trash2, Plus, Minus, MapPin, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [distance, setDistance] = useState([10]);

  const distanceKm = distance[0];

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      return total + calculateItemPrice(
        item.product.pricePerKg,
        item.quantity,
        distanceKm,
        item.product.isHighDemand
      );
    }, 0);
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add some products before placing an order.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Order placed successfully!',
      description: 'Your order has been sent to the farmers. Track it in "My Orders".',
    });
    
    clearCart();
    navigate('/buyer/orders');
  };

  if (items.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
          <p className="mb-4 text-muted-foreground">Start shopping to add items to your cart</p>
          <Button onClick={() => navigate('/marketplace')}>
            Browse Marketplace
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const subtotal = calculateSubtotal();
  const distanceFactor = getDistanceFactor(distanceKm);
  const hasHighDemandItems = items.some(i => i.product.isHighDemand);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground">{items.length} items in your cart</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemTotal = calculateItemPrice(
                item.product.pricePerKg,
                item.quantity,
                distanceKm,
                item.product.isHighDemand
              );

              return (
                <Card key={item.product.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary/10">
                        <ShoppingCart className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-semibold">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            by {item.product.farmerName} • {item.product.locationText}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              max={item.product.availableQuantity}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                              className="h-8 w-16 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.availableQuantity}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground">{item.product.unit}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-semibold">{formatPrice(itemTotal)}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Distance Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  Delivery Distance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Distance from farms</span>
                    <span className="font-medium">{distanceKm} km</span>
                  </div>
                  <Slider
                    value={distance}
                    onValueChange={setDistance}
                    max={30}
                    min={1}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    {distanceKm <= 5 
                      ? 'No delivery surcharge' 
                      : distanceKm <= 15 
                        ? '+5% delivery fee' 
                        : '+10% delivery fee'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Items ({items.reduce((sum, i) => sum + i.quantity, 0)})</span>
                  <span>{formatPrice(subtotal / (1 + distanceFactor + (hasHighDemandItems ? 0.05 : 0)))}</span>
                </div>
                {distanceFactor > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Delivery Fee ({Math.round(distanceFactor * 100)}%)</span>
                    <span>Included</span>
                  </div>
                )}
                {hasHighDemandItems && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>High Demand Fee (5%)</span>
                    <span>Included</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(subtotal)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handlePlaceOrder}>
                  Place Order
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <p className="text-center text-xs text-muted-foreground">
              Payment is collected on delivery (Cash on Delivery)
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
