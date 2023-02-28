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
const bcrypt_1 = require("../Utilities/bcrypt");
const userModel_1 = __importDefault(require("../Models/userModel"));
class AuthRepository {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashPassword = yield new bcrypt_1.Encryption().bcrypt(user.passwordDigest);
            const newUser = yield userModel_1.default.create({
                firstName: user.firstName,
                lastName: user.lastName,
                passwordDigest: hashPassword,
                phoneNumber: user.phoneNumber,
                email: user.email,
                verificationCode: user.verificationCode
                //verificationCode: user.verificationCode,
            });
            return newUser;
        });
    }
    authenticate(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOne({ email });
            if (!user) {
                return undefined;
            }
            const checkPassword = yield new bcrypt_1.Encryption().compare(password, user.passwordDigest);
            if (!checkPassword) {
                return undefined;
            }
            else {
                return user;
            }
            ;
        });
    }
    activateAccount(verificationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOneAndUpdate({
                verificationCode,
            }).select("+verificationCode");
            return user;
        });
    }
    forgotPassword(code, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOne({ email });
            const updateUserCode = yield userModel_1.default.updateOne({ email }, { verificationCode: code });
            return updateUserCode ? user : false;
        });
    }
    resetUser(newPassword, email, RandomeCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOne({ email });
            const hashPassword = yield new bcrypt_1.Encryption().bcrypt(newPassword);
            const updateUserPassword = yield userModel_1.default.updateOne({ email }, { passwordDigest: hashPassword }, { verificationCode: RandomeCode });
            let newUser = updateUserPassword ? user : false;
            return newUser;
        });
    }
}
exports.default = AuthRepository;
