import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifikasi token
    console.log('Decoded Token:', decoded); // Log token yang didecode
    req.user = decoded; // Menyimpan informasi token ke req.user
    next(); // Lanjutkan ke route berikutnya
  } catch (error) {
    console.error('Token verification error:', error); // Log jika token tidak valid
    return res.status(403).json({ message: 'Token tidak valid', error: error.message });
  }
};


