

export interface IAddUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userRoleId?: string;
    companyId: string;
}