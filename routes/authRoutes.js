import express from 'express';
const router = express.Router();
import { login, register, getLoginPage, getRegisterPage, logout, getDashboard, getUserProfile, getEditProfile, editProfile, getUsers, deleteUser, getEditUser, editUser, getUser, getMostParamedicByYear, getLoggedInDevices, getMostDriverByYear  } from '../controllers/auth.js';
import checkPermission from '../middlewares/checkPermission.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import isActive from '../middlewares/isActive.js';
import loginRateLimiter from '../middlewares/LoginAttempts.js';

router.get('/', (req, res) => {
    res.redirect('/login');
});
router.get('/login', getLoginPage);
router.get('/users', isLoggedIn, getUsers);
router.get('/users/add', isLoggedIn, checkPermission("manage_users"), getRegisterPage);
router.post('/login', loginRateLimiter ,login);
router.post('/register', register);
router.get('/logout', logout);
router.get('/dashboard', isLoggedIn , isActive ,getDashboard);
router.get('/profile', isLoggedIn, getUserProfile);
router.get('/profile/edit', isLoggedIn, getEditProfile);
router.post('/profile/edit', isLoggedIn, editProfile);
router.get('/users/view/:id', isLoggedIn, checkPermission("manage_users"), getUser);
router.delete('/users/delete/:id', isLoggedIn, checkPermission("manage_users"), deleteUser);
router.get('/users/edit/:id', isLoggedIn, checkPermission("manage_users"), getEditUser);
router.put('/users/edit/:id', isLoggedIn, checkPermission("manage_users"), editUser);
router.get('/most-paramedic/:year', isLoggedIn , getMostParamedicByYear);
router.get('/most-driver/:year', isLoggedIn , getMostDriverByYear);
router.get('/logged-in-devices', isLoggedIn, getLoggedInDevices);
export default router;