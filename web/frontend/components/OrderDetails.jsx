import { Layout, LegacyCard, Text, Badge, Stack } from '@shopify/polaris';

export function OrderDetails({ orders }) {
    console.log(' detaisl page: ', orders);
  const orderList = Array.isArray(orders) ? orders : [];

  return (
    <Layout>
      <Layout.Section>
        <LegacyCard title="Order Details" sectioned>
          {orderList.length === 0 ? (
            <Text>No orders available.</Text>
          ) : (
            <div className="order-list">
              {orders.map((order) => (
                <div className="order-card" key={order.id}>
                  <Stack vertical spacing="extraTight">
                    <Text variant="headingMd">{order.name}</Text>
                    <Text>Customer: {order.email}</Text>
                    <Text>Total Price: ₹{order.total_price}</Text>
                    <Text>Created At: {new Date(order.created_at).toLocaleString()}</Text>
                    <Badge status={order.fulfillment_status === 'fulfilled' ? 'success' : 'info'}>
                      {order.fulfillment_status || 'Unfulfilled'}
                    </Badge>
                  </Stack>
                </div>
              ))}
            </div>
          )}
        </LegacyCard>
      </Layout.Section>
    </Layout>
  );
}
