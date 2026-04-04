import User from '../models/user.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const generateToken = (user) => {
    return jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, 
        {expiresIn: '1d'
    })
}


// API to create a new user
export const createUser = async (req, res) => {
    try{
    const {name, email, password, role} = req.body;

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message: "User already exists"})
    }

    const user = new User({
        name,
        email,
        password,
        role
    })
    await user.save();
    res.status(201).json(user);
} catch (error) {
    res.status(500).json({message: "Error creating user", error: error.message});
    }
}


// API to get all the users
export const getAllUsers = async (req, res) => {

    try{
        const users = await User.find().select('-password');
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({message: "Error fetching users", error: error.message});
    }
}


// API to update user role
export const updateUserRole = async (req, res) => {
    const { role } = req.body;
    try{
        const {id} = req.params; 
        const user = await User.findByIdAndUpdate(
            id,
            {role: role},
            {new: true, runValidators: true}
        )
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({message: "Error updating user role", error: error.message});
    }
}

// API to delete a user
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try{
        const user = await User.findOneAndDelete(
            id
        )
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({message: "Error deleting user", error: error.message});
    }
}


// API to update user status (active/inactive)
export const updateUserStatus = async (req, res) => {
    const { isActive } = req.body;
    try{
        const {id} = req.params;
        const user = await User.findByIdAndUpdate(
            id,
            {isActive: isActive},
            {new:true, runValidators: true}
        )
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({message: "Error updating user status", error: error.message});
    }
}

