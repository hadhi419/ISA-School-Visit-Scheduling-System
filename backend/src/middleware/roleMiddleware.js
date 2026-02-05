import jwt from 'jsonwebtoken';

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    ////console.log(req.user);
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    ////console.log(req.user.role);
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};
