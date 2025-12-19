import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import heroImage from '@/assets/hero-farm.jpg';
import { 
  Leaf, 
  Tractor, 
  ShoppingBag, 
  TrendingUp, 
  MapPin, 
  Shield, 
  ArrowRight,
  Package,
  Users,
  IndianRupee
} from 'lucide-react';

const features = [
  {
    icon: Tractor,
    title: 'For Farmers',
    description: 'List your organic produce, manage inventory, and connect directly with local buyers.',
  },
  {
    icon: ShoppingBag,
    title: 'For Buyers',
    description: 'Discover fresh, locally-grown produce from farmers near you at fair prices.',
  },
  {
    icon: TrendingUp,
    title: 'Dynamic Pricing',
    description: 'Smart pricing based on distance and demand ensures fair value for everyone.',
  },
  {
    icon: MapPin,
    title: 'Local First',
    description: 'Support local agriculture and reduce carbon footprint with nearby sourcing.',
  },
  {
    icon: Shield,
    title: 'Trusted Platform',
    description: 'Verified farmers, transparent pricing, and secure transactions.',
  },
  {
    icon: Package,
    title: 'Fresh Delivery',
    description: 'From farm to table with real-time order tracking and status updates.',
  },
];

const stats = [
  { value: '500+', label: 'Active Farmers', icon: Users },
  { value: '10K+', label: 'Happy Buyers', icon: ShoppingBag },
  { value: '₹2M+', label: 'Monthly Sales', icon: IndianRupee },
  { value: '50+', label: 'Categories', icon: Package },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4">
              <Leaf className="mr-1 h-3 w-3" />
              Farm Fresh, Always
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Connect with{' '}
              <span className="text-primary">Local Farmers</span>{' '}
              for Fresh Produce
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              AgriConnect Hub bridges the gap between farmers and consumers. 
              Buy directly from local farms, get fresher produce, and support 
              sustainable agriculture.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="mb-4 text-3xl font-bold">Why Choose AgriConnect?</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our platform is designed to make farm-to-table transactions seamless, 
              transparent, and beneficial for both farmers and buyers.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <Leaf className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Join thousands of farmers and buyers who are already benefiting from 
            direct farm-to-consumer connections.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/register">
                <Tractor className="mr-2 h-5 w-5" />
                Register as Farmer
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/register">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Register as Buyer
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-bold">AgriConnect Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 AgriConnect Hub. Connecting farms to families.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
