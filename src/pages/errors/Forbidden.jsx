import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Headset } from 'lucide-react';

const Forbidden = ({ homePath = '/' }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="max-w-2xl w-full text-center bg-white p-12 sm:p-16 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-accent to-purple-500 opacity-80" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-50 border border-purple-100 mb-8 shadow-inner">
            <ShieldAlert className="w-12 h-12 text-purple-500" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-ink mb-4 uppercase tracking-tight">Access Denied</h1>
          
          <p className="text-gray-500 mb-10 text-lg max-w-md mx-auto leading-relaxed">
            You don't have permission to view this page. If you think this is a mistake, please contact our support team.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={homePath}
              className="inline-flex items-center justify-center rounded-xl bg-ink px-8 py-4 text-sm font-bold text-white hover:bg-accent hover:shadow-lg hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back Home
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-sm font-bold text-ink hover:border-ink hover:bg-gray-50 transition-all duration-300 uppercase tracking-widest gap-2"
            >
              <Headset className="w-4 h-4" /> Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
