import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import  * as authmiddleware from    
'../middlewares/auth.middleware.js';
const router = Router();
router.post('/register',
    body('email').isEmail().withMessage('Email is required'),        
    body('password').isLength({ min: 3 }).withMessage('Password is required'),
    userController.createUserController 
);

router.post('/login',
    body('email').isEmail().withMessage('Email is required'),        
    body('password').isLength({ min: 3 }).withMessage('Password is required'),
    userController.loginController);


router.get('/profile',
    authmiddleware.authUser,
    userController.profileController
 );
 router.get('/logout',
    authmiddleware.authUser,
    userController.logoutController
 );

 router.get('/all',
    authmiddleware.authUser,
    userController.getAllUsersController
 );
export default router;

