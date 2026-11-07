const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Middleware to verify JWT authentication token
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: No token provided'
    });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token: User no longer exists'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Invalid or expired token'
    });
  }
};

/**
 * Middleware to restrict access based on user role(s)
 * @param  {...string} roles Allowed roles (e.g. 'admin', 'student')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user ? req.user.role : 'anonymous'}' is not authorized to perform this operation`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
