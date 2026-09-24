import { Link } from 'react-router-dom';
import { RefreshCw, ArrowLeft } from 'lucide-react';

const ServerError = ({ homePath = '/' }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="max-w-2xl w-full text-center bg-white p-12 sm:p-16 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-accent to-red-500 opacity-80" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-50 border border-red-100 mb-8 shadow-inner">
            <span className="text-5xl font-black text-red-500 tracking-tighter">500</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-ink mb-4 uppercase tracking-tight">Server Error</h1>
          
          <p className="text-gray-500 mb-10 text-lg max-w-md mx-auto leading-relaxed">
            Oops, something went wrong on our end. Please try again later or contact our support team if the problem persists.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-xl bg-ink px-8 py-4 text-sm font-bold text-white hover:bg-accent hover:shadow-lg hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <Link
              to={homePath}
              className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-sm font-bold text-ink hover:border-ink hover:bg-gray-50 transition-all duration-300 uppercase tracking-widest gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
