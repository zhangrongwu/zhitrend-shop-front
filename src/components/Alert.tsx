import { XMarkIcon } from '@heroicons/react/20/solid';
import { useEffect } from 'react';

interface AlertProps {
  show: boolean;
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Alert({ show, type, message, onClose, duration = 3000 }: AlertProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`rounded-md p-4 ${
          type === 'success' ? 'bg-green-50' : 'bg-red-50'
        }`}
      >
        <div className="flex">
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {message}
            </p>
          </div>
          <div className="ml-3">
            <button
              type="button"
              className={`inline-flex rounded-md p-1.5 ${
                type === 'success'
                  ? 'bg-green-50 text-green-500 hover:bg-green-100'
                  : 'bg-red-50 text-red-500 hover:bg-red-100'
              }`}
              onClick={onClose}
            >
              <span className="sr-only">关闭</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 