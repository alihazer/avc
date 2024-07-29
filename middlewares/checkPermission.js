import Role from '../models/Roles.js';

// Middleware to check permissions
const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
        const userRole = await Role.findById(req.user.role);
        if (userRole.permissions.includes(requiredPermission)) {
          next();
        } 
        else 
        {
          const roles = ['stockmanager', 'shiftmanager', 'driver'];
          if(roles.includes(userRole.name)){
            return res.status(403).render('error', { message: '403 forbiden - You dont have access to this page', layout: 'layouts/noAccessLayout' });
          }
          else if(userRole.name === 'paramedic'){
            return res.status(403).render('error', { message: '403 forbiden - You dont have access to this page', layout: 'layouts/userLayout' });
          }
      }
    } catch (error) {
      console.log(error);
      res.status(500).render('error', { message: 'Internal server error' });
    }
  };
};

export default checkPermission;