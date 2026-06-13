// ============================================================
// NEXORA — 404 Not Found Page
// ============================================================

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <>
      <Helmet><title>Page Not Found | NEXORA</title></Helmet>
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[8rem] font-black text-[#1e1e1e] leading-none">404</p>
          <h1 className="text-2xl font-bold text-[#f3f3f3] -mt-8 mb-4">Page Not Found</h1>
          <p className="text-sm text-[#888] mb-8 max-w-sm mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="nexora-button flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Go Back
            </button>
            <Link to="/" className="nexora-button-primary flex items-center gap-2">
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
