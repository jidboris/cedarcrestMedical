import { Encryption } from '../Utilities/bcrypt';
import UserType  from '../Interface/userType';
import User from "../Models/userModel";

export default class AuthRepository {
    public async createUser(user: UserType): Promise<UserType> {
        const hashPassword = await new Encryption().bcrypt(
            user.passwordDigest
        );
        const newUser = await User.create ({
            firstName: user.firstName,
            lastName: user.lastName,
            passwordDigest: hashPassword,
            phoneNumber: user.phoneNumber,
            email: user.email,
            verificationCode: user.verificationCode
            //verificationCode: user.verificationCode,
    });
        return newUser;
    }

    public async authenticate(email: string, password: string): Promise<UserType[] | undefined> {
        const user:any = await User.findOne({ email });
        if (!user) {return undefined}
        const checkPassword = await new Encryption().compare(
            password,
            user.passwordDigest
        );
        if (!checkPassword) {return undefined}
    else{return user};
    }
    
    public async activateAccount(verificationCode: number|undefined): Promise<UserType[] | false> {
        const user:any = await User.findOneAndUpdate({
            verificationCode,
        }).select("+verificationCode");
    return user;
}
    public async forgotPassword(code: any | number, email: any ): Promise<UserType | false> {
        const user: any = await User.findOne({ email });
        const updateUserCode:any = await User.updateOne(
            { email },
            {verificationCode: code},
            );

        return updateUserCode ? user : false;
    }
    public async resetUser(newPassword: any , email: any , RandomeCode: any): Promise<UserType | false> {
        const user: any = await User.findOne({ email })
        const hashPassword = await new Encryption().bcrypt(
            newPassword
        );
        const updateUserPassword: any = await User.updateOne({email},
             {passwordDigest: hashPassword },
             {verificationCode: RandomeCode })
        let newUser: UserType | false = updateUserPassword ? user : false;
        return newUser;
    }
    
}