import express, { Request, Response, NextFunction } from 'express';
import AuthService from '../Services/authService';

const authService = new AuthService()   

export default class authController {
public async create(req: Request, res: Response, next: NextFunction) {
    const newUser = await authService.createUserService(req, res, next);
    return newUser  
}

public async activateAccount(req: Request, res: Response, next: NextFunction) {
   return await authService.activateAccount(req, res, next);
};

public async authenticate (req: Request, res: Response, next: NextFunction) {
    return await authService.login(req, res, next);
};

public async logout (req: Request, res: Response, next: NextFunction) {
    return await authService.logout(req, res, next);
};

public async forgotPassword (req: Request, res: Response, next: NextFunction) {
    return await authService.forgotPassword(req, res, next);
};

public async resetPassword(req: Request, res: Response, next: NextFunction) {
    return await authService.resetPassword(req, res, next);
};
}
