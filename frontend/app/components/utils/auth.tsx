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
      
      // Return object dengan status dan alasan
      return {
        success: false,
        reason: response.status === 401 ? 'no_token' : 'invalid_token'
      };
    }

    const data = await response.json();
    console.log('✅ Verification success:', data);
    console.log('data.success value:', data.success, typeof data.success);
    
    return {
      success: data.success === true,
      reason: data.success === true ? 'valid' : 'invalid_token'
    };
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return {
      success: false,
      reason: 'network_error'
    };
  }
};