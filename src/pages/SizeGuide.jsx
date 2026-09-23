import { useState, useEffect } from 'react';
import PageHero from '../components/PageHero';
import { Ruler, Info } from 'lucide-react';
import { sizeGuideApi } from '../api';

const SizeGuide = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await sizeGuideApi.getPublic();
        setGuides(res);
      } catch (err) {
        setError('Failed to load size guides.');
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, []);

  return (
    <div className="bg-white min-h-screen pb-24">
      <PageHero 
        title="Size Guide" 
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Size Guide' }
        ]} 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Ruler className="h-8 w-8 text-ink" />
          </div>
          <h2 className="text-3xl font-bold text-ink mb-4">Find Your Perfect Fit</h2>
          <p className="text-muted max-w-2xl mx-auto leading-relaxed">
            Our garments are designed to fit true to size. Use the charts below to determine your best fit. If you are between sizes, we recommend sizing up for a more relaxed fit.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted">Loading size guides...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : guides.length === 0 ? (
          <div className="text-center py-12 text-muted">No size guides currently available.</div>
        ) : (
          <div className="space-y-16">
            {guides.map((guide) => (
              <div key={guide.id}>
                <h3 className="text-2xl font-bold text-ink mb-6 uppercase tracking-wider text-sm">{guide.title}</h3>
                <div className="overflow-x-auto border border-gray-200">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-secondary text-ink text-sm uppercase tracking-wider">
                        {guide.columns.map((col, cIdx) => (
                          <th 
                            key={cIdx} 
                            className={`py-4 px-4 font-bold border-b border-gray-200 ${cIdx > 0 ? 'border-l border-gray-200' : ''}`}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-muted">
                      {guide.rows.map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx % 2 !== 0 ? 'bg-gray-50' : ''}>
                          {row.map((cell, cIdx) => (
                            <td 
                              key={cIdx} 
                              className={`py-4 px-4 ${cIdx === 0 ? 'font-medium text-ink' : 'border-l border-gray-200'}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* How to measure */}
            <div className="bg-secondary p-8 flex flex-col md:flex-row gap-6 items-start mt-8 border border-gray-200">
              <Info className="h-8 w-8 text-ink shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-ink mb-4 uppercase tracking-wider text-sm">How to Measure</h3>
                <div className="space-y-4 text-muted leading-relaxed text-sm">
                  <p><strong className="text-ink">Chest / Bust:</strong> Measure around the fullest part, under your armpits, keeping the tape horizontal.</p>
                  <p><strong className="text-ink">Waist:</strong> Measure around the narrowest part (typically where your body bends side to side), keeping the tape horizontal.</p>
                  <p><strong className="text-ink">Hip:</strong> Measure around the fullest part of your hips, keeping the tape horizontal.</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default SizeGuide;
