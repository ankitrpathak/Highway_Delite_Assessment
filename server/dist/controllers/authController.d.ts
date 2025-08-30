import { Request, Response } from 'express';
export declare const signup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyOTP: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const resendOTP: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserProfile: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map