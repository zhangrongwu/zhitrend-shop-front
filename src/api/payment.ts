import { useAuth } from '../hooks/useAuth';

// 创建支付订单
export async function createPayment(orderId: number) {
  const { token } = useAuth.getState();
  
  const response = await fetch(`http://localhost:8787/api/orders/${orderId}/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '创建支付订单失败');
  }

  return response.json();
} 