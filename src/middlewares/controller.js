const md5 = require('md5');
const bcrypt = require('bcryptjs');
const User = require('../models/model.js');
const AccessToken = require('../models/accessTokenModel.js');
const passport = require('passport');
var LocalStrategy = require('passport-local');
const config = require('../config/Constants.js');
const jwt = require('jsonwebtoken');

// const registerUser = async (req, res) => {
//     try {
//         const { username, password, email, id, firstName, lastName } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({
//             username,
//             password: hashedPassword,
//             email,
//             id,
//             firstName,
//             lastName
//         });
//         await newUser.save();
//         res.status(200).json({ message: 'User registered successfully' });
//     } 
//     catch (err) {
//        console.error(err.message);
//        res.status(500).send('Server Error');
//     }
// };



// const loginUser = async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(400).json({ error: 'Invalid username or password' });
//         }
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(400).json({ error: 'Invalid username or password' });
//         }
//         // creating token if the username/password requests are fulfilled which expires in 1 hour
//         const token = md5(new Date().toISOString() + user._id); // access token generated with md5 hashing alogorithm
//         const expiry = new Date(new Date().getTime() + (60 * 60 * 1000)); // expiration set for 1 hour

//         const newAccessToken = new AccessToken({
//             user_id: user._id,
//             access_token: token,
//             expiry: expiry
//         });
//         await newAccessToken.save();
//         // responded with generated access token and expiration time
//         res.status(200).json({ access_token: token, expires_in: '1 hour' });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };


const registerUser = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            firstName,
            lastName
        });

        await newUser.save();
        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


const loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info.message });
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({ message: 'Logged in successfully' });
        });
    })(req, res, next);
};

// const getUser = async (req, res) => {
//     try {
//         const access_token = req.query.access_token;
//         const user = await User.findOne({ _id: access_token });
//         if (!user) {
//             return res.status(400).json({ error: 'Invalid access token' });
//         }
//         res.status(200).json(user);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };

// Removed requirement of access token in get user call, data can be retrived using userId/Mongo objectId

const getUser = async (req, res) => {
    try {
        const userId = req.query.id; // Get user ID from params
        const user = await User.findOne({ _id: userId }); 
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteUser = async (req, res) => {
    try {
        const access_token = req.headers['access_token'];
        const user = await User.findOne({ _id: access_token });
        if (!user) {
            return res.status(400).json({ error: 'Invalid access token' });
        }
        await User.deleteOne({ _id: access_token });
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
       console.error(err.message);
       res.status(500).send('Server Error');
    }
};

const listUsers = async (req, res) => {
    try {
        const page = parseInt(req.params.page);

        // Value provided the user or else the default value from the config file is taken
        const usersPerPage = req.body.usersPerPage  || config.usersPerPage;

        const skip = (page - 1) * usersPerPage;
        const users = await User.find().skip(skip).limit(usersPerPage); 
        
        res.status(200).json(users);
    } 
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// added logic for address insertion and saving it into the database 

const addAddress = async (req, res) => {
    try {
        const { user_id, address, city, state, pin_code, phone_no } = req.body;
        const access_token = req.headers['access_token'];
        const user = await User.findOne({ _id: user_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.addresses.push({ address, city, state, pin_code, phone_no });
        await user.save();
        res.status(200).json({ message: 'Address added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


const deleteAddresses= async (req, res) => {
    const address_ids = req.body.address_ids;
    const access_token = req.params.access_token;
    if (!address_ids || !Array.isArray(address_ids) || address_ids.length === 0) {
        return res.status(400).json({ error: 'Address IDs array is required' });
    }
    try {
        const user = await User.findById(access_token);
        User.updateOne(
            { },
            { $pull: { addresses: { _id: { $in: address_ids } } } }
         )
         
        await User.save();
        return res.status(200).json({ message: 'Addresses deleted successfully' });
    } catch (error) {
        console.error('Error deleting addresses:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Generates password reset token for 15 minutes based on email verification from the User Schema'
// JWT token is generated based on email and JWT_SECRET key 

const generatePasswordResetToken = async(req, res) =>{
    try {
        const { email } = req.body;                    
        const user = await User.findOne({ email });   
        if (!user) {
          return res.status(404).json({ message: "Email not found" });
        }
        const token = jwt.sign(
          { email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: 15*60000 } 
        );
        res.status(200).json({ token, message:"Token Expires in 15 minutes" });
      } 
      catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }

}

// verifyAndResetPassword Controller would take three arguments from the request body -> JWT Token, newPassword and confirmPassword 
// then it would match new password and confirm password 
// it would match JWT Token along with the email that was used to generate the token 
// if token matched it would save the new encrypted password
// catch block to check for expired tokens 

// after every successful password change the jwt token would be stored in a blacklist and before every consecutive change request
// it would check if the token had been previously used 

const verifyAndResetPassword = async(req, res) =>{
    try {
        const { token, newPassword, confirmPassword } = req.body;
        
        const blacklistToken = await User.findOne({ blToken:token});
        if (blacklistToken) {
            return res.status(400).json({ message: 'JWT Token Already Used' });   // check if token had been already used
        }

        if (newPassword != confirmPassword) {
          return res.status(400).json({ message: "New password and confirm password do not match" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken || !decodedToken.email) {
          return res.status(400).json({ message: "Invalid token" });
        }

        const user = await User.findOne({ email: decodedToken.email });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        User.password = hashedPassword;
        User.updateOne(
            { },
            { $push: { jwtBlacklist: { blTonken:token } } }
         )           // after the token is used, push it into blacklist token array so that it cant be used again
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
        } 
      
        catch (error) {
            console.error(error);
            if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
              res.status(401).json({ message: "Invalid or expired token" });
            } else {
             res.status(500).json({ message: "Internal Server Error" });
            }
        }
}   

module.exports = { registerUser, loginUser, getUser, deleteUser, listUsers, addAddress, deleteAddresses, generatePasswordResetToken, verifyAndResetPassword };
