import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { mockProducts, mockOrders } from '@/data/mockData';
import { formatPrice } from '@/lib/pricing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingBag, TrendingUp, IndianRupee } from 'lucide-react';

export default function FarmerDashboard() {
  const { user } = useAuth();
  
  // Filter data for current farmer
  const myProducts = mockProducts.filter(p => p.farmerId === user?.id || p.farmerId === 'farmer-1');
  const myOrders = mockOrders.filter(order => 
    order.items.some(item => item.farmerId === user?.id || item.farmerId === 'farmer-1')
  );

  const totalRevenue = myOrders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const pendingOrders = myOrders.filter(o => o.status === 'PENDING').length;

  const stats = [
    {
      title: 'Total Products',
      value: myProducts.length,
      icon: Package,
      description: 'Active listings',
    },
    {
      title: 'Total Orders',
      value: myOrders.length,
      icon: ShoppingBag,
      description: 'All time',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: TrendingUp,
      description: 'Awaiting action',
    },
    {
      title: 'Revenue',
      value: formatPrice(totalRevenue),
      icon: IndianRupee,
      description: 'From completed orders',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Here's an overview of your farm business</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest incoming orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium">{order.buyerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.map(i => i.productName).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                    <Badge
                      variant={
                        order.status === 'COMPLETED' ? 'default' :
                        order.status === 'PENDING' ? 'secondary' :
                        order.status === 'ACCEPTED' ? 'outline' : 'destructive'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
