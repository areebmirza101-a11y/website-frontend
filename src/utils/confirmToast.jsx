import toast from 'react-hot-toast';

export const confirmAction = (message, onConfirm, onCancel) => {
  toast((t) => (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-gray-900">{message}</p>
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            if (onCancel) onCancel();
          }}
          className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
          className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    position: 'top-center',
    style: {
      border: '1px solid #fee2e2',
      padding: '16px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    },
  });
};
