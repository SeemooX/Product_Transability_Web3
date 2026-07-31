import type { Role } from "./roles";

export interface UserForm {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: Role;
    walletAddress: string;
    companyName: string;
}