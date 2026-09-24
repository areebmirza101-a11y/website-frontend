import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const PageHero = ({ title, breadcrumbs }) => {
  return (
    <div className="bg-secondary text-ink py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-[1536px] mx-auto">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex justify-start items-center space-x-2 text-xs text-muted mb-6 font-semibold tracking-wider uppercase">
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.label} className="flex items-center">
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-accent transition-colors duration-300">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ink">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && (
                  <ChevronRight className="h-3 w-3 mx-2 opacity-50" />
                )}
              </div>
            ))}
          </nav>
        )}
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink mb-6">
          {title}
        </h1>
        <div className="w-16 h-1 bg-accent" />
      </div>
    </div>
  );
};

export default PageHero;
