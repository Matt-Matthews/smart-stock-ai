export interface User {
    firstName: string;
    lastName: string;
    email: string;
    company: {
        id: string;
        name: string;
    }
}