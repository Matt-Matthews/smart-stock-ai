export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    company: {
        id: string;
        name: string;
    }
}