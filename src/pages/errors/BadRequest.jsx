import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BadRequest = ({ homePath = '/' }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="max-w-2xl w-full text-center bg-white p-12 sm:p-16 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-accent to-orange-400 opacity-80" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-50 border border-orange-100 mb-8 shadow-inner">
            <span className="text-5xl font-black text-orange-500 tracking-tighter">400</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-ink mb-4 uppercase tracking-tight">Bad Request</h1>
          
          <p className="text-gray-500 mb-10 text-lg max-w-md mx-auto leading-relaxed">
            We couldn't understand that request. Please check your input and try again.
          </p>
          
          <div className="flex justify-center">
            <Link
              to={homePath}
              className="inline-flex items-center justify-center rounded-xl bg-ink px-8 py-4 text-sm font-bold text-white hover:bg-accent hover:shadow-lg hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadRequest;
