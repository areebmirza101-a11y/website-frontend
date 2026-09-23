import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, GripVertical } from 'lucide-react';
import { adminSizeGuideApi } from '../../api';
import toast from 'react-hot-toast';
import { confirmAction } from '../../utils/confirmToast';

const AdminSizeGuide = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const res = await adminSizeGuideApi.list();
      setGuides(res);
    } catch (err) {
      setError(err.message || 'Failed to fetch size guides');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuide = async () => {
    const newGuide = {
      title: 'New Size Guide',
      columns: ['Size', 'Measurement 1'],
      rows: [['S', '10']],
      sort_order: guides.length,
      active: true,
    };
    try {
      const res = await adminSizeGuideApi.create(newGuide);
      setGuides([...guides, res]);
      toast.success('Guide added');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSaveGuide = async (guide) => {
    setSaving(true);
    try {
      await adminSizeGuideApi.update(guide.id, guide);
      toast.success('Saved successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGuide = (id) => {
    confirmAction('Are you sure you want to delete this guide?', async () => {
      try {
        await adminSizeGuideApi.remove(id);
        setGuides(guides.filter(g => g.id !== id));
        toast.success('Guide deleted');
      } catch (err) {
        toast.error(err.message);
      }
    });
  };

  const updateGuide = (idx, field, value) => {
    const newGuides = [...guides];
    newGuides[idx][field] = value;
    setGuides(newGuides);
  };

  const handleAddColumn = (guideIdx) => {
    const newGuides = [...guides];
    newGuides[guideIdx].columns.push('New Column');
    newGuides[guideIdx].rows = newGuides[guideIdx].rows.map(row => [...row, '']);
    setGuides(newGuides);
  };

  const handleRemoveColumn = (guideIdx, colIdx) => {
    const newGuides = [...guides];
    newGuides[guideIdx].columns.splice(colIdx, 1);
    newGuides[guideIdx].rows = newGuides[guideIdx].rows.map(row => {
      const newRow = [...row];
      newRow.splice(colIdx, 1);
      return newRow;
    });
    setGuides(newGuides);
  };

  const handleAddRow = (guideIdx) => {
    const newGuides = [...guides];
    newGuides[guideIdx].rows.push(new Array(newGuides[guideIdx].columns.length).fill(''));
    setGuides(newGuides);
  };

  const handleRemoveRow = (guideIdx, rowIdx) => {
    const newGuides = [...guides];
    newGuides[guideIdx].rows.splice(rowIdx, 1);
    setGuides(newGuides);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-ink">Manage Size Guides</h1>
        <button 
          onClick={handleAddGuide}
          className="bg-ink text-white px-4 py-2 flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Size Guide
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6">{error}</div>}

      <div className="space-y-12">
        {guides.map((guide, gIdx) => (
          <div key={guide.id} className="bg-white border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-grow max-w-md space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">Title</label>
                  <input 
                    type="text" 
                    value={guide.title}
                    onChange={(e) => updateGuide(gIdx, 'title', e.target.value)}
                    className="w-full border-b border-gray-200 py-2 focus:border-ink outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={guide.active}
                    onChange={(e) => updateGuide(gIdx, 'active', e.target.checked)}
                    id={`active-${guide.id}`}
                  />
                  <label htmlFor={`active-${guide.id}`} className="text-sm">Active</label>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleSaveGuide(guide)}
                  disabled={saving}
                  className="bg-secondary text-ink px-4 py-2 flex items-center gap-2 border border-gray-200 hover:bg-gray-50"
                >
                  <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={() => handleDeleteGuide(guide.id)}
                  className="text-red-600 p-2 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse mb-4">
                <thead>
                  <tr>
                    <th className="w-8"></th>
                    {guide.columns.map((col, cIdx) => (
                      <th key={cIdx} className="p-2 border border-gray-200 bg-secondary relative group">
                        <input 
                          type="text" 
                          value={col}
                          onChange={(e) => {
                            const newGuides = [...guides];
                            newGuides[gIdx].columns[cIdx] = e.target.value;
                            setGuides(newGuides);
                          }}
                          className="w-full bg-transparent font-bold text-xs uppercase tracking-wider outline-none text-center"
                        />
                        {guide.columns.length > 1 && (
                          <button 
                            onClick={() => handleRemoveColumn(gIdx, cIdx)}
                            className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </th>
                    ))}
                    <th className="w-8">
                      <button onClick={() => handleAddColumn(gIdx)} className="text-ink hover:text-accent p-1">
                        <Plus className="h-4 w-4" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {guide.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="p-2 border border-gray-200 text-center text-gray-400">
                        <GripVertical className="h-4 w-4 inline" />
                      </td>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-0 border border-gray-200">
                          <input 
                            type="text" 
                            value={cell}
                            onChange={(e) => {
                              const newGuides = [...guides];
                              newGuides[gIdx].rows[rIdx][cIdx] = e.target.value;
                              setGuides(newGuides);
                            }}
                            className="w-full p-2 outline-none text-center text-sm"
                          />
                        </td>
                      ))}
                      <td className="p-2 border border-gray-200 text-center">
                        <button onClick={() => handleRemoveRow(gIdx, rIdx)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button 
              onClick={() => handleAddRow(gIdx)}
              className="text-sm font-bold text-ink hover:text-accent flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Add Row
            </button>
          </div>
        ))}
        {guides.length === 0 && (
          <div className="text-center p-12 text-muted bg-secondary border border-gray-200">
            No size guides found. Click "Add Size Guide" to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSizeGuide;
