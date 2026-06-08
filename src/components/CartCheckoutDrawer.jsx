import { useMemo, useState } from 'react';
import {
  buildShopeeExpressShipmentPayload,
  createShopeeExpressShipment,
  getShopeeExpressQuote,
} from '../services/shopeeExpress';

// ── localStorage key để lưu thông tin khách ──────────────────────────────────
const CUSTOMER_STORAGE_KEY = '3f-customer-info';

const emptyCustomer = { name: '', phone: '', address: '', ward: '', province: '', note: '' };

const requiredCustomerFields = {
  name: 'họ tên',
  phone: 'số điện thoại',
  address: 'địa chỉ nhận hàng',
  province: 'tỉnh/thành phố',
};

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;
const buildOrderCode = () => `3F${Date.now().toString().slice(-7)}`;

// Load saved customer info from localStorage
const loadSavedCustomer = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOMER_STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object') return { ...emptyCustomer, ...saved };
  } catch {
    return emptyCustomer;
  }
  return emptyCustomer;
};

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const CheckoutInput = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-bold text-secondary">{label}</span>
    {children}
  </label>
);

// ── STEP 1: Cart view ─────────────────────────────────────────────────────────
function CartStep({ items, subtotal, total, shippingQuote, onUpdateQuantity, onRemoveItem, onClearCart, onCheckout, onClose }) {
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Scrollable item list */}
      <div className="flex-1 overflow-y-auto px-4 pb-36 pt-4 sm:px-6 sm:pb-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted">{itemCount} sản phẩm trong giỏ</p>
          {items.length > 0 && (
            <button type="button" onClick={onClearCart}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:border-red-300 hover:text-red-500">
              <TrashIcon />
              Xóa giỏ
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-[24px] bg-white p-8 text-center shadow-sm">
            <p className="text-2xl">🛒</p>
            <h4 className="mt-3 font-display text-xl font-extrabold text-secondary">Giỏ hàng đang trống</h4>
            <p className="mt-2 text-sm text-muted">Chọn sản phẩm để bắt đầu đặt hàng.</p>
            <button type="button" onClick={onClose}
              className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white">
              Tiếp tục mua hàng
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map(({ key, product, quantity, variantValue }) => (
              <article key={key}
                className="grid grid-cols-[72px_1fr_auto] items-start gap-3 rounded-2xl bg-white p-3 shadow-sm">
                {/* Image */}
                <img src={product.img} alt={product.name}
                  className="h-[72px] w-[72px] rounded-xl object-cover"
                  onError={(e) => { e.target.src = '/dog_about.png'; }} />

                {/* Info */}
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{product.category}</p>
                  <p className="mt-0.5 text-xs font-bold leading-snug text-secondary">{product.name}</p>
                  {variantValue && (
                    <p className="mt-0.5 text-[10px] text-muted">{variantValue}</p>
                  )}
                  <p className="mt-1 text-xs font-extrabold text-primary">{product.price}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2">
                  <button type="button" onClick={() => onRemoveItem(key)}
                    className="text-muted transition-colors hover:text-red-500" aria-label="Xóa sản phẩm">
                    <TrashIcon />
                  </button>
                  <div className="flex items-center rounded-full border border-gray-200 bg-white">
                    <button type="button" onClick={() => onUpdateQuantity(key, quantity - 1)}
                      disabled={quantity <= 1}
                      className="flex h-7 w-7 items-center justify-center text-sm font-bold text-secondary disabled:opacity-35">−</button>
                    <span className="min-w-[22px] text-center text-xs font-extrabold">{quantity}</span>
                    <button type="button" onClick={() => onUpdateQuantity(key, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="flex h-7 w-7 items-center justify-center text-sm font-bold text-secondary disabled:opacity-35">+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Desktop summary + buttons */}
        {items.length > 0 && (
          <div className="mt-5 hidden sm:block">
            <div className="rounded-2xl bg-[#FFF7EF] p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted">Tạm tính</span>
                <span className="font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-4 mt-2">
                <span className="text-muted">Phí ship (Shopee Express)</span>
                <span className="font-bold">{shippingQuote.fee === 0 ? 'Freeship' : formatCurrency(shippingQuote.fee)}</span>
              </div>
              <div className="mt-3 flex justify-between gap-4 border-t border-black/8 pt-3">
                <span className="font-bold text-secondary">Tổng</span>
                <span className="font-display text-xl font-extrabold text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button type="button" onClick={onClose}
                className="rounded-full border border-secondary/20 bg-white py-3 text-sm font-extrabold text-secondary transition-colors hover:border-primary hover:text-primary">
                Tiếp tục mua
              </button>
              <button type="button" onClick={onCheckout}
                className="rounded-full bg-primary py-3 text-sm font-extrabold text-white transition-colors hover:bg-primary/90">
                Thanh toán →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky bottom bar */}
      {items.length > 0 && (
        <div className="sticky bottom-0 border-t border-gray-100 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] sm:hidden">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-xs text-muted">Tổng thanh toán</span>
            <span className="font-display text-xl font-extrabold text-primary">{formatCurrency(total)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" onClick={onClose}
              className="rounded-full border border-secondary/20 py-3 text-sm font-extrabold text-secondary">
              Tiếp tục mua
            </button>
            <button type="button" onClick={onCheckout}
              className="rounded-full bg-primary py-3 text-sm font-extrabold text-white">
              Thanh toán →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── STEP 2: Checkout form ─────────────────────────────────────────────────────
function CheckoutStep({ items, subtotal, total, shippingQuote, onBack, onClearCart, onClose }) {
  const [customer, setCustomer] = useState(loadSavedCustomer);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const updateCustomer = (field, value) => {
    setCustomer((c) => {
      const updated = { ...c, [field]: value };
      // persist to localStorage for autofill next time
      try {
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Local storage can be unavailable in restricted browser contexts.
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const norm = Object.fromEntries(Object.entries(customer).map(([k, v]) => [k, v.trim()]));
    const missing = Object.entries(requiredCustomerFields).find(([f]) => !norm[f]);
    if (missing) { setFormError(`Vui lòng nhập ${missing[1]}.`); return; }
    if (!/^[0-9+\s().-]{8,16}$/.test(norm.phone)) { setFormError('Số điện thoại chưa đúng định dạng.'); return; }

    const codFee = paymentMethod === 'cod' ? shippingQuote.codFee : 0;
    const order = {
      code: buildOrderCode(),
      customer: norm,
      paymentMethod,
      paymentLabel: paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản',
      subtotal,
      shippingFee: shippingQuote.fee,
      codFee,
      total: subtotal + shippingQuote.fee + codFee,
      shippingQuote,
      createdAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    try {
      const payload = buildShopeeExpressShipmentPayload({ order, items, paymentMethod, shippingQuote });
      const shipment = await createShopeeExpressShipment(payload);
      setOrderResult({ ...order, shipment });
      onClearCart();
    } catch (err) {
      setFormError(err.message || 'Không thể tạo đơn hàng lúc này.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderResult) {
    return (
      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <section className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-lg">
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase text-emerald-700">Đã ghi nhận</span>
          <h3 className="mt-4 font-display text-2xl font-extrabold text-secondary">Đặt hàng thành công 🎉</h3>
          <p className="mt-2 text-sm text-muted">Mã đơn <strong>{orderResult.code}</strong> · {orderResult.paymentLabel}</p>
          <div className="mt-4 space-y-2 rounded-2xl bg-[#FFF7EF] p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Mã vận đơn</span>
              <span className="font-bold">{orderResult.shipment.trackingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Tổng thanh toán</span>
              <span className="font-bold text-primary">{formatCurrency(orderResult.total)}</span>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-extrabold text-white">
            Hoàn tất
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 pb-36 pt-4 sm:px-6 sm:pb-4">
        <button type="button" onClick={onBack}
          className="mb-4 flex items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Quay lại giỏ hàng
        </button>

        <form onSubmit={handleSubmit} id="checkout-form">
          <h3 className="mb-4 font-display text-xl font-extrabold text-secondary">Thông tin nhận hàng</h3>

          {/* Autofill notice if data exists */}
          {(customer.name || customer.phone) && (
            <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              ✓ Đã tự điền từ lần mua trước — kiểm tra lại trước khi đặt hàng.
            </p>
          )}

          <div className="space-y-3">
            <CheckoutInput label="Họ tên *">
              <input value={customer.name} onChange={(e) => updateCustomer('name', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-[#FFFDF9] px-4 py-3 text-sm outline-none focus:border-primary"
                placeholder="Nguyễn Văn A" />
            </CheckoutInput>

            <CheckoutInput label="Số điện thoại *">
              <input value={customer.phone} onChange={(e) => updateCustomer('phone', e.target.value)}
                type="tel" inputMode="numeric"
                className="w-full rounded-2xl border border-gray-200 bg-[#FFFDF9] px-4 py-3 text-sm outline-none focus:border-primary"
                placeholder="0900 000 000" />
            </CheckoutInput>

            <CheckoutInput label="Địa chỉ *">
              <input value={customer.address} onChange={(e) => updateCustomer('address', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-[#FFFDF9] px-4 py-3 text-sm outline-none focus:border-primary"
                placeholder="Số nhà, đường" />
            </CheckoutInput>

            <div className="grid grid-cols-2 gap-3">
              <CheckoutInput label="Phường/xã">
                <input value={customer.ward} onChange={(e) => updateCustomer('ward', e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-[#FFFDF9] px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="Phường/xã" />
              </CheckoutInput>
              <CheckoutInput label="Tỉnh/thành *">
                <input value={customer.province} onChange={(e) => updateCustomer('province', e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-[#FFFDF9] px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="TP. HCM" />
              </CheckoutInput>
            </div>

            <CheckoutInput label="Ghi chú">
              <textarea value={customer.note} onChange={(e) => updateCustomer('note', e.target.value)}
                rows={2}
                className="w-full rounded-2xl border border-gray-200 bg-[#FFFDF9] px-4 py-3 text-sm outline-none focus:border-primary"
                placeholder="Thời gian, lưu ý shipper..." />
            </CheckoutInput>
          </div>

          {/* Shipping */}
          <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Shopee Express</p>
                <p className="text-sm text-muted">{shippingQuote.serviceName} · {shippingQuote.eta}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-primary">
                {shippingQuote.fee === 0 ? 'Freeship' : formatCurrency(shippingQuote.fee)}
              </span>
            </div>
          </div>

          {/* Payment method */}
          <div className="mt-4">
            <p className="mb-2 text-sm font-bold text-secondary">Thanh toán</p>
            <div className="space-y-2">
              {[
                { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', sub: 'Trả tiền cho shipper khi nhận hàng' },
                { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng', sub: 'Shop xác nhận và gửi thông tin CK' },
              ].map((opt) => (
                <label key={opt.value}
                  className={`flex cursor-pointer gap-3 rounded-2xl border p-3.5 transition-colors ${paymentMethod === opt.value ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}>
                  <input type="radio" name="payment" value={opt.value}
                    checked={paymentMethod === opt.value}
                    onChange={() => setPaymentMethod(opt.value)}
                    className="mt-0.5 h-4 w-4 text-primary" />
                  <span>
                    <span className="block text-sm font-bold text-secondary">{opt.label}</span>
                    <span className="text-xs text-muted">{opt.sub}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-5 space-y-2 rounded-2xl bg-[#FFF7EF] p-4 text-sm">
            <div className="flex justify-between"><span className="text-muted">Tạm tính</span><span className="font-bold">{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Phí ship</span><span className="font-bold">{formatCurrency(shippingQuote.fee)}</span></div>
            <div className="flex justify-between border-t border-black/8 pt-2">
              <span className="font-bold text-secondary">Tổng</span>
              <span className="font-display text-xl font-extrabold text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          {formError && (
            <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">{formError}</p>
          )}

          {/* Desktop submit */}
          <button type="submit" form="checkout-form"
            disabled={items.length === 0 || isSubmitting}
            className="mt-4 hidden w-full rounded-full bg-primary py-4 text-sm font-extrabold text-white transition-colors hover:bg-primary/90 disabled:opacity-50 sm:flex items-center justify-center">
            {isSubmitting ? 'Đang tạo đơn...' : 'Xác nhận đặt hàng'}
          </button>
        </form>
      </div>

      {/* Mobile sticky submit */}
      <div className="sticky bottom-0 border-t border-gray-100 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] sm:hidden">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-muted">Tổng thanh toán</span>
          <span className="font-display text-xl font-extrabold text-primary">{formatCurrency(total)}</span>
        </div>
        <button type="submit" form="checkout-form"
          disabled={items.length === 0 || isSubmitting}
          className="w-full rounded-full bg-primary py-3.5 text-sm font-extrabold text-white disabled:opacity-50">
          {isSubmitting ? 'Đang tạo đơn...' : 'Xác nhận đặt hàng'}
        </button>
      </div>
    </div>
  );
}

// ── Main drawer ───────────────────────────────────────────────────────────────
export default function CartCheckoutDrawer({ isOpen, items, onClose, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'

  const itemCount = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.product.priceValue * i.quantity, 0), [items]);
  const shippingQuote = useMemo(() => getShopeeExpressQuote({ subtotal }), [subtotal]);
  const total = subtotal + shippingQuote.fee;

  if (!isOpen) return null;

  const handleClose = () => {
    setStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90]">
      {/* Backdrop */}
      <button type="button" aria-label="Đóng giỏ hàng" className="absolute inset-0 bg-black/45" onClick={handleClose} />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[520px] flex-col bg-[#FFF9F4] shadow-[-24px_0_70px_rgba(31,41,55,0.28)]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/8 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">3F Store</p>
            <h2 className="font-display text-xl font-extrabold text-secondary">
              {step === 'cart' ? `Giỏ hàng (${itemCount})` : 'Thanh toán'}
            </h2>
          </div>
          <button type="button" onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-secondary hover:border-primary hover:text-primary"
            aria-label="Đóng">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 'cart' ? (
          <CartStep
            items={items}
            subtotal={subtotal}
            total={total}
            shippingQuote={shippingQuote}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            onClearCart={onClearCart}
            onCheckout={() => setStep('checkout')}
            onClose={handleClose}
          />
        ) : (
          <CheckoutStep
            items={items}
            subtotal={subtotal}
            total={total}
            shippingQuote={shippingQuote}
            onBack={() => setStep('cart')}
            onClearCart={onClearCart}
            onClose={handleClose}
          />
        )}
      </aside>
    </div>
  );
}
