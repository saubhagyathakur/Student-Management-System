const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_sms_jwt';
  const expiresIn = process.env.JWT_EXPIRE || '24h';
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_sms_jwt';
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken
};
