"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const appError_1 = require("../Utilities/Errors/appError");
const userModel_1 = __importDefault(require("../Models/userModel"));
const response_1 = require("../Utilities/response");
const bcrypt_1 = __importDefault(require("../Utilities/bcrypt"));
const mailer_1 = __importDefault(require("../Email/mailer"));
const bcrypt_2 = require("../Utilities/bcrypt");
const authRepository_1 = __importDefault(require("../Repository/authRepository"));
const authRepository = new authRepository_1.default();
const mail = new mailer_1.default();
dotenv_1.default.config();
class AuthService {
    createUserService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, passwordDigest, phoneNumber, email, role } = req.body;
                const code = crypto_1.default.randomInt(100000, 1000000);
                const newUser = {
                    firstName,
                    lastName,
                    passwordDigest,
                    role,
                    phoneNumber,
                    email,
                    verificationCode: code
                };
                // Check if user email exist
                const isUserExist = yield userModel_1.default.findOne({ email });
                if (isUserExist) {
                    return res.status(400).json({
                        success: false,
                        error: ' User already exist, verify your account or login if already verified',
                        message: 'Registration failed!',
                    });
                }
                const user = yield authRepository.createUser(newUser);
                if (!user) {
                    return res.status(400).json({
                        success: false,
                        error: 'Unable to create user',
                        message: 'Registration failed',
                    });
                }
                else {
                    const message = `<p>Hello ${user.firstName},</p>
                <p>Welcome to DeliveryCog Platform. Please verify your 
                email address with the OTP code below. It would expire after 10mins.<p>
                <p>OTP: <b>${user.verificationCode}</b></p>`;
                    const userInfo = {
                        firstName: user.firstName,
                        email: user.email,
                        subject: 'Verify your Cedarcrest Account',
                        code: Number(user.verificationCode),
                        message,
                    };
                    yield mail.sendOTP(userInfo);
                    return res.status(201).json({
                        user,
                        success: true,
                        message: 'Account successfully created, Check your mail for activation code',
                    });
                }
                ;
            }
            catch (error) {
                res.status(400).json({
                    error
                });
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                // Check if user exist
                const userCheck = yield userModel_1.default.findOne({ email });
                if (!userCheck) {
                    return res.status(404).json({
                        success: false,
                        error: 'Incorrect Email',
                        message: 'Login failed!',
                    });
                }
                // Check if user is verified 
                if (userCheck.isVerified === false) {
                    return res.status(422).json({
                        success: false,
                        message: 'User account is not active, Kindly activate account',
                    });
                }
                // If user is verified,generate token for user
                if (userCheck.isVerified === true) {
                    const token = yield bcrypt_1.default.generateAccessToken(userCheck);
                    const newDate = () => {
                        const currentdate = new Date();
                        const datetime = `Last Sync: ${currentdate.getDate()}/${currentdate.getMonth() + 1}/${currentdate.getFullYear()} @ ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;
                        return datetime;
                    };
                    // Send login success message to user
                    const message = ` <p>Welcome to DYC Platform ${userCheck.firstName}, we notice you just login your account at time: ${newDate()}
            if you didn't initiate this login, please change your password now.
                someone may be trying to gain access to your account</p>`;
                    const userInfo = {
                        firstName: userCheck.firstName,
                        email: userCheck.email,
                        subject: 'Login Notification',
                        message,
                    };
                    const profile = {
                        email: userCheck.email,
                        firstName: userCheck.firstName,
                        lastName: userCheck.lastName,
                        expiresIn: 1800,
                        token,
                    };
                    res.setHeader('Set-Cookie', token);
                    res.cookie('token', token, {
                        expires: new Date(Date.now() + 1800),
                    });
                    //await mail.sendLoginConfirmation(userInfo);
                    res.status(200).json((0, response_1.response)({ message: 'Login Successful', data: profile }));
                }
                else {
                    return res.status(403).json((0, response_1.response)({
                        message: 'Failed login attempt',
                        error: 'Incorrect password',
                        success: false,
                    }));
                }
            }
            catch (error) {
                return next(new appError_1.AppError(`something went wrong here is the error ${error}`, 500));
            }
        });
    }
    activateAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield userModel_1.default.findOne({ email });
                if (!user) {
                    return res.status(404).json({
                        message: 'Resource for user not found',
                        success: false,
                    });
                }
                if (user.isVerified == true) {
                    return res.status(409).json({
                        message: 'Email already verified',
                        success: false,
                    });
                }
                const verifyCode = user.verificationCode;
                if (verifyCode == req.body.verificationCode) {
                    return res.status(400).json('The code provided is wrong ');
                }
                const updatedUser = userModel_1.default.updateOne({ "_id": user.id }, { $set: { "isVerified": true } }, { returnOriginal: false }).exec();
                if (!updatedUser) {
                    return res.status(500).json('updatedUser failed, try again later');
                }
                // send success mail for account activation        
                const message = `<p>Welcome to DeliveryCog ${user.firstName}
                             your account have been activated.<p>`;
                const userInfo = {
                    firstName: user.firstName,
                    email: user.email,
                    subject: 'Welcome to DeliveryCog',
                    message,
                };
                // await mail.sendWelcome(userInfo);
                return res.status(201).json({
                    userInfo,
                    success: true,
                    message: 'User account activated successfully, Now you can login'
                });
            }
            catch (error) {
                return next(new appError_1.AppError(`something went wrong here is the error ${error}`, 500));
            }
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // User enters email and the database is searched for the email
                const { email } = req.body;
                const user = yield userModel_1.default.findOne({ email });
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        error: `User with email: ${email} not found`,
                        message: 'Forgot Password failed!',
                    });
                }
                const code = crypto_1.default.randomInt(100000, 1000000);
                // generate code for user to reset password            
                const resetUser = userModel_1.default.updateOne({ "_id": user.id }, { $set: { "verificationCode": code } }, { returnOriginal: false }).exec();
                if (!resetUser) {
                    return res.status(500).json({
                        success: false,
                        error: `Forgot Password Failed`,
                        message: `Kindly try again`
                    });
                }
                // Send email containing code for password reset        
                const message = `<p>
                        ${user.firstName}, <br> 
                        Someone has requested a code to change your password. You can do this through the link below.  <br> 
                        Code: ${user.verificationCode}
                        <br> 
                        If you didn't request this, please ignore this email. Your password won't change until you access the link above and create a new one.
                        <br> 
                        Thanks,  <br> 
                        Team DeliveryCog <p/>`;
                const data = {
                    email,
                    firstName: user.firstName,
                    code: user.verificationCode,
                    subject: 'DeliveryCog Password Reset Sent',
                    message,
                };
                //TODO refactor email to house message and only take required data(clean up)
                // mail.sendForgotPassword(data);
                return res.status(200).json((0, response_1.response)({
                    data,
                    success: true,
                    message: 'Password Reset code Sent',
                }));
            }
            catch (error) {
                return next(new appError_1.AppError(`something went wrong here is the error ${error}`, 500));
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, confirmPassword, verificationCode, email } = req.body;
                // User enter email to check its existense    
                const userExist = yield userModel_1.default.findOne({ email });
                if (!userExist) {
                    return res.status(404).json({
                        success: false,
                        error: `User with email: ${email} not found`,
                        message: 'Forgot Password failed!',
                    });
                }
                const confirmCode = userExist.verificationCode;
                if (!confirmCode === verificationCode) {
                    return res.status(404).json((0, response_1.response)({
                        error: 'Invalid code',
                        message: 'Please provide a valide code',
                        success: false,
                    }));
                }
                // Check if password and confirmPassword are correct and take it in as new password 
                const newPassword = password === confirmPassword ? password : res.status(404).json((0, response_1.response)({
                    error: "password doesn't match",
                    message: 'Ensure password is same with the one provided',
                    success: false,
                }));
                // Hash newPassword    
                const hashPassword = yield new bcrypt_2.Encryption().bcrypt(newPassword);
                if (!hashPassword) {
                    return res.status(500).json((0, response_1.response)({
                        error: 'Error updating password',
                        message: `Password for user with email ${email} not updated`,
                        success: false,
                    }));
                }
                // Update hashed newPassword in database
                const resetPassword = userModel_1.default.updateOne({ "_id": userExist.id }, { $set: { "passwordDigest": hashPassword } }, { returnOriginal: false }).exec();
                if (!resetPassword) {
                    res.status(500).json({
                        message: 'Password reset failed'
                    });
                }
                // change verification code after password reset
                const code = crypto_1.default.randomInt(100000, 1000000);
                const resetUser = userModel_1.default.updateOne({ "_id": userExist.id }, { $set: { "verificationCode": code } }, { returnOriginal: false }).exec();
                if (!resetUser) {
                    res.status(500).json({
                        message: 'code reset failed'
                    });
                }
                // Send password reset succes mail to user email
                const message = `<p>
                    Hi ${userExist.firstName}, <br> 
                    You have successfully reset your password.
                      <br> 
                    Team DeliveryCog <p/>`;
                const data = {
                    email: email,
                    firstName: userExist.firstName,
                    subject: 'Password Reset Successfully',
                    message,
                };
                //await mail.sendResetSuccess(data);
                return res.status(200).json((0, response_1.response)({
                    success: true,
                    message: 'Password successfully reset'
                }));
            }
            catch (error) {
                return next(new appError_1.AppError(`something went wrong here is the error ${error}`, 500));
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie('token');
            res.removeHeader('Set-Cookie');
            res.status(200)
                .json((0, response_1.response)({ message: "Logout Successfully" }));
        });
    }
}
exports.default = AuthService;
