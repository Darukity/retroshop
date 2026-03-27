import React, { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';

import eventBus from 'shared/eventBus';
import RecommendationsFallback from './components/RecommendationsFallback';
import ErrorBoundary from './components/ErrorBoundary';

const ProductGrid = lazy(() => import('mfeProduct/ProductGrid'));
const Cart = lazy(() => import('mfeCart/Cart'));
const Recommendations = lazy(() =>
  import('mfeReco/Recommendations').catch(() => ({
    default: RecommendationsFallback,
  }))
);

function LoadingFallback({ name }) {
  return <div className="loading-fallback">Chargement {name}...</div>;
}

function App() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const unsubscribe = eventBus.on('cart:updated', ({ count }) => {
      setCartCount(count ?? 0);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="shell">
      <header className="shell-header">
        <h1 className="logo">RetroShop</h1>
        <div className="cart-badge">Panier ({cartCount})</div>
      </header>
      <main className="shell-main">
        <section className="product-area">
          <Suspense fallback={<LoadingFallback name="Products" />}>
            <ProductGrid />
          </Suspense>
        </section>
        <aside className="cart-area">
          <Suspense fallback={<LoadingFallback name="Cart" />}>
            <Cart />
          </Suspense>
        </aside>
      </main>
      <section className="reco-area">
        <ErrorBoundary fallback={<RecommendationsFallback />}>
        <Suspense fallback={<div>Loading recommendations...</div>}>
          <Recommendations />
        </Suspense>
      </ErrorBoundary>
      </section>
    </div>
  );
}

export default App;
