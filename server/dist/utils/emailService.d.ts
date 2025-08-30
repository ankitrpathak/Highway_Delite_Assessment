declare class EmailService {
    private transporter;
    constructor();
    sendOTP(email: string, otp: string, name: string): Promise<boolean>;
    verifyConnection(): Promise<boolean>;
}
declare const _default: EmailService;
export default _default;
//# sourceMappingURL=emailService.d.ts.map