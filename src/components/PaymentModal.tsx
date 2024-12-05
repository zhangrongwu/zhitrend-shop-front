import { useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import Modal from './Modal';

type PaymentMethod = 'alipay' | 'wechat' | 'paypal';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
  amount: number;
}

export default function PaymentModal({ open, onClose, orderId, amount }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handlePayment = async (method: PaymentMethod) => {
    try {
      setLoading(true);
      setError('');
      setQrCodeUrl('');

      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          orderId,
          paymentMethod: method,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }

      switch (method) {
        case 'alipay':
          window.location.href = result.paymentData.body;
          break;
        case 'wechat':
          setQrCodeUrl(result.paymentData.code_url);
          break;
        case 'paypal':
          window.location.href = result.paymentData.links.find(
            (link: any) => link.rel === 'approve'
          ).href;
          break;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '支付失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="订单支付">
      <div className="p-6">
        <div className="text-center mb-4">
          <div className="text-lg font-medium">支付金额</div>
          <div className="text-2xl font-bold text-indigo-600">
            ¥{amount.toFixed(2)}
          </div>
          {method === 'paypal' && (
            <div className="text-sm text-gray-500">
              ≈ ${(amount * 0.14).toFixed(2)} USD
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-center">
            {error}
          </div>
        )}

        {qrCodeUrl ? (
          <div className="flex flex-col items-center">
            <QRCode value={qrCodeUrl} size={200} />
            <p className="mt-4 text-gray-600">请使用微信扫码支付</p>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => handlePayment('alipay')}
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '处理中...' : '支付宝支付'}
            </button>
            <button
              onClick={() => handlePayment('wechat')}
              disabled={loading}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? '处理中...' : '微信支付'}
            </button>
            <button
              onClick={() => handlePayment('paypal')}
              disabled={loading}
              className="w-full py-2 px-4 bg-[#0070BA] text-white rounded-md hover:bg-[#003087] disabled:opacity-50"
            >
              {loading ? '处理中...' : 'PayPal'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
} 