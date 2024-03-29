const User = require('../models/user');
const Token = require('../models/token');
const {sendEmail} = require('../utils/index');
const bcrypt = require('bcryptjs');

// @route POST api/auth/register
// @desc Register user
// @access Public
exports.register = async (req, res) => {
    try {
        const { email, password, username, fullname } = req.body;

        // Check if email is already registered
        const user = await User.findOne({ email });

        if (user) {
            return res.status(401).json({
                success: false,
                status: 401,
                error: {
                    message: 'The email address is already associated with another account.'
                }
            });
        }

        // Validate and hash the password
        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    message: 'Password should be at least 6 characters long.'
                }
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the hashed password
        const newUser = new User({ 
            email, 
            password: hashedPassword, 
            username, 
            role: "basic", 
            fullname,
            country: null,
            city: null,
            mobileNumber: null 
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // You can now send a verification email if needed
        // await sendVerificationEmail(savedUser, req, res);

        res.status(200).json({
            success: true,
            status: 200,
            data: {
                message: 'Registration successful',
                savedUser
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                message: 'Internal server error',
                reference_code: 'ERR-500-INTERNAL'
            }
        });
    }
};



// @route POST api/auth/login
// @desc Login user and return JWT token
// @access Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                status: 401,
                error: {
                    message: 'The email address ' + email + ' is not associated with any account. Double-check your email address and try again.'
                }
            });
        }

        const passwordsMatch = bcrypt.compare(password, user.password);

        console.log("password match", passwordsMatch)

        if (!passwordsMatch) {
            return res.status(401).json({
                success: false,
                status: 401,
                error: {
                    message: 'Invalid email or password'
                }
            });
        }

        // Make sure the user has been verified
        if (!user.isVerified) {
            return res.status(401).json({ 
                success: false,
                status: 401,
                type: 'not-verified', 
                error:{
                    message: 'Your account has not been verified.' 
                }
            });
        }

        // Login successful, write token, and send back user
        res.status(200).json({
            success: true,
            status: 200,
            data: {
                token: user.generateJWT(), 
                user: user,  
                message: 'Login successful'
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ===EMAIL VERIFICATION
// @route GET api/verify/:token
// @desc Verify token
// @access Public
exports.verify = async (req, res) => {
    if(!req.params.token) return res.status(400).json({message: "We were unable to find a user for this token."});

    try {
        // Find a matching token
        const token = await Token.findOne({ token: req.params.token });

        if (!token) return res.status(400).json({ message: 'We were unable to find a valid token. Your token my have expired.' });

        // If we found a token, find a matching user
        User.findOne({ _id: token.userId }, (err, user) => {
            if (!user) return res.status(400).json({ message: 'We were unable to find a user for this token.' });

            if (user.isVerified) return res.status(400).json({ message: 'This user has already been verified.' });

            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) return res.status(500).json({message:err.message});

                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route POST api/resend
// @desc Resend Verification Token
// @access Public
exports.resendToken = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});

        if (user.isVerified) return res.status(400).json({ message: 'This account has already been verified. Please log in.'});

        await sendVerificationEmail(user, req, res);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

async function sendVerificationEmail(user, req, res){
    try{
        const token = user.generateVerificationToken();

        // Save the verification token
        await token.save();

        let link="http://"+req.headers.host+"/api/auth/verify/"+token.token;

        let mailOptions = {
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: 'Account Verification Token',
            html: `<p>Hi ${user.firstName}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
                       <br><p>If you did not request this, please ignore this email.</p>`
          };

        // let subject = "Account Verification Token";
        // let to = user.email;
        // let from = process.env.FROM_EMAIL;
        // let link="http://"+req.headers.host+"/api/auth/verify/"+token.token;
        // let html = `<p>Hi ${user.username}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
        //           <br><p>If you did not request this, please ignore this email.</p>`;

        await sendEmail(mailOptions);

        res.status(200).json({message: 'A verification email has been sent to ' + user.email + '.'});
    }catch (error) {
        res.status(500).json({message: error.message})
    }
}

// @route GET api/user/{id}
// @desc Returns a specific user
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const user = await User.findById(id);

        if (!user) return res.status(401).json({message: 'User does not exist'});

        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route PUT api/user/{id}
// @desc Update user details
// @access Public
exports.update = async function (req, res) {
    try {
        const updates = req.body.update;
        const id = req.params.id;

        const user = await User.findByIdAndUpdate(id, {$set: updates}, {new: true});

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({
            success: true,
            status: 200,
            data: {
                user: user,  
                message: 'User details updated'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                message: 'user details could not be updated'
            }
        });
    }
};


// @route PUT api/auth/change-password
// @desc Change user password
// @access Private (Requires authentication)

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id; // Assuming you have a middleware to extract user id from the request

        // Fetch the user from the database
        const user = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    message: 'User not found.'
                }
            });
        }

        // Check if the old password provided matches the current password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        console.log('isPasswordValid:', isPasswordValid); // Log the value

        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                status: 401,
                error: {
                    message: 'Incorrect old password.'
                }
            });
        }

        // Validate and hash the new password
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    message: 'New password should be at least 8 characters long.'
                }
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password with the new hashed password
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({
            success: true,
            status: 200,
            data: {
                message: 'Password changed successfully.'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                message: 'Internal server error',
                reference_code: 'ERR-500-INTERNAL'
            }
        });
    }
};
