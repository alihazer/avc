import User from "../models/User.js";
import Role from "../models/Roles.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import createToken from "../utils/createToken.js";
import { getMyTriagesCount, getTheMostDayTriagesInTheMonth } from "./triage.controller.js";
import { getItemsUsed } from "./materials.controller.js";
import { getMostCasesCar } from "./car.contoller.js";
import Triage from "../models/Triage.js";
import { getBorrowedItemsCount } from "./borrowStock.controller.js";
import getLayoutName from "../utils/getLayoutName.js";
import { getItemsThisMonth } from "./materials.controller.js";
import moment from "moment";

export const register = asyncHandler(async (req, res) => {
    try { 
        let { username, password, role, phone, shiftDays } = req.body;
        shiftDays = shiftDays.split(',');
        const alreadyExists = await User.findOne({ username });
        const roles = await Role.find({});
        if (alreadyExists) {
            console.log('User already exists');
            return res.status(400).render('register', { roles, message: 'User already exists'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            username,
            password: hashedPassword,
            role,
            phone,
            shiftDays
        });
        return res.status(201).render('register', { roles, message: 'User created successfully'});
    } catch (error) {
        console.log(error);
        const err = new Error('Something went wrong');
        error.statusCode = 400;
        throw err;
    }
});

export const login = asyncHandler(async (req, res) => {

    try {
        const { username, password } = req.body;
        const user = await User.findOne({  username } ).populate('role');
        if (!user) {
            return res.status(401).render('login', 
                { 
                    message: 'Invalid credentials',
                    layout: 'layouts/loginLayout',
                });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).render('login', 
                {
                    message: 'Invalid credentials',
                    layout: 'layouts/loginLayout',
                });
        }
        // unsign the password from the user object
        user.password = undefined;
        const token = createToken(user._id, user.role, user.username);
        const isProduction = process.env.NODE_ENV === 'production';
        const date = new Date();
        console.log('Hello', user.username, 'Logged in at: ', moment(date).format('MMMM Do YYYY, h:mm:ss a'));

        // Set the token cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction, // Ensures the cookie is only sent over HTTPS in production
            sameSite: isProduction ? 'Strict' : 'Lax', // Strict in production, Lax in development
        });
        
        // Set the user cookie
        res.cookie('user', user, {
            httpOnly: true, // Consistent with the token cookie
            secure: isProduction,
            sameSite: isProduction ? 'Strict' : 'Lax',
        });
        res.status(200).redirect('/dashboard')
    } catch (error) {
        console.log(error);
        const err = new Error('Something went wrong');
        error.statusCode = 400;
        throw err;
    }
});

// get login page
export const getLoginPage = (req, res) => {
        // clear thw cookies
        res.clearCookie('token');
        res.clearCookie('user');
    return res.status(200).render('login', { 
        message: '',
        layout: 'layouts/loginLayout',
    });
}
// get register page
export const getRegisterPage = asyncHandler(async(req, res) => {
    const roles = await Role.find({});
    res.status(200).render('register', { roles, message: ''});
});

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie('token');
    res.clearCookie('user');
    res.status(200).redirect('/login');
});

export const updateUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('error', { message: 'User not found' });
        }
        const { username, role, profileImage, bloodType, phone, status, shiftDays } = req.body;
        await user.update({
            username,
            role,
            profileImage,
            bloodType,
            phone,
            status,
            shiftDays
        });
        res.status(200).render('user', { user });
    } catch (error) {
        console.log(error)
        const err = new Error('Something went wrong');
        error.statusCode = 400;
        throw err;
    }
});

export const getDashboard = asyncHandler(async (req, res) => {
    const role = req.user.role;
    const roleName = await Role.findById(role);
    const accessibles = ['admin', 'superadmin'];
    const noAccess = ['driver', 'stockmanager', 'shiftmanager'];
    const data = await getMyTriagesCount(req, res);
    if(accessibles.includes(roleName.name)){
        const items = await getItemsThisMonth();
        const borrowedItems = await getBorrowedItemsCount(true);
        const triageOfTheMonth = await getTheMostDayTriagesInTheMonth();
        let mostCasesCar = await getMostCasesCar(true);
        if(!mostCasesCar){
            mostCasesCar = [{ _id: 'No car', caseCount: 0 }];
        }
        let mostParamedic = await getMostParamedic(true);
        if(!mostParamedic){
            mostParamedic = { user: 'No paramedic', caseCount: 0 };
        }
        res.status(200).render('adminDashboard', {title: "Dashboard", data, items: items.length, mostCasesCar, mostParamedic, borrowedItems: borrowedItems.length, triageOfTheMonth: triageOfTheMonth[0]});
    }
    else if(noAccess.includes(roleName.name)){
        res.status(200).render('noAccessDashboard', { layout: 'layouts/noAccessLayout', count: data.count });
    }
    else{
        res.status(200).render('userDashboard', { title: 'userDashboard', layout: 'layouts/userLayout', count: data.count});
    }
});

// render user profile
export const getUserProfile = asyncHandler(async (req, res) => {
    const accessibles = ['admin', 'superadmin'];
    const noAccess = ['driver', 'stockmanager', 'shiftmanager']
    const role = req.user.role.name;
    let totalCases = 0;
    const user = await User.findById(req.user.id).populate('role').select('-password');
    if(role == 'driver'){
        totalCases = await Triage.find({
            driver: req.user.id
        });
    }
    else{
        totalCases = await Triage.find({
            paramedics: { $in: [req.user.id] }
        });
    }
    if(accessibles.includes(role)){
        return res.status(200).render('profile', {totalCases: totalCases.length, user});
    }
    else if(noAccess.includes(role)){
        return res.status(200).render('profile', { layout: 'layouts/noAccessLayout', totalCases: totalCases.length, user});
    }
    return res.status(200).render('profile', { layout: 'layouts/userLayout', totalCases: totalCases.length });
});

// get edit profile page
export const getEditProfile = asyncHandler(async (req, res) => {
    try{
        const user_id = req.user.id;
        const user = await User.findById(user_id).populate('role').select('-password');
        if(!user){
            return res.status(404).render('error', { message: 'User not found' });
        }
        const accessibles = ['admin', 'superadmin'];
        const noAccess = ['driver', 'stockmanager', 'shiftmanager']
        

        const role = user.role.name;
        if(accessibles.includes(role)){
            return res.status(200).render('editProfile', { user, role });
        }
        else if(noAccess.includes(role)){
            return res.status(200).render('editProfile', { user,role: user.role.name, layout: 'layouts/noAccessLayout'});
        }
        return res.status(200).render('editProfile', { user,role: user.role.name, layout: 'layouts/userLayout'});
    }catch(error){
        console.log(error);
        const err = new Error('Something went wrong');
        error.statusCode = 400;
        throw err;
    }
});

// edit user profile
export const editProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('role').select('-password');
        if (!user) {
            return res.status(404).render('error', { message: 'User not found' });
        }
        const { profileImage, bloodType, phone } = req.body;
        if (profileImage[1] !== '') {
            user.profileImage = profileImage[1];
        }
        if (bloodType) {
            user.bloodType = bloodType;
        }
        if (phone) {
            user.phone = phone;
        }
        await user.save();
        res.cookie('user', user, { httpOnly: (process.env.NODE_ENV) === 'production' });
        res.status(200).redirect('/profile');
    } catch (error) {
        console.log(error)
        const err = new Error('Something went wrong');
        error.statusCode = 400;
        throw err;
    }
});

// Get all users
export const getUsers = asyncHandler(async (req, res) => {
    try {
        const layout = getLayoutName(req);
        const user_id = req.user.id;
        const user = await User.findById(user_id).populate('role').select('-password');
        if(user.role.name == 'admin' || user.role.name == 'superadmin'){
            const users = await User.find({}).populate('role');
            return res.status(200).render('allUsers', { users, addUser: true, layout });
        }
        const users = await User.find({
            shiftDays: { $in: user.shiftDays }
        })
        .populate('role');
        return res.status(200).render('allUsers', { users, addUser: false, layout });   
    } catch (error) {
        console.log(error);
        const err = new Error('Something went wrong');
        error.statusCode = 400;
        throw err;
    }
});

// Admin edit user
export const getEditUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('role').select('-password');
        if (!user) {
            return res.status(404).render('error', { message: 'User not found' });
        }
        const roles = await Role.find({});
        return res.status(200).render('editUser', { user, roles });
    } catch (error) {
        console.log(error);
        const err = new Error('Something went wrong');
        error.statusCode = 400;
        throw err;
    }
});

// delete user
export const deleteUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('error', { message: 'User not found' });
        }
        const done = await User.findByIdAndDelete(req.params.id);
        if(done){
            return res.status(200).json({ message: 'User deleted successfully' });
        }
        return res.status(400).json({ message: 'User not deleted' });
    } catch (error) {
        return res.status(400).json({ message: 'Server Error' });
    }
});


// admin update user
export const editUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('error', { message: 'User not found' });
        }
        const { username, role, password, phone, status, shiftDays } = req.body;
        const roleName = await Role.findById(role);
        console.log('username: ', username);
        console.log('role: ', role);
        console.log('password', password);
        console.log('phone: ', phone);
        console.log('status: ', status);
        console.log('shiftDays: ', shiftDays);
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await User.findByIdAndUpdate(req.params.id, {
                username,
                role,
                password: hashedPassword,
                phone,
                status,
                shiftDays
            });
            return res.status(200).json({ message: 'User updated successfully' });
        }
        await User.findByIdAndUpdate(req.params.id, {
            username,
            role,
            phone,
            status,
            shiftDays
        });
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Server Error' });
    }
});

export const getMostParamedic = asyncHandler(async(thisMonth = false)=>{
    let startOfMonth;
    let endOfMonth;
    if(thisMonth){
        startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
    }
    else{
        startOfMonth = new Date(new Date().getFullYear(), 0, 1);
        endOfMonth = new Date(new Date().getFullYear() + 1, 0, 1);
    }


    const result = await Triage.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startOfMonth,
                    $lt: endOfMonth
                }
            }
        },
        {
            $unwind: "$paramedics"
        },
        {
            $group: {
                _id: "$paramedics",
                caseCount: { $sum: 1 }
            }
        },
        {
            $sort: { caseCount: -1 }
        },
        {
            $limit: 1
        }
    ]);
    if(result.length > 0){
        const user = await User.findById(result[0]._id).select('username');
        
        return { user: user.username, caseCount: result[0].caseCount }; ;
    }
    return null;
})

export const getUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('role').select('-password');
        let totalCases = 0;
        if(user.role.name == 'driver'){
            totalCases = await Triage.find({
                driver: user.id
            });
        }
        else{
            totalCases = await Triage.find({
                paramedics: { $in: [user.id] }
            });
        }

        if (!user) {
            return res.status(404).render('error', { message: 'User not found' });
        }
        return res.status(200).render('user', { user, totalCases: totalCases.length });
    } catch (error) {
        console.log(error);
        const err = new Error('Something went wrong');
        error.statusCode = 400;
        throw err;
    }
});