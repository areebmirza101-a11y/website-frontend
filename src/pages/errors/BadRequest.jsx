import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const BadRequest = ({ homePath = '/' }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(homePath, { replace: true });
  }, [navigate, homePath]);
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <span className="text-8xl font-bold text-gray-900 tracking-tighter">400</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Bad request</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The request could not be understood by the server. Please check your input and try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={homePath}
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BadRequest;
