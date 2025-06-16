export const verifyToken = async () => {
  try {
    console.log('=== FRONTEND VERIFY TOKEN ===');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-token`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ Verification failed:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('✅ Verification success:', data);
    console.log('data.success value:', data.success, typeof data.success);
    
    // Pastikan return boolean yang benar
    return data.success === true;
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return false;
  }
};