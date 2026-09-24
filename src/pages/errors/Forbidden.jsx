import { Link } from 'react-router-dom';

const Forbidden = ({ homePath = '/' }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <span className="text-8xl font-bold text-gray-900 tracking-tighter">403</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Access denied</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          You don&apos;t have permission to view this page. If you think this is a mistake, contact support.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={homePath}
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            Go back home
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
