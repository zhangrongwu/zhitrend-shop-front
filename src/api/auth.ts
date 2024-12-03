export const register = async (data: RegisterData) => {
  try {
    const response = await fetch('http://localhost:8787/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Registration failed:', result);
      throw new Error(result.error || '注册失败');
    }
    
    return result;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
} 