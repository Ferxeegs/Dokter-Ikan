export const verifyToken = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-token`, {
      method: 'GET',
      credentials: 'include', 
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};