import  userModel from '../models/user.models.js';

 export const createUser = async (email, password) => {

    if(!email || !password){
        throw new Error('Email and password are required');
    }
    const hashedPassword = await userModel.hashPassword(password);
    const user= userModel.create({email, password: hashedPassword});
    return user;
}
// export default {createUser};
export const getAllUsers = async ({ userId }) => {
    const users = await userModel.find({
        _id: { $ne: userId }
    });
    return users;
}