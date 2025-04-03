import  userModel from '../models/user.models.js';
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';
import redisClient from '../services/redis.service.js';
export const createUserController = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }       
    try {
        const user = await userService.createUser(req.body.email, req.body.password);
        const token = await user.generateJWT();
        return res.status(201).json({user,token});
    } catch (error) {
        return res.status(500).json(error.message);
    }
    
    
}
export const loginController = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }       
    try {
        const {email,password}=req.body;
        const user = await userModel.findOne({email}).select('+password');
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        const isValid = await user.isValidPassword(password);
        if(!isValid){
            return res.status(401).json({message: 'Invalid credentials'});
        }
        const token = await user.generateJWT();
        delete user._doc.password;
        return res.status(200).json({user,token});
    } catch (error) {
        return res.status(500).json(error.message);
    }
}
export const profileController = async (req, res) => {
    
    return res.status(200).json(req.user);
}
export const logoutController = async (req, res) => {
    try {
        const token =  req.cookies.token || req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message: 'Please authenticate'});
        }
        redisClient.set(token, 'logout','EX', 60*60*24);
        return res.status(200).json({message: 'Logged out successfully'});
    } catch (error) {
        return res.status(500).json(error.message);
    }
}
export const getAllUsersController = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });

        return res.status(200).json({
            users: allUsers
        })

    } catch (err) {

        console.log(err)

        res.status(400).json({ error: err.message })

    }
}
