import jwt from 'jsonwebtoken';

export default function createToken(id, role) {
    try {
        if (!id || !role) {
            throw new Error('Some required fields are missing');
        }

        const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        return token;
    } catch (error) {
        console.error('Error creating token:', error.message);
        return null;
    }
}