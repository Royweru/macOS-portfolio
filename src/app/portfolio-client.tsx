'use client';

import dynamic from 'next/dynamic';

const PortfolioApp = dynamic(() => import('../App'), {
  ssr: false,
  loading: () => <div className="app-loading-screen" aria-label="Loading portfolio" />,
});

export default function PortfolioClient() {
  return <PortfolioApp />;
}
