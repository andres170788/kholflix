import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold gradient-text mb-4">404</h1>
        <p className="text-xl text-slate-400 mb-8">This page doesn't exist</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Home size={18} /> Go Home
        </Link>
      </div>
    </div>
  );
}
