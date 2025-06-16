import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.cookies.token; // ambil dari cookie

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan di cookie' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    console.log('Decoded Token:', decoded); 
    req.user = decoded; 
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Token tidak valid', error: error.message });
  }
};



