import React, { useEffect, useState } from 'react';
import eventBus from 'shared/eventBus';
import './Cart.css';

function Cart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsubscribe = eventBus.on('cart:add-item', ({ product }) => {
      setItems((prevItems) => [
        ...prevItems,
        {
          ...product,
          cartId: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        },
      ]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    eventBus.emit('cart:updated', {
      items,
      count: items.length,
      total,
      categories: [...new Set(items.map((item) => item.category))],
    });
  }, [items, total]);

  const handleRemove = (cartId) => {
    setItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
  };

  const handleClear = () => {
    setItems([]);
  };

  return (
    <div className="cart">
      <h2>Panier ({items.length})</h2>

      {items.length === 0 ? (
        <p className="empty">Panier vide</p>
      ) : (
        <>
          <ul className="cart-items">
            {items.map((item) => (
              <li key={item.cartId} className="cart-item">
                <span className="item-name">{item.name}</span>
                <span className="item-price">{item.price} EUR</span>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item.cartId)}
                >
                  x
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-footer">
            <div className="cart-total">Total : {total} EUR</div>
            <button className="clear-btn" onClick={handleClear}>
              Vider le panier
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;