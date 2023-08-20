export type LoginResult = {
    token: string;
    user: {
        id: any;
        name: string;
        email: string;
        role: string;
    };
};
