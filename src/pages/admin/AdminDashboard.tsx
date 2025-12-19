import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockUsers, mockProducts, mockOrders } from '@/data/mockData';
import { formatPrice } from '@/lib/pricing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Package, ShoppingBag, IndianRupee, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const farmers = mockUsers.filter(u => u.role === 'farmer');
  const buyers = mockUsers.filter(u => u.role === 'buyer');
  const activeProducts = mockProducts.filter(p => p.isActive);
  const pendingOrders = mockOrders.filter(o => o.status === 'PENDING');
  const totalRevenue = mockOrders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const stats = [
    {
      title: 'Total Users',
      value: mockUsers.length,
      icon: Users,
      description: `${farmers.length} farmers, ${buyers.length} buyers`,
    },
    {
      title: 'Active Products',
      value: activeProducts.length,
      icon: Package,
      description: 'Listed on marketplace',
    },
    {
      title: 'Total Orders',
      value: mockOrders.length,
      icon: ShoppingBag,
      description: `${pendingOrders.length} pending`,
    },
    {
      title: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: IndianRupee,
      description: 'From completed orders',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage the AgriConnect platform</p>
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

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Newly registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-medium text-primary">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest platform orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="font-medium">Order #{order.id.slice(-6)}</p>
                      <p className="text-sm text-muted-foreground">{order.buyerName}</p>
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

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              High Demand Products
            </CardTitle>
            <CardDescription>Products marked as high demand</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockProducts
                .filter(p => p.isHighDemand)
                .map((product) => (
                  <div
                    key={product.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.farmerName}</p>
                      </div>
                      <Badge>High Demand</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>{formatPrice(product.pricePerKg)}/{product.unit}</p>
                      <p>Stock: {product.availableQuantity} {product.unit}</p>
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
