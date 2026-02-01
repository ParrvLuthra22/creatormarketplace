export const validateEmail = (email: string): boolean => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }

    if (!/\d/.test(password)) {
        return { valid: false, message: 'Password must contain at least 1 number' };
    }

    return { valid: true };
};

export const validateFullName = (fullName: string): { valid: boolean; message?: string } => {
    if (!fullName || fullName.trim().length < 2) {
        return { valid: false, message: 'Full name must be at least 2 characters' };
    }

    return { valid: true };
};
