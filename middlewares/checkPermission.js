import Role from '../models/Roles.js';
import getLayoutName from '../utils/getLayoutName.js';

// Middleware to check permissions
const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {

        const userRole = await Role.findById(req.user.role);
        if (userRole.permissions.includes(requiredPermission)) {
          return next();
        } 
      const layout = getLayoutName(req);
      return res.status(403).render('error', { message: '403 forbiden - You dont have access to this page', layout });
    } catch (error) {
      console.log(error);
      res.status(500).render('error', { message: 'Internal server error' });
    }
  };
};

export default checkPermission;