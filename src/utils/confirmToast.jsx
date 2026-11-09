import { useState, useEffect } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

let openModalHandler = null;

/**
 * Universal Action Confirmation Dialog
 * Displays a clean, centered modal with high contrast text and backdrop blur.
 */
export const confirmAction = (message, onConfirm, onCancel, options = {}) => {
  if (openModalHandler) {
    openModalHandler({
      message,
      title: options.title || 'Confirm Action',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      onConfirm,
      onCancel,
    });
  } else {
    // Native fallback if component hasn't mounted yet
    if (window.confirm(message)) {
      if (onConfirm) onConfirm();
    } else {
      if (onCancel) onCancel();
    }
  }
};

/**
 * Global Confirm Modal Mount Root
 * Place this once inside App.jsx so any component can trigger a centered dialog.
 */
export const ConfirmModalRoot = () => {
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    openModalHandler = setModalData;
    return () => {
      openModalHandler = null;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalData) {
        if (modalData.onCancel) modalData.onCancel();
        setModalData(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalData]);

  if (!modalData) return null;

  const handleConfirm = () => {
    const fn = modalData.onConfirm;
    setModalData(null);
    if (fn) fn();
  };

  const handleCancel = () => {
    const fn = modalData.onCancel;
    setModalData(null);
    if (fn) fn();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleCancel}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full overflow-hidden p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              {modalData.title || 'Confirm Action'}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              {modalData.message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
          >
            {modalData.cancelText || 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            {modalData.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
