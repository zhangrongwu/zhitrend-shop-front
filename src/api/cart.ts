import { useAuth } from '../hooks/useAuth';

export async function addToCart(productId: number, quantity: number = 1) {
  const { token } = useAuth.getState();
  
  if (!token) {
    throw new Error('未登录');
  }

  const response = await fetch('http://localhost:8787/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '添加到购物车失败');
  }

  return response.json();
} 