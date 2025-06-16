import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    console.log('=== AUTHENTICATE MIDDLEWARE ===');
    console.log('All cookies received:', req.cookies);
    console.log('Cookie header:', req.headers.cookie);
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);

    const token = req.cookies.token;
    
    if (!token) {
      console.log('❌ No token found in cookies');
      console.log('Available cookies:', Object.keys(req.cookies));
      return res.status(401).json({ 
        success: false,
        message: 'Token tidak ditemukan di cookie' 
      });
    }

    console.log('✅ Token found:', token.substring(0, 20) + '...');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded successfully:', {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      exp: new Date(decoded.exp * 1000).toISOString()
    });
    
    req.user = decoded;
    next();
    
  } catch (error) {
    console.error('❌ Token verification error:', error.message);
    console.error('Error type:', error.name);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token sudah expired',
        error: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token tidak valid',
        error: 'INVALID_TOKEN'
      });
    }
    
    return res.status(401).json({ 
      success: false,
      message: 'Token tidak valid', 
      error: error.message 
    });
  }
};