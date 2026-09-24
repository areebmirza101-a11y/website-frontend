import { Link } from 'react-router-dom';

const Unauthorized = ({ homePath = '/', loginPath = '/login' }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <span className="text-8xl font-bold text-gray-900 tracking-tighter">401</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Unauthorized</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          You need to sign in to access this page. Please log in or create an account to continue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={loginPath}
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            Sign in
          </Link>
          <Link
            to={homePath}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
