export declare const generateOTP: () => string;
export declare const generateJWT: (userId: string) => string;
export declare const verifyJWT: (token: string) => {
    userId: string;
} | null;
export declare const getOTPExpiry: () => Date;
//# sourceMappingURL=auth.d.ts.map