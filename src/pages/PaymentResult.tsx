import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface PaymentResultProps {
  status?: 'success' | 'cancel';
}

export default function PaymentResult({ status: propStatus }: PaymentResultProps) {
  const { status: urlStatus, orderId } = useParams();
  const navigate = useNavigate();
  const status = propStatus || urlStatus;

  useEffect(() => {
    // 3秒后跳转到订单详情页
    const timer = setTimeout(() => {
      navigate(`/orders/${orderId}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {status === 'success' ? (
          <>
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">支付成功</h2>
            <p className="text-gray-600">您的订单已支付成功，正在跳转到订单详情...</p>
          </>
        ) : (
          <>
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">支付取消</h2>
            <p className="text-gray-600">您取消了支付，正在跳转到订单详情...</p>
          </>
        )}
      </div>
    </div>
  );
} 