"use strict";
/* import User from '../Models/userModel';
import UserType from '../Interface/userType';


export default class Validation {
    where = async (email: string): Promise<UserType | undefined> => {
        const user: any = await User.findOne({email});
        if (user.length > 0) {
            return user;
        }
        return undefined;
    };
    whereAnd = async (email: string): Promise<UserType | undefined> => {
        const user: any = await User.findOne({email})
        if (user.length > 0) {
            return user;
        }
        return undefined;
    };
    isVerified = async (email: string): Promise<boolean | undefined> => {
        const user: any = await User.findOne({email});
        if (user.is_verified) {
            return true;
        }
        return false;
    };
}
 */ 
