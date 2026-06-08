export const SHOPEE_EXPRESS_CARRIER = {
  code: 'SPX',
  name: 'Shopee Express',
  serviceName: 'SPX Standard',
  eta: '2-4 ngày làm việc',
  codSupported: true,
};

export const getShopeeExpressQuote = ({ subtotal = 0 } = {}) => {
  const freeShippingThreshold = 500000;
  const fee = subtotal >= freeShippingThreshold ? 0 : 30000;

  return {
    ...SHOPEE_EXPRESS_CARRIER,
    fee,
    codFee: 0,
    freeShippingThreshold,
  };
};

export const buildShopeeExpressShipmentPayload = ({
  order,
  items,
  paymentMethod,
  shippingQuote,
}) => ({
  orderCode: order.code,
  carrier: SHOPEE_EXPRESS_CARRIER.code,
  serviceName: SHOPEE_EXPRESS_CARRIER.serviceName,
  codAmount: paymentMethod === 'cod' ? order.total : 0,
  receiver: order.customer,
  items: items.map(({ product, quantity, variantValue }) => ({
    sku: product.slug,
    name: product.name,
    quantity,
    variant: variantValue,
    declaredValue: product.priceValue,
  })),
  shippingFee: shippingQuote.fee,
  note: order.customer.note,
});

export const createShopeeExpressShipment = async (payload) => {
  const endpoint = import.meta.env.VITE_SPX_API_ENDPOINT;

  // Shopee/Open Platform signing should stay on a backend; this frontend only calls an optional backend endpoint.
  if (!endpoint) {
    return {
      mode: 'local',
      status: 'pending_backend',
      trackingNumber: `SPX-${payload.orderCode}`,
      carrier: SHOPEE_EXPRESS_CARRIER.name,
    };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Không thể tạo vận đơn Shopee Express lúc này.');
  }

  return response.json();
};
