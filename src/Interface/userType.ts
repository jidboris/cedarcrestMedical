type UserType = {
    userId?: string;
    firstName: string;
    lastName: string;
    email: string;
    //mobile: number;
    passwordDigest: string;
    role: string,
    phoneNumber: number;
    //password: string;
    isVerified?: boolean;
    active?: boolean;
    verificationCode?: number;
    location?: string;
};

export default UserType;
