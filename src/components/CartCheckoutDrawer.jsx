import { useMemo, useState } from 'react';
import {
  buildShopeeExpressShipmentPayload,
  createShopeeExpressShipment,
  getShopeeExpressQuote,
} from '../services/shopeeExpress';

const emptyCustomer = {
  name: '',
  phone: '',
  address: '',
  ward: '',
  province: '',
  note: '',
};

const paymentLabels = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  bank_transfer: 'Chuyển khoản ngân hàng',
};

const requiredCustomerFields = {
  name: 'họ tên',
  phone: 'số điện thoại',
  address: 'địa chỉ nhận hàng',
  province: 'tỉnh/thành phố',
};

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

const buildOrderCode = () => `3F${Date.now().toString().slice(-7)}`;

const CheckoutInput = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-bold text-secondary">{label}</span>
    {children}
  </label>
);

export default function CartCheckoutDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) {
  const [customer, setCustomer] = useState(emptyCustomer);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.product.priceValue * item.quantity, 0),
    [items],
  );
  const shippingQuote = useMemo(() => getShopeeExpressQuote({ subtotal }), [subtotal]);
  const total = subtotal + shippingQuote.fee + (paymentMethod === 'cod' ? shippingQuote.codFee : 0);

  const updateCustomer = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  const handleClose = () => {
    setFormError('');
    setOrderResult(null);
    onClose();
  };

  const handleClearCart = () => {
    setOrderResult(null);
    onClearCart();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (items.length === 0) {
      setFormError('Giỏ hàng đang trống.');
      return;
    }

    const normalizedCustomer = Object.fromEntries(
      Object.entries(customer).map(([key, value]) => [key, value.trim()]),
    );
    const missingField = Object.entries(requiredCustomerFields).find(
      ([field]) => !normalizedCustomer[field],
    );

    if (missingField) {
      setFormError(`Vui lòng nhập ${missingField[1]}.`);
      return;
    }

    if (!/^[0-9+\s().-]{8,16}$/.test(normalizedCustomer.phone)) {
      setFormError('Số điện thoại chưa đúng định dạng.');
      return;
    }

    const order = {
      code: buildOrderCode(),
      customer: normalizedCustomer,
      paymentMethod,
      paymentLabel: paymentLabels[paymentMethod],
      subtotal,
      shippingFee: shippingQuote.fee,
      codFee: paymentMethod === 'cod' ? shippingQuote.codFee : 0,
      total,
      shippingQuote,
      createdAt: new Date().toISOString(),
    };

    setIsSubmitting(true);

    try {
      const payload = buildShopeeExpressShipmentPayload({
        order,
        items,
        paymentMethod,
        shippingQuote,
      });
      const shipment = await createShopeeExpressShipment(payload);
      setOrderResult({ ...order, shipment });
      onClearCart();
      setCustomer(emptyCustomer);
      setPaymentMethod('cod');
    } catch (error) {
      setFormError(error.message || 'Không thể tạo đơn hàng lúc này.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Đóng giỏ hàng"
        className="absolute inset-0 bg-black/45"
        onClick={handleClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[1120px] flex-col overflow-y-auto bg-[#FFF9F4] shadow-[-24px_0_70px_rgba(31,41,55,0.28)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/8 bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">3F Store</p>
            <h2 className="font-display text-2xl font-extrabold text-secondary">
              Giỏ hàng & thanh toán
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-secondary transition-colors hover:border-primary hover:text-primary"
            aria-label="Đóng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {orderResult ? (
          <div className="mx-auto flex w-full max-w-2xl flex-1 items-center px-5 py-10 sm:px-8">
            <section className="w-full rounded-[28px] bg-white p-6 shadow-[0_20px_50px_rgba(31,41,55,0.08)] sm:p-8">
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                Đã ghi nhận
              </span>
              <h3 className="mt-4 font-display text-3xl font-extrabold text-secondary">
                Đặt hàng thành công
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                Mã đơn {orderResult.code} đã được tạo với vận chuyển Shopee Express và phương thức {orderResult.paymentLabel}.
              </p>
              <div className="mt-6 space-y-3 rounded-2xl bg-[#FFF7EF] p-5 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Mã vận đơn</span>
                  <span className="font-bold text-secondary">{orderResult.shipment.trackingNumber}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Tổng thanh toán</span>
                  <span className="font-bold text-primary">{formatCurrency(orderResult.total)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Trạng thái SPX</span>
                  <span className="font-bold text-secondary">
                    {orderResult.shipment.mode === 'local' ? 'Chờ đồng bộ API' : 'Đã gửi API'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white transition-colors hover:bg-primary/90"
              >
                Hoàn tất
              </button>
            </section>
          </div>
        ) : (
          <div className="grid flex-1 grid-cols-1 gap-6 px-5 py-6 lg:grid-cols-[1fr_420px] lg:px-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-secondary">Sản phẩm đã chọn</h3>
                  <p className="mt-1 text-sm text-muted">{itemCount} sản phẩm trong giỏ</p>
                </div>
                {items.length > 0 ? (
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-secondary transition-colors hover:border-primary hover:text-primary"
                  >
                    Xóa giỏ
                  </button>
                ) : null}
              </div>

              {items.length === 0 ? (
                <div className="rounded-[26px] bg-white p-8 text-center shadow-[0_18px_44px_rgba(31,41,55,0.06)]">
                  <h4 className="font-display text-2xl font-extrabold text-secondary">Giỏ hàng đang trống</h4>
                  <p className="mt-3 text-sm text-muted">Chọn sản phẩm để bắt đầu đặt hàng.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(({ key, product, quantity, variantValue }) => (
                    <article
                      key={key}
                      className="grid grid-cols-[96px_1fr] gap-4 rounded-[24px] bg-white p-4 shadow-[0_18px_44px_rgba(31,41,55,0.06)] sm:grid-cols-[116px_1fr_auto]"
                    >
                      <img
                        src={product.img}
                        alt={product.name}
                        className="h-24 w-24 rounded-2xl object-cover sm:h-28 sm:w-28"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-primary">{product.category}</p>
                        <h4 className="mt-1 line-clamp-2 font-display text-lg font-extrabold text-secondary">
                          {product.name}
                        </h4>
                        {variantValue ? (
                          <p className="mt-1 text-sm text-muted">Phân loại: {variantValue}</p>
                        ) : null}
                        <p className="mt-2 font-display text-xl font-extrabold text-primary">{product.price}</p>
                      </div>

                      <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
                        <div className="flex items-center rounded-full border border-gray-200 bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(key, quantity - 1)}
                            disabled={quantity <= 1}
                            className="flex h-9 w-9 items-center justify-center text-lg font-bold text-secondary disabled:cursor-not-allowed disabled:opacity-35"
                            aria-label="Giảm số lượng"
                          >
                            -
                          </button>
                          <span className="min-w-9 text-center text-sm font-extrabold text-secondary">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(key, quantity + 1)}
                            disabled={quantity >= product.stock}
                            className="flex h-9 w-9 items-center justify-center text-lg font-bold text-secondary disabled:cursor-not-allowed disabled:opacity-35"
                            aria-label="Tăng số lượng"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(key)}
                          className="text-sm font-bold text-muted transition-colors hover:text-primary"
                        >
                          Xóa
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <form onSubmit={handleSubmit} className="rounded-[28px] bg-white p-5 shadow-[0_20px_50px_rgba(31,41,55,0.08)] sm:p-6">
              <h3 className="font-display text-2xl font-extrabold text-secondary">Thông tin nhận hàng</h3>

              <div className="mt-5 space-y-4">
                <CheckoutInput label="Họ tên">
                  <input
                    value={customer.name}
                    onChange={(event) => updateCustomer('name', event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    placeholder="Nguyễn Văn A"
                  />
                </CheckoutInput>

                <CheckoutInput label="Số điện thoại">
                  <input
                    value={customer.phone}
                    onChange={(event) => updateCustomer('phone', event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    placeholder="0900000000"
                  />
                </CheckoutInput>

                <CheckoutInput label="Địa chỉ nhận hàng">
                  <input
                    value={customer.address}
                    onChange={(event) => updateCustomer('address', event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    placeholder="Số nhà, đường"
                  />
                </CheckoutInput>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <CheckoutInput label="Phường/xã">
                    <input
                      value={customer.ward}
                      onChange={(event) => updateCustomer('ward', event.target.value)}
                      className="w-full rounded-2xl border border-gray-200 bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                      placeholder="Phường/xã"
                    />
                  </CheckoutInput>
                  <CheckoutInput label="Tỉnh/thành phố">
                    <input
                      value={customer.province}
                      onChange={(event) => updateCustomer('province', event.target.value)}
                      className="w-full rounded-2xl border border-gray-200 bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                      placeholder="TP. Hồ Chí Minh"
                    />
                  </CheckoutInput>
                </div>

                <CheckoutInput label="Ghi chú">
                  <textarea
                    value={customer.note}
                    onChange={(event) => updateCustomer('note', event.target.value)}
                    className="min-h-20 w-full rounded-2xl border border-gray-200 bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    placeholder="Thời gian nhận hàng, lưu ý cho shipper"
                  />
                </CheckoutInput>
              </div>

              <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">Vận chuyển</p>
                    <p className="mt-1 font-display text-lg font-extrabold text-secondary">Shopee Express</p>
                    <p className="mt-1 text-sm text-muted">
                      {shippingQuote.serviceName} · {shippingQuote.eta} · hỗ trợ COD
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-bold text-primary">
                    {shippingQuote.fee === 0 ? 'Freeship' : formatCurrency(shippingQuote.fee)}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-secondary">Thanh toán</p>
                <div className="space-y-3">
                  <label className="flex cursor-pointer gap-3 rounded-2xl border border-primary bg-primary/5 p-4">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 h-4 w-4 text-primary focus:ring-primary"
                    />
                    <span>
                      <span className="block font-bold text-secondary">Thanh toán khi nhận hàng (COD)</span>
                      <span className="mt-1 block text-sm text-muted">Mặc định: giao tới nơi rồi trả tiền cho shipper.</span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 h-4 w-4 text-primary focus:ring-primary"
                    />
                    <span>
                      <span className="block font-bold text-secondary">Chuyển khoản ngân hàng</span>
                      <span className="mt-1 block text-sm text-muted">Shop xác nhận đơn và gửi thông tin chuyển khoản.</span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6 space-y-3 rounded-2xl bg-[#FFF7EF] p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Tạm tính</span>
                  <span className="font-bold text-secondary">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Phí Shopee Express</span>
                  <span className="font-bold text-secondary">{formatCurrency(shippingQuote.fee)}</span>
                </div>
                <div className="flex justify-between gap-4 border-t border-black/8 pt-3">
                  <span className="font-bold text-secondary">Tổng thanh toán</span>
                  <span className="font-display text-xl font-extrabold text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              {formError ? (
                <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {formError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={items.length === 0 || isSubmitting}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 text-sm font-extrabold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Đang tạo đơn...' : 'Xác nhận đặt hàng'}
              </button>
            </form>
          </div>
        )}
      </aside>
    </div>
  );
}
