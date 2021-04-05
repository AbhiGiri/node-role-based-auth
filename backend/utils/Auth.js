const bcrypt = require('bcryptjs');
const passport = require('passport');
const { SECRET } = require('../config');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


//To register the user['user', 'admin', 'super-admin']
const userRegister = async (userDetails, role, res) => {
    try {
        //validate the username
        console.log(userDetails);
        let userNameNotTaken = await validateUserName(userDetails.userName);
        console.log(userNameNotTaken);
        if(!userNameNotTaken) {
            return res.status(400).json({success: false, message: 'UserName is already taken.'});
        }
        
        //validate the email
        let emailNotRegistered = await validateEmail(userDetails.email);
        if(!emailNotRegistered) {
            return res.status(400).json({success: false, message: 'Email is already registered.'});
        }

        //get hashed password
        const password = await bcrypt.hash(userDetails.password, 12);
        const newUser = new User({
            ...userDetails,
            password,
            role
        });

        await newUser.save();
        return res.status(201).json({success: true, message: 'you are registerd now..., please login'});
    } 
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `unable to register ${err}}`
        })
    }
}

//To Login the user['user', 'admin', 'superAdmin']
const userLogin = async (userCreds, role, res) => {
    let { userName, password } = userCreds;
    //first check userName is in DB or not
    const user = await User.findOne({userName});
    if(!user) {
        return res.status(404).json({success: false, message: 'userName is not found. Invalid credentials.'});
    }
    //check role
    if(user.role !== role) {
        return res.status(403).json({success: false, message: 'please make sure, you are loggin in from the right portal.'});
    }
    //if above all true then now check password
    let isMatch = bcrypt.compare(password, user.password);
    if(isMatch) {
        //sign in the token and issue it from the user
        let token = jwt.sign({
            _id: user._id,
            role: user.role,
            userName: user.userName,
            email: user.email
        }, SECRET, {expiresIn: '1h'});

        
        let result = {
            userName: user.userName, 
            role: user.role, 
            email: user.email,
            token: `Bearer ${token}`,
            expiresIn: '1hr'
        }
        
        return res.status(200).json({
            success: true,
            message: 'you r now logged in.',
            ...result
        });
    }
    else {
        res.status(403).json({
            success: false,
            message: 'incorrect password'
        });
    }
}

// validate userName
const validateUserName = async (userName) => {
    let user = User.findOne({userName});
    return user ? true : false;
}
const validateEmail = async (email) => {
    let userEmail = User.findOne({email});
    return userEmail ? true : false;
}
const checkRole = roles => (req, res, next) => {
    console.log(req.user);
    !roles.includes(req.user.role)
        ? res.status(401).json('Unauthorized...')
        : next();
}

const userAuth = passport.authenticate('jwt', {session: false});
const serializeUser = user => {
    return {
        userName: user.userName,
        email: user.email,
        name: user.name,
        _id: user._id,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
    }
}

module.exports = {
    userAuth,
    checkRole,
    userLogin,
    userRegister,
    serializeUser
}