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
const authService_1 = __importDefault(require("../Services/authService"));
const authService = new authService_1.default();
class authController {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield authService.createUserService(req, res, next);
            return newUser;
        });
    }
    activateAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield authService.activateAccount(req, res, next);
        });
    }
    ;
    authenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield authService.login(req, res, next);
        });
    }
    ;
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield authService.logout(req, res, next);
        });
    }
    ;
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield authService.forgotPassword(req, res, next);
        });
    }
    ;
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield authService.resetPassword(req, res, next);
        });
    }
    ;
}
exports.default = authController;
