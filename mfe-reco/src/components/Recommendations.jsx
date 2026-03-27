import React, { useState, useEffect } from 'react';
import eventBus from 'shared/eventBus';
import PRODUCTS from 'shared/products';
import './Recommendations.css';

function Recommendations() {
  const [recos, setRecos] = useState(PRODUCTS.slice(0, 3));

  useEffect(() => {
    const unsubscribe = eventBus.on('cart:updated', ({ categories }) => {
      if (!categories || categories.length === 0) {
        setRecos(PRODUCTS.slice(0, 3));
        return;
      }

      const categorySet = new Set(categories);

      const nextRecos = PRODUCTS
        .filter(product => !categorySet.has(product.category))
        .slice(0, 3);

      setRecos(nextRecos.length > 0 ? nextRecos : PRODUCTS.slice(0, 3));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddReco = (product) => {
    eventBus.emit('cart:add-item', {
    product: {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
    },
    source: 'mfe-reco',
    addedAt: Date.now(),
  });
  };

  return (
    <div className="recommendations">
      <h2>Les joueurs achetent aussi</h2>
      <div className="reco-list">
        {recos.map(p => (
          <div key={p.id} className="reco-card" onClick={() => handleAddReco(p)}>
            <div className="reco-image" data-category={p.category}>{p.category}</div>
            <span className="reco-name">{p.name}</span>
            <span className="reco-price">{p.price} EUR</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
