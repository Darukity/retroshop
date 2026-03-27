import React from 'react';

export default function RecommendationsFallback() {
  return (
    <div style={{ padding: '1rem', border: '1px solid #333', borderRadius: '8px' }}>
      <h3>Recommendations unavailable</h3>
      <p>The recommendation service is currently offline.</p>
    </div>
  );
}