import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import HorizontalBanners from './components/HorizontalBanners';
import ProductCatSection from './components/Cat';
import BlogSection from './components/BlogSection';
import ProductDetailPage from './components/ProductDetailPage';
import ProductCatalogPage from './components/ProductCatalogPage';
import CartCheckoutDrawer from './components/CartCheckoutDrawer';
import Footer from './components/Footer';
import {
  getCatProducts,
  getDogProducts,
  getProductBySlug,
  getSaleProducts,
} from './data/products';

const CART_STORAGE_KEY = '3f-store-cart';

const getCartItemKey = (product, variantValue = '') =>
  `${product.slug}::${variantValue || 'default'}`;

const normalizeSavedCartItem = (item) => {
  const product = getProductBySlug(item.slug);
  if (!product) return null;

  const quantity = Math.min(
    Math.max(Number(item.quantity) || 1, 1),
    Math.max(Number(product.stock) || 1, 1),
  );

  return {
    key: item.key || getCartItemKey(product, item.variantValue),
    slug: product.slug,
    variantName: item.variantName || '',
    variantValue: item.variantValue || '',
    quantity,
  };
};

function App() {
  const [searchState, setSearchState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      selectedSlug: params.get('product'),
      currentView: params.get('view'),
    };
  });
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
      return Array.isArray(savedItems)
        ? savedItems.map(normalizeSavedCartItem).filter(Boolean)
        : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const updateSearchState = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchState({
        selectedSlug: params.get('product'),
        currentView: params.get('view'),
      });
    };

    window.addEventListener('popstate', updateSearchState);
    return () => window.removeEventListener('popstate', updateSearchState);
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const dogProducts = getDogProducts().slice(0, 9);
  const catProducts = getCatProducts().slice(0, 9);
  const saleProducts = getSaleProducts().slice(0, 9);
  const selectedProduct = searchState.selectedSlug
    ? getProductBySlug(searchState.selectedSlug)
    : null;
  const cartItemsWithProducts = useMemo(
    () =>
      cartItems
        .map((item) => {
          const product = getProductBySlug(item.slug);
          return product ? { ...item, product } : null;
        })
        .filter(Boolean),
    [cartItems],
  );
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isCatalogView = searchState.currentView === 'products';
  const forceHeaderVisible = Boolean(selectedProduct) || isCatalogView || isCartOpen;

  const addToCart = (product, options = {}) => {
    const variant = options.variant || product.defaultVariant || null;
    const variantName = variant?.name || '';
    const variantValue = variant?.value || '';
    const quantity = Math.max(Number(options.quantity) || 1, 1);
    const key = getCartItemKey(product, variantValue);
    const maxQuantity = Math.max(Number(product.stock) || 1, 1);

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.key === key);

      if (existingItem) {
        return currentItems.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(item.quantity + quantity, maxQuantity) }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          key,
          slug: product.slug,
          variantName,
          variantValue,
          quantity: Math.min(quantity, maxQuantity),
        },
      ];
    });
  };

  const buyNow = (product, options = {}) => {
    addToCart(product, options);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (key, quantity) => {
    setCartItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.key !== key) return item;

        const product = getProductBySlug(item.slug);
        const maxQuantity = Math.max(Number(product?.stock) || 1, 1);
        const nextQuantity = Math.min(Math.max(Number(quantity) || 1, 1), maxQuantity);
        return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
      }),
    );
  };

  const removeCartItem = (key) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.key !== key));
  };

  return (
    <div className="w-full min-h-screen bg-white font-body text-secondary selection:bg-primary selection:text-white">
      <Header
        forceVisible={forceHeaderVisible}
        solid={forceHeaderVisible}
        cartCount={cartCount}
        onCartOpen={() => setIsCartOpen(true)}
      />

      {selectedProduct ? (
        <ProductDetailPage
          key={selectedProduct.slug}
          product={selectedProduct}
          onAddToCart={addToCart}
          onBuyNow={buyNow}
        />
      ) : isCatalogView ? (
        <ProductCatalogPage onAddToCart={addToCart} />
      ) : (
        <>
          <Hero />
          <About />
          <HorizontalBanners />
          <ProductCatSection
            anchorId="products"
            title="Sản phẩm cho chó"
            products={dogProducts}
            onAddToCart={addToCart}
            viewMoreHref="/?view=products&q=chó"
          />
          <ProductCatSection
            title="Các sản phẩm cho mèo"
            products={catProducts}
            onAddToCart={addToCart}
            viewMoreHref="/?view=products&q=mèo"
          />
          <ProductCatSection
            title="Deal đang được quan tâm"
            products={saleProducts}
            onAddToCart={addToCart}
            viewMoreHref="/?view=products"
          />
          <BlogSection />
        </>
      )}

      <CartCheckoutDrawer
        isOpen={isCartOpen}
        items={cartItemsWithProducts}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeCartItem}
        onClearCart={() => setCartItems([])}
      />

      <Footer />
    </div>
  );
}

export default App;
