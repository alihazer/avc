import Role from '../models/Roles.js';
import User from '../models/User.js';


// Add a new role

export const addRole = async (req, res) => {
    try {
        const name = req.body.name;
        const permissions = req.body.permissions;
        const alreadyExists = await Role.findOne({ where: { name: role.name } });
        if (alreadyExists) {
            return res.status(400).render('addRole', { message: 'Role already exists' });
        }
        const role = await Role.create({ name, permissions });
        res.status(201).render('addRole', { message: 'Role created successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get all roles
export const getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).render('roles', { roles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get role by id
export const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).render('error', { message: 'Role not found' });
        }
        res.status(200).render('role', { role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update role by id
export const updateRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).render('error', { message: 'Role not found' });
        }
        const name = req.body.name;
        const permissions = req.body.permissions;
        await role.update({ name, permissions });
        res.status(200).render('role', { role });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete role by id
export const deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).render('error', { message: 'Role not found' });
        }
        await role.destroy();
        res.status(204).render('roles', { message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// manage permissions for a role
export const managePermissions = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).render('error', { message: 'Role not found' });
        }
        const permissions = req.body.permissions;
        await role.update({ permissions });
        res.status(200).render('role', { role });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
