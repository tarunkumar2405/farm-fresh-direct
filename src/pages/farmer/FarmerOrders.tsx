import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { mockOrders } from '@/data/mockData';
import { Order, OrderStatus } from '@/types';
import { formatPrice } from '@/lib/pricing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function FarmerOrders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(
    mockOrders.filter(order =>
      order.items.some(item => item.farmerId === user?.id || item.farmerId === 'farmer-1')
    )
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === statusFilter);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast({ title: `Order ${newStatus.toLowerCase()}` });
  };

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'COMPLETED': return 'default';
      case 'PENDING': return 'secondary';
      case 'ACCEPTED': return 'outline';
      case 'REJECTED': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">Manage incoming orders for your products</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ACCEPTED">Accepted</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">No orders found</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(-6)}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy • hh:mm a')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                      {order.isPaid && (
                        <Badge variant="outline" className="border-primary text-primary">
                          Paid
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm font-medium">Customer: {order.buyerName}</p>
                    <p className="text-sm text-muted-foreground">Distance: {order.distanceKm} km</p>
                  </div>

                  <div className="mb-4 rounded-lg bg-muted/50 p-3">
                    <p className="mb-2 text-sm font-medium">Items:</p>
                    {order.items
                      .filter(item => item.farmerId === user?.id || item.farmerId === 'farmer-1')
                      .map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.productName} × {item.quantity}</span>
                          <span>{formatPrice(item.pricePerKg * item.quantity)}</span>
                        </div>
                      ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">
                      Total: {formatPrice(order.totalAmount)}
                    </p>
                    {order.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'ACCEPTED')}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={() => updateOrderStatus(order.id, 'REJECTED')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    {order.status === 'ACCEPTED' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                      >
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
