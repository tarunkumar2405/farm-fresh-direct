import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockProducts, categories } from '@/data/mockData';
import { Product } from '@/types';
import { formatPrice, calculateItemPrice } from '@/lib/pricing';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShoppingCart, MapPin, TrendingUp, Search, Filter, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Marketplace() {
  const { addToCart, totalItems } = useCart();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [maxPrice, setMaxPrice] = useState([500]);
  const [userDistance] = useState(10); // Simulated user distance

  const activeProducts = mockProducts.filter(p => p.isActive);

  const filteredProducts = useMemo(() => {
    return activeProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesPrice = product.pricePerKg <= maxPrice[0];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [activeProducts, searchQuery, categoryFilter, maxPrice]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground">Discover fresh produce from local farmers</p>
          </div>
          <Link to="/cart">
            <Button variant="outline" className="relative">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
              {totalItems > 0 && (
                <Badge className="ml-2">{totalItems}</Badge>
              )}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Max Price</span>
                  <span className="font-medium">{formatPrice(maxPrice[0])}</span>
                </div>
                <Slider
                  value={maxPrice}
                  onValueChange={setMaxPrice}
                  max={1000}
                  min={10}
                  step={10}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const finalPrice = calculateItemPrice(
                product.pricePerKg,
                1,
                userDistance,
                product.isHighDemand
              );
              
              return (
                <Card key={product.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline">{product.category}</Badge>
                      {product.isHighDemand && (
                        <Badge className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          High Demand
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {product.locationText}
                      </div>
                      <p className="text-muted-foreground">
                        By <span className="font-medium text-foreground">{product.farmerName}</span>
                      </p>
                      <p className="text-muted-foreground">
                        Available: <span className="font-medium">{product.availableQuantity} {product.unit}</span>
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3 border-t pt-4">
                    <div className="flex w-full items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(finalPrice)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          per {product.unit}
                          {(product.isHighDemand || userDistance > 5) && (
                            <span className="text-accent-foreground"> (incl. fees)</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleAddToCart(product)}
                      disabled={product.availableQuantity === 0}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
